## New ventures

In early 2024, I was living in a nice, quiet neighborhood in Nortwest Florida. My neighbors, a retired couple, ran a nonprofit that cared for animals in need. They'd helped us when we had a raccoon issue in our attic, brought over a tall ladder when our cat escaped and ran up a tree, and were always happy to keep an eye on our house when we went out of town. 

The approached me near the start of that year to ask for my help. They were opening a low-cost spay/neuter clinic in our neighborhood and needed a software solution to manage the place. They had looked at other software solutions, but they were either too expensive or didn't have the features they needed. They wanted something that was easy to use, affordable, and could handle appointments, patient records, and inventory management, but also be cloud-accessible for freedom in how it's used. 

After giving it some thought, I decided to take on the project. My plan would be to build the software they needed, and then offer it to other similar clinics for free until I had built up a genuine user base. Those clients would have to agree to provide feedback for the software, but in exchange, they received indefinite access for getting in on the ground floor and helping me turn it into something strong. 

My favorite part of a project is architecting a brand new one, and if I've learned anything about doing so, it's that you _must_ be careful about the decisions you make. Similar to one degree of change making a huge difference in the direction of a ship, small choices made at the beginning must be the right ones for the project. I enjoy the process of envisioning what a project will become and putting together an architecture that will lay the path for success. 

For this app, I knew I had to take great care to get these decisions right. This wasn't a low-stakes videogame app like my last personal project was, and I didn't have a team backing up (read: auditing) my decisions like the high-stakes application development of my professional life, so I had to get this right. 

I knew enough about what was needed to whip up a basic app for a proof of concept, so I got to work. 

## The tech stack

For almost every app I spin up, Progressive Web Apps are the way to go. I rarely have the need for a mobile app and I'm most at home writing for the web stack, so it makes sense. We have a couple options: write **separate server and client apps** or choose one of the popular full-stack metaframeworks. I used SvelteKit to build GE Skiller and Nuxt to build the site you're browsing now, but never NextJS. 

In terms of learning, selecting NextJS might be the best choice, but we're not going for learning this time -- we need stability, so familiarity would behoove us here. I'm **primarily a Vue developer**, so that gives us an easy frontend decision. 

From here, we have three choices: 

1. choose a backend server framework
2. decide to use NuxtJS instead of picking a backend
3. go with a "backend as a service" such as Firebase or Supabase

After a lot of consideration, I decided to go with a mix of options 2 and 3. Nuxt would give us an easy way to add backend functionality from within the same repository, while a "Backend as a Service" would provide straightforward database, authentication, authorization, and RBAC functionality. 

The last big question to answer was how to handle the UI. I've used a ton of UI and component libraries that I love. From the minimal and lightweight [PicoCSS](https://picocss.com/) to the heavier, more fully-featured [PrimeVue](https://primevue.org), there were a ton of different options. But the last time I tried whipping something up with NuxtUI, I had a great experience, so I decided to go with that.

So that settles our biggest stack questions: We'll build a **NodeJS PWA** using **NuxtJS** for the frontend and backend, we'll use **Firebase** for our database and authentication needs, and **NuxtUI** will make everything look awesome. 

## The setup

Now that we had our stack settled, it was time to pour the foundation. Since I knew this application would require tenancy, and that it would be harder to retroactively apply authentication logic than to just begin with it in mind, I set up a Firebase project and some users, then wired up some routes. To keep things simple, the home route would be the login route, and from the very beginning, even when the app was nothing but a sign-in page and an empty dashboard, you had to authenticate to gain access to anything else. This gave me a lot of confidence to move forward and I think I'll continue using that approach on future projects. 

Once authentication was working, I got to work setting up some routes with dummy data. I started with routes for a dashboard, clients list (basically a page with a searchable, paginated clients table), individual client route, and inventory, and got to work populating them with realistic dummy data. This is a great way to get a feel for the app and make sure I had the right routes and data structures in mind before I got too far into development. The "dummy data" approach has burned me before, but as long as you go about it carefully, it can be very powerful for illuminating the path forward. 

![Lucy VPMS dashboard with upcoming appointments and clinic alerts](/img/lucy-vpms-article-images/img-1.png)

![Lucy VPMS clients list route showing a searchable, paginated table of clients](/img/lucy-vpms-article-images/img-2.png)

![Lucy VPMS individual client route with pets, billing ledger, and payment methods](/img/lucy-vpms-article-images/img-3.png)

![Lucy VPMS inventory route listing stock, reorder levels, suppliers, and expiration dates](/img/lucy-vpms-article-images/img-4.png)

![Lucy VPMS settings route with notification preferences](/img/lucy-vpms-article-images/img-5.png)

NuxtUI and Tailwind were a combination that made this process particularly easy. While I pride myself on my frontend and CSS/layout skills, the temptation of using pre-made NuxtUI / Tailwind blocks proved to be too alluring, and that was the route I went with for a large portion of the frontend work. Some of it is still quite custom, but if you paruse through the pre-made NuxtUI blocks, you'll see a lot of familiar patterns between my app and the blocks. This feels a little cheap, but at the same time, it's kind of the purpose for the blocks. In any case, the app feels much more mature than it probably would have otherwise at this stage, so I'm happy with the decision. 

## Becoming a Product Owner