## An intriguing name for a simple package

SelfAwareGrid came about when a design for a customer's website contained a grid of items which would be styled based on their position within the grid. Imagine a simple grid where the elements in the top row of the grid needed to be one color, while elements in the first column needed to be another color. This is simple enough, but the 

[work in progress]

SelfAwareGrid is an NPM package that allows you to easily track the positions of grid children relative to their parent and their siblings. This means you can determine whether grid children are in corners, along edges, or other positional details, such as which grid child is adjacent to another. CSS does not provide a way to target particular rows or columns in a dynamic way (that is, ), so this functionality can prove very helpful when you have a dynamic grid but want to style grid children based on their positions.

Here's a demo to illustrate what I'm talking about. First, I'll show you a normal grid I've styled such that grid children along the edges will use a different color than the rest. Resize this demo to see where the issue arises:

> _demo without it_

I'll apply SelfAwareGrid to this instead, and right away we can observe the difference it made. No matter how we resize the grid, children on along the outside edges maintain their styling, even as the grid is reordered to compensate for the changing dimensions.

> _demo with it, and custom styles enabled_

Since SelfAwareGrid can easily determine which grid children are adjacent to any given child, it can be used to easily implement a keyboard-navigable grid interface akin to what you find in spreadsheet software like Excel.

> _demo of keyboard navigability_

SelfAwareGrid came about due to a design I received for a product at my day job. In this design, there was a dashboard of sorts where cards were arranged in a grid. Whenever you hovered a card, it would expand and grow somewhat. Easy, right? Well, there was a small catch. Or at least, I thought it was a "small catch," until it grew into what became the thing you're reading about here for some reason. 

You see, the cards along the edges of the grid couldn't expand outward in all directions. They needed to expand away from whatever edge they were touching (as opposed to overlapping the edge once it grows). This was to preserve the satisfying "clean edge" look our designers were going for in this particular effort. And if the card was in a corner (read: along two edges), it would have to expand away from _both_ of those. Beyond all of this, the grid needed to be responsive in case the user rotated their device and the dimensions of the grid changed.

So how can we do this? Because, as it turns out, CSS really isn't equipped for this kind of thing.

We can't just use `nth-child(n)` because we expect the number of columns to change. And there isn't such a thing as a `:top-row` pseudo-class or similar. I would have to use math.

The math actually ended up being pretty fun to work out, so I wanted to go over it here. I figured it would be good enough for the first article I put on this site.





_____

## Screw being screwed

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

## Measuring up

Alright, so we have a bunch of logic now. We can determine whether a grid child is in the top, bottom, left, or right column; we can determine whether a grid child is in an arbitrary column; and we can determine which, if any, grid child is above, below, or beside the one in question. In order for these abilities to be useful, however, we have to know the size of the grid we’re working with. So what do we care about in that regard?

- **Minimum child width** - We need to determine the minimum width of grid children if we want to have any hope of calculating the size of the grid as a whole.
- **Column gap width** - How much space is between each column.
- **Row gap width** - How much space is between each row.
- **Column count** - How many columns are in the grid.
- **Row count** - How many rows are in the grid.
- **Column gap count** - How many gaps are between grid columns. This will be the column count minus one.
- **Row gap count** - How many gaps are between grid rows. This will be the row count minus one.

Using these data, we can calculate the size of the grid as a whole, which will serve as our foundation for determining any other information we need. In the SelfAwareGrid code, I have set up an event listener for recalculating these values each time the screen is resized so they always stay current. 
