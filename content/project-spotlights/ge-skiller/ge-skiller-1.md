## Overview

My earliest memory of Old School RuneScape is a conversation two of my friends were having in what I think was the fourth grade. Eric said to another friend (I don't remember who -- sorry, other friend) that he had some armor and weapons for sale in the game. I asked what they were talking about and learned of RuneScape for the first time. That evening, I tried playing the game on our home PC, but it wouldn't load -- just a black page. At that age, computers were still a big mystery to me, and I didn't know I probably needed to install Java, or what that even meant, much less how to do it. 

By the next year I'd switched schools and soon enough uneScape came up again. This time it was my friend Michael telling me about it. He helped me get it installed (probably walked me through the Java installation, too) and I was immediately hooked. I remember getting so pumped when I'd get home from school, and when I heard the login music... Man, I could get chills just remembering those days. Days of friends and simplicity. I'm very grateful to have experienced those years the way I did because I know not everyone was so fortunate. 

![Jaiden excited to play on the computer -- any ideas what game he's about to play?](img/ge-skiller-article-images/img-1.png)

Fast-forward 20 years and I'm still playing RuneScape. Like probably millions of others, when it was announced they were bringing _our_ version of the game back as a standalone title, I was ecstatic. 

In late 2023, I found myself wishing I had an idea for a web project to spend some time on so I'd been on the lookout for ideas. One day, as I was thinking about this game and my ongoing issue of being perpetually poor within it, I found myself wishing for a tool that would analyze my account and tell me the most profitable items I could produce given my skill levels, quest completion status, and so on. I realized this idea was as good as any and got to work. 

## Early days

Though it's undergone many iterations, GE Skiller has always been a SvelteKit app. I started before the Runes feature was introduced, and have used several UI options before finally landing on [shadcn-svelte](https://www.shadcn-svelte.com) and developing what the app into has become today. 

In the spirit of Svelte's "it works with anything JS" approach, I wanted to find a component library that was minimal and as simple as possible. The first place that landed me was with [Pico CSS](https://picocss.com). Less of a component library and more of a stylized CSS reset, Pico gave me a decent jumping-off point to help flesh out the most basic ideas of the app. 

I knew I wanted to:

- see items from in-game
- filter those items based on which ones I could make (with smithing, crafting, fletching etc)
- see a breakdown of what materials went into creating a given item

With those ideas in mind, and Svelte and Pico in my toolbelt, I set out on creating my first prototype. Pico was a 
pleasure to use, but I was looking for more in my component library. I was in a place where I was alright with leaning 
on a component library, and while I saw the value in Pico, I was looking for more. 

Despite a massive data loss event I had in 2024, a couple videos of the app from that time survived 🥹 Here's a video 
of what it looked like early on, with the above goals in mind. 
