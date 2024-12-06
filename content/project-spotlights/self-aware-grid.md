## Part 1 - A challenger approaches

SelfAwareGrid came about due to an interesting design requirement given to me by our UI/UX team. It started as a head-scratcher and ended up becoming my first foray into publishing NPM packages, using GitHub Pages, and contributing to the open-source community in general. 

In 2020, my [Beast Code]([https://www.beast-code.com](https://www.beast-code.com/)) team and I began scaffolding an exciting new project. (For security purposes, I won’t say the real name here. Instead I’ll refer to it as *Super*.) *Super* was something of a special one as its prototype had made waves throughout our customer base about a year prior, and now, that same customer was ready to support full-time development on the project. 

Our UI/UX team brought a strong game and provided us with a sleek, modern design. One of the views in the app would contain a grid of cards. Each card was to expand and grow larger when hovered. Pretty simple, right?

Wrong.

There was a quirk about this design that threw a wrench in my plans. You see, not all cards in our mock-up expanded exactly the same way. Most cards would simply grow in size equally in all directions, but any cards alongside the edges of the grid container (top and bottom, left and right) would expand **away from their edge** rather than expanding out from the center. For example, a card in the **top row** of the grid is **already as high as it can get**, so it must expand downward rather than outward. Likewise, a card in the **far-left column** of the grid is **already as far left as it can get**, so it must expand to the right. Corner cards would combine this logic by expanding away from their respective corner. 

At first, one would think one could throw in a `transform-origin` to knock each of those out and call it a day. Alas, not all requirements are so simple. 

The problem we faced was that this app must be compatible with many common screen sizes, which meant our grid would have different dimensions for different users. Our card expansion animation logic needed to take into account *where in the grid* a given grid child was.

So how do you do this? Well, the short answer is: you can’t. CSS doesn’t provide a way for querying positions of a grid beyond indexes via something like `nth-child`. If you want to know which child is at the bottom left position of your grid, you’re kinda screwed. 

## Part 2 - Screw being screwed

Why accept defeat? There had to be *some* way we could pull this off. I started brainstorming and realized this problem was very similar to one I’d worked with in the past. 

About a year prior to this, my partner landed a software engineering internship at Beast Code. During her internship, she was tasked with creating a game of Battleship in C++. One of the first challenges she faced while building Battleship was that of spatial reasoning: Given the coordinates for a square on the board, we needed to be able to work out which square is above, below, or beside it. We did it using good ol’ math. 

By this point, the Battleship code was long gone, but the lesson remained. There would be a perfect formula for determining which coordinate is above, below, or beside another coordinate, so the next thing to do would turn out to be one of the most fun: the math.

It’s simple math (in fact, that’s probably why my dumb ass thought it was fun. I’m *awful* at math). Here’s how each relative position can be determined:

- **LEFT:** To get the index of the grid child to the **left** of a particular child, use the index - 1.
- **RIGHT:** To get the index of the grid child to the **right** of a particular child, use the index + 1.
- **ABOVE:** Subtract the grid’s column count from the child’s index. For example, if the child in question is at index 4 in a grid of 3 columns, we can find the index of the child directly above it with `4 - 3`. This gives us the correct result of `1`.
- **BELOW:** As above, so below. Except, you know, reversed. Add the column count to the index in order to find the child directly underneath a given child.

And, as mentioned before, requirements are often not so simple. What happens if you try to find a grid child outside the bounds of the grid? For example, a grid child in the top row would have no children above it. We can combine the positional logic with additional boundary checks:

- **Index is in top row:** The grid item’s index will be **less than** the grid’s column count.
- **Index is in bottom row:** The grid item’s index will be **greater than or equal to** the highest possible index in the grid, adjusted for the number of columns.
- **Index is in Nth column:** Providing us a baseline for determining whether a grid item is in the left or right column, we can determine whether a child is in the *Nth* column by dividing the index by the total number of columns and taking the remainder. 
- **Index is in the left column:** Use the Nth-column logic, where N is 0
- **Index is in the right column:** Use the Nth-column logic, where N is the column count minus 1.

Here’s how this logic looks, converted to TypeScript:

```typescript
function isTopRow (gridItemIndex: number): boolean {
	return gridItemIndex < this._columnCount;
}

function isBottomRow (gridItemIndex: number): boolean {
	const columns = this._columnCount;
	const rows = this._rowCount;
	const highestPotentialIndex = rows * columns - 1;
	return gridItemIndex >= highestPotentialIndex - columns + 1;
}

function isNthColumn (childElementIndex: number): number {
	if (!this._children[childElementIndex]) return -1;
	return childElementIndex % this._columnCount;
}

function isLeftColumn (gridItemIndex: number): boolean {
	return this.isNthColumn(gridItemIndex) === 0;
}

function isRightColumn (gridItemIndex: number): boolean {
	return this.isNthColumn(gridItemIndex) === this._columnCount - 1;
}
```

While we’re at it, now that we have these set up, we can add the directional functions described in the first group of bullet points:

```typescript
function getGridItemAbove (gridItemIndex: number): number {
	return this.isTopRow(gridItemIndex)
		? 0
		: gridItemIndex - this._columnCount;
}

function getGridItemBelow (gridItemIndex: number): number {
	return this.isBottomRow(gridItemIndex)
		? this._children.length - 1
		: gridItemIndex + this._columnCount;
}

function getGridItemToTheLeft (gridItemIndex: number, preventWrap?: boolean): number {
	if (preventWrap) return this.isNthColumn(gridItemIndex) === 0
		? gridItemIndex
		: gridItemIndex - 1;
	else return gridItemIndex - 1;
}

function getGridItemToTheRight (gridItemIndex: number): number {
	return gridItemIndex <= this._children.length
		? gridItemIndex + 1
		: gridItemIndex;
}
```

(We also add some extra arguments for preventing wrap behavior when desired, as this doesn’t complicate the logic much at all.)

## Part 3 - Measuring up

Alright, so we have a bunch of logic now. We can determine whether a grid child is in the top, bottom, left, or right column; we can determine whether a grid child is in an arbitrary column; and we can determine which, if any, grid child is above, below, or beside the one in question. In order for these abilities to be useful, however, we have to know the size of the grid we’re working with. So what do we care about in that regard?

- **Minimum child width** - We need to determine the minimum width of grid children if we want to have any hope of calculating the size of the grid as a whole.
- **Column gap width** - How much space is between each column.
- **Row gap width** - How much space is between each row.
- **Column count** - How many columns are in the grid.
- **Row count** - How many rows are in the grid.
- **Column gap count** - How many gaps are between grid columns. This will be the column count minus one.
- **Row gap count** - How many gaps are between grid rows. This will be the row count minus one.

Using these data, we can calculate the size of the grid as a whole, which will serve as our foundation for determining any other information we need. In the SelfAwareGrid code, I have set up an event listener for recalculating these values each time the screen is resized so they always stay current. 