## Overview

My earliest memory of Old School RuneScape is a conversation two of my friends were having in what I think was the fourth grade. Eric said to another friend (I don't remember who; sorry, other friend) that he had some armor and weapons for sale in the game. I asked what they were talking about and learned about RuneScape for the first time. That evening, I tried playing the game on our home PC, but it wouldn't load; just a black page. At that age, computers were still a big mystery to me. I didn't know I probably needed to install Java, or what that even meant, much less how to do it. 

By the next year, I'd switched schools and soon enough RuneScape came up again. This time it was my friend Michael telling me about it. He helped me get it installed (probably walked me through the Java installation, too) and I was immediately hooked. I remember getting so pumped when I'd get home from school and hear the login music... Man, I could get chills just remembering those days. Days of friends and simplicity. I'm very grateful to have experienced those years the way I did because I know not everyone was so fortunate. 

![Jaiden excited to play on the computer -- any ideas what game he's about to play?](/img/ge-skiller-article-images/img-1.png)

Fast-forward 20 years and I'm still playing RuneScape. Like probably millions of others, when it was announced they were bringing _our_ version of the game back as a standalone title, I was ecstatic. 

In late 2023, I found myself wishing I had an idea for a web project to spend some time on so I'd been on the lookout for ideas. One day, as I was thinking about this game and my ongoing issue of being perpetually poor within it, I found myself wishing for a tool that would analyze my account and tell me the most profitable items I could produce given my skill levels, quest completion status, and so on. I realized this idea was as good as any, and got to work. 

## Early days

Though it's undergone many iterations, GE Skiller has always been a SvelteKit app. I started before the Runes feature was introduced and tried several UI options before finally landing on [shadcn-svelte](https://www.shadcn-svelte.com) and developing the app into what it has become today. 

In the spirit of Svelte's "it works with anything JS" approach, I wanted to find a component library that was minimal and as simple as possible. That first landed me on [Pico CSS](https://picocss.com). Less of a component library and more of a stylized CSS reset, Pico gave me a decent jumping-off point to help flesh out the most basic ideas of the app. 

I knew I wanted to:

- see items from in-game
- filter those items based on which ones I could make (with smithing, crafting, fletching, etc)
- see a breakdown of what materials went into creating a given item

With those ideas in mind, and Svelte and Pico in my toolbelt, I set out to create my first prototype. Pico was a 
pleasure to use, but I wanted something more fully featured. I was in a place where I was alright with leaning on a 
component library, and while I saw the value in Pico, I still wanted more. 

Despite a massive data loss event in 2024, a couple of videos of the app from that time survived 🥹. Here's one showing 
what it looked like early on with the above goals in mind. 

::article-video{src="/img/ge-skiller-article-images/img-2.mp4"}
::

Soon after, I discovered [skeleton.dev](https://skeleton.dev). Skeleton was a Svelte-only component library, and the
best one at that. It offered more high-quality Svelte components than any other Svelte-based option at the time. It
was an obvious choice. 

::article-video{src="/img/ge-skiller-article-images/img-3.mp4"}
::

Soon after making the pivot to Skeleton, however, its developers embarked on a journey to transform Skeleton into much 
more than just a component library. I was excited to watch its transformation into the powerhouse design system it has
become today, but I decided to sit out the migration to later versions of Skeleton, so to an extent I started over on 
GE Skiller. (I'd still love to use Skeleton again on a future project 😉)

By this time, the Svelte component library ecosystem had matured, and I found that a favorite of mine, 
[shadcn-ui](https://ui.shadcn.com), had been ported to Svelte. After checking out the 
[port](https://www.shadcn-svelte.com), I knew I had to try it. That was when GE Skiller in its current form began. Up 
until this point, it had been called "OSRS GE Skiller" (and you can actually still access the old repo with Skeleton 
[here](https://github.com/JaidenDeChon/osrs-ge-skiller)), so I renamed it to the much catchier "GE Skiller."

_(Sarcasm, obviously. If you can think of a better name PLEASE let me know.)_

## The ~~Emperor~~ Website's New Clothes

::article-image-pair{left-src="/img/ge-skiller-article-images/img-13.png" right-src="/img/ge-skiller-article-images/img-14.png" left-alt="GE Skiller website before restyling" right-alt="GE Skiller website after restyling"}
::

With shadcn-svelte in my corner, it was time to go to work recreating the app. I started with the homepage and basic 
app layout, and those haven't changed much since its creation. As a "just for fun" thing, each time the page is loaded 
or refreshed, you'll get one of 15 or so iconic NPCs and outfits from the game.

![GE Skiller homepage](/img/ge-skiller-article-images/img-4.png)

Next, I designed the database. Any in-game item could theoretically have ingredients that make it up, so it was important 
to allow for recursion in ingredients. Despite using a JSON-based DB (as opposed to SQL, for example), I went with 
what was essentially still a "foreign key" approach where every item would exist independently and simply reference 
other items if they had ingredients. The full contents of that nested data can be hydrated before showing it to the 
user. 

With that in mind, I took my 20-something hard-coded items and inserted them into the database. Paired with an assist 
from the OSRS Prices wiki, each card now showed a price and some other helpful info. Now we're cooking!

![GE Skiller cards UI](/img/ge-skiller-article-images/img-5.png)

By now you can also see the app has taken on a new aesthetic. While it's similar to many apps out there today, I enjoy 
this look and feel satisfied making a website that looks so clean. I'm sure this look will eventually grow as tired as 
the original Material Design, but today we enjoy it!

![GE Skiller cards UI](/img/ge-skiller-article-images/img-12.png)