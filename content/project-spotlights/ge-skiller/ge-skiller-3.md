

Soon after making the pivot to Skeleton, however, its developers embarked on a journey to transform Skeleton into much 
more than just a component library. I was excited to watch its transformation into the powerhouse design system it has
become today, but decided to sit out the migration to later versions of Skeleton and so, to an extent, I started over 
on GE Skiller. (I'd still love to use Skeleton again on a future project 😉)

By this time the Svelte component library ecosystem had had time to mature, and I found that a favorite of mine, 
[shadcn-ui](https://ui.shadcn.com), had been ported to Svelte. And after checking out the 
[port](https://www.shadcn-svelte.com), I knew I had to try it. That was when GE Skiller in its current form began. Up 
until this point, it had been called "OSRS GE Skiller," (and you can actually still access the old repo with Skeleton 
[here](https://github.com/JaidenDeChon/osrs-ge-skiller)), so I renamed it to the much more catchy "GE 
Skiller."

_(Sarcasm, obviously. If you can think of a better name PLEASE let me know.)_

## The ~~Emporer~~ Website's New Clothes

With ShadCN-Svelte in my corner, it was time to go to work recreating the app. I started with the homepage and basic 
app layout and those haven't changed much since its creation. As a "just for fun" thing, each time the page is 
loaded/refreshed, you'll get one of 15 or so iconic NPCs and outfits from the game.

![GE Skiller homepage](img/ge-skiller-article-images/img-4.png)

Next, I designed the database. Any in-game item could theoretically have ingredients that make it up, so it was important 
to allow for recursivity in ingredients. Despite using a JSON-based DB (as opposed to SQL, for example), I went with 
what was essentially still a "foreign key" approach where every item would exist independently and simply reference 
other items if they had ingredients. The full contents of that nested data can be hydrated before showing to the user. 

With that in mind, I took my 20-something hard-coded items and inserted them into the database. Paired with an assist 
from the OSRS Prices wiki, each card now showed a price and some other helpful info. Now we're cooking!

![GE Skiller cards UI](img/ge-skiller-article-images/img-5.png)

By now you can also see the app has taken on a new aesthetic. While it's similar to many apps out there today, I enjoy 
this look, and feel satisfied making a website that looks so clean. I'm sure this look will eventually grow as tired as 
the original Material Design, but today, we enjoy it!

![GE Skiller cards UI](img/ge-skiller-article-images/img-12.png)

I used an older, well-established library called [echarts](https://echarts.apache.org/en/index.html) to render the item 
ingredients tree. To my surprise, this lended itself very well to an SPA-style application where, instead of linking 
between actual pages, the contents of the same page are simply replaced. Because of this behavior, the chart will 
animate between pages. Try opening [the page](https://ge-skiller.netlify.app/items/1295) in the screenshot above and 
then clicking one of the ingredients within the tree to see what I mean!

## Welcome to Mongoland - Population 10,000

MongoDB was meant for massive amounts -- _huMONGOus_ amounts, in fact -- of data. But I just love using it because it's 
so simple. I populated my MongoDB collection with items by using a tool named [OSRSBox](https://www.osrsbox.com), and 
later, a more up-to-date derivative named [osrsboxed-db](https://github.com/0xNeffarion/osrsreboxed-db). The resulting 
10,000 items might make MongoDB overkill but I find the ease of use to be well worth reaching for something so powerful.

The way I did the DB populating was one of the most fun and novel parts of the entire experience. No one has time to 
crawl thousands of individual items, pulling their data piece-by-piece to populate a DB, so this was when I decided to 
get some more experience using LLMs. My initial idea was to see if I could have an agentic LLM crawl the Wiki and 
extract all of the data I needed, but this was proving unreliable and difficult to set up. I pivoted to a more 
traditional approach:

1. Clone the osrsboxed-db repo for local access to item data (tens of thousands of items!)
2. Write a script that extracts the items into the MongoDB collection
3. Write a script that reads the Wiki for each item and pulls any creation/ingredient data. This step will highlight 
   what items are missing after extracting them all from osrsboxed-db.
4. Write a spider to scrape the missing data

I find LLMs to be hugely beneficial when you have a framework in mind for how to move forward. If you can articulate 
clearly the approach you have in mind, LLMs can often close the gap, or at least get you close. They're wonderfully, 
scarily capable. I used ChatGPT to scaffold most of this code and saved myself quite a lot of time as a result. 

I heard an OpenAI engineer express that, when he's writing his own code, there are two primary bottlenecks: The mind 
and the hands. Either you're slowed down by needing to plan and learn, or you _know_ how to move forward, but you can 
only code so fast. This resonated quite a bit with me because, barring technical hiccups and disruptions, I find it to 
be true. 

I know _how_ to fire off a request to some API endpoint and receive data. I know _how_ to dissect the data, ingest it 
into my app, to get what I need out of it. I know _how_ to write a spider that crawls websites to extracts what I need 
from them. I know _how_ to insert that data into my database. So what do I lose by asking ChatGPT to do it?

I'd lose my old way of working, as it turns out.

## How to Conduct a Symphony

How many hours have you spent learning the things you're good at? By this point, I've spent thousands of hours learning 
web development. I was fortunate enough to get into this field before LLMs were around to erradicate the Junior Dev 
position. But even with the knowledge I have, I can only acheive so much alone. 

If a person wants to make epic, moving pieces of music, how can they do so when they can only play one instrument at a 
time? I suppose they could instead conduct a symphony. 

As a developer, having an LLM to work alongside me massively speeds up my ability to deliver. I can ask a model to 
adjust the padding of this element, the color of that element, the text content on this page and that one. They can 
execute faster than I can, and they can more quickly fill the gaps that may be present in my knowledge. In this way, I 
go from playing one instrument to conducting the whole symphony. The resulting music is amazing despite not playing 
every instrument myself. 

I worked with ChatGPT through the Codex feature (massively underrated, by the way!) to iteratively write and 
course-correct the trickiest parts of the process. I set up environment variables and MongoDB collections, cloned the 
repo of items, then had GPT write the code that would step through each item and upload the relevant data to the 
database. Before an item is written to the database, we parse the Wiki page for the item, looking for ingredients 
within a "Creation" section. 

Many items were missing at this point, but admittedly, I don't know if it's because of _actual missing data_ in 
osrsboxed-db, or if I simply accidentally filtered that many ingredients of items out when dumping the items into my 
database. In either case, the next step was going to involve crawling the wiki for more than just creation specs, so I 
was excited to get started. 

While the spider is a standalone script, I ended up incorporating its functionality into an API endpoint. Only active 
in development, this endpoint allows me to search for item data. It'll grab any info it can from the OSRS Wiki API, and 
for anything else, it'll parse the wiki page for that item. I attached this functionality to an "Add/Edit Items" 
dialog (also only accessible in development) so I now have an easy-to-use UI for adding and editing item data. This 
dialog was actually one of the more impressive moments I had working with Codex. I asked for this dialog to exist as a 
feature, and Codex took about 10 minutes to plan and execute. There were a couple small adjustments needed, but for all 
intents and purposes, it basically nailed this fairly complex feature on the first shot. It kind of blew me away. 

## Vibe Shift

I was at the height of my vibe-coding excitement and productivity on Thanksgiving 2025. The site was now populated with 
about 13,000 items, all of the pages were looking clean, and it was almost ready to start taking on users. I spent the 
whole day coding away, not knowing things would soon change. 

Friday, the next morning, I received a call from my oldest friend Hayden's wife. I knew immediately something had to 
have been wrong -- she didn't call me, ever. Not unless I was with Hayden or there was some such other reason. And now 
she was calling me at 7am? My heart dropped. What happened? 

That was when Mikayla told me tearfully that Hayden, who'd been my closest friend since the fourth grade, had shot 
himself the morning prior. He was now in the ICU in a coma. 

Without thinking I stopped getting ready for work and started getting ready to make the 6-hour drive to south Florida 
where he was hospitalized. It was a long drive there but I arrived that night and saw my friend in the hospital. He 
had a hell of a black eye and his face was very swollen, but otherwise, he just looked like himself. Like Hayden. Like 
he was just sleeping. The nurse was very kind and informed us at every turn of what was happening and why. 

The following week was a blur. I know I went back to work but I can't tell you much about what I did. As I'm writing 
this, it's December 10th; only 2 weeks since the event. I'm still reeling, and yesterday I was informed Hayden will 
soon be taken off life support. My buddy and I have made our last memory together already. 

This project has been an interesting one since because, as a coping mechanism, I dove deeper into working on it. I tell 
myself that it's a distraction from these current events, but really he's halfway on my mind the whole time I'm working 
on this project anyway. It doesn't stop me from thinking about what-ifs. What if I'd called him on Wednesday? Would we 
still be here if I had? And it doesn't stop me from remembering our childhood together. We would ride bikes after 
school every day, often biking to school and leaving from there to go get into whatever trouble we were in for that 
day. Nor does it stop me from feeling so deeply for his daughter, who at only 5 now has this as part of her story. 

Part of what makes this so hard is also a source of relief. For reasons I won't disclose in a public forum like this, 
I believe Hayden wasn't thinking clearly and wasn't in his right mind when he made that decision. He loved his daughter 
too much, fought for his marriage too hard to just peace out like this. He _couldn't_ have been in his right mind. It 
is both heartbreaking and comforting to think this decision isn't the one he would have made, had he been able to think 
with the clarity we usually have. 

As I was writing this section, I received a one-word text from Mikayla: 

> Friday

So, that's it. Friday's the day. On Friday Hayden will be taken off life support and 20 years of memories come to an 
end. It hurts to know there will be no new ones with him. It hurts to know I won't hear his laugh again or get to 
Facetime him while on a walk around the neighborhood to see how things are going. 

I'll never forget his laugh, though. I'll never forget meeting him by recognizing a classmate walking by my house 
with a huge Great Dane Mastiff mix. (His name was Walter and he was an awesome dog). I'll never forget playing all 
the video games we played together. All of the original Halo games. I'll never forget commentating the stunt mode in 
Flatout and acting like a judge's panel with you. I'll never forget emptying a can of Axe spray in my room to cover up a 
fart and making the room smell so much worse than a fart ever could... That room probably smells like Axe body spray to 
this day. I'll never forget playing Halo 3 with you on John's Xbox 360, when you would throw me a pretzel for every one 
you ate, but I wasn't as big of a fan of pretzels as you were, so by 30 minutes in I had about 30 pretzels sitting on 
me and you thought it was the funniest thing. I'll never forget getting into biking with you, and hitting the Walgreens 
jumps after school every day. I'll never forget going boating with you and your parents. Or climbing the mountains and 
fishing together (but catching nothing) in Prescott. Or the trips to Rocky Point. Or how bad you were at the saxophone. 

I'm going to miss you, Hayden. Rest easy, you big dumb bitch. I love you man. 

![Hayden and Jaiden at a Civil Air Patrol Meeting](img/ge-skiller-article-images/img-6.jpg)

![Hayden laughs while eating some ice cream](img/ge-skiller-article-images/img-7.jpg)

![Jaiden and Hayden being silly](img/ge-skiller-article-images/img-8.jpg)

![Jaiden and Hayden in front of an F-100 plane](img/ge-skiller-article-images/img-9.jpg)

![Mikayla and Hayden on their wedding day](img/ge-skiller-article-images/img-10.jpeg)

![Hayden and his mom](img/ge-skiller-article-images/img-11.jpg)
