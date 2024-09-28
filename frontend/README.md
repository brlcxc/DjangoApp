# Front-End Dev Guide
First of all, you'll want Node.js installed. Here's a guide to that: https://www.theodinproject.com/lessons/foundations-installing-node-js

Assuming you do, we'll be using npm to install packages/dependencies (including Tailwind, Vite, and possibly React). This is common practice in web development. The package.json tells npm exactly what dependencies are needed to run the project. Pretty neat!

The first thing you'll want to do after you clone the repo is run this command from the terminal (in the same directory as package.json):
```
npm i
```
That will install all necessary packages. Then, if you want to run a local server:
```
npm run dev
```
I have a script that tells Vite to spin up a local server when you do. (If it wasn't clear, this server updates dynamically! No need to refresh your browser to see your changes in real time.) If you look inside the vite.config.js file you'll find some settings I chose for this. I have host : true, which means the server will actually run on your local IP so you can connect to it from other devices (like a phone) for testing. I also have open : true; This automatically opens a tab in your default browser connected to the server. I like this behavior personally, but if you find it annoying you can set that to false while you work

My suggestion to get started on a login page would be to create a new .html file for your login page and either link to it from index.html or change the name of it temporarily to index.html (and change index to something else) so that it's the first page that comes up when you spin up the server.

We're using Tailwind, per Commerce Bank's requirements, and I would recommend looking up the docs so you have some understanding of how it works. Or this handy cheat sheet: https://flowbite.com/tools/tailwind-cheat-sheet/

If you're familiar at all with CSS, it's actually not that scary. Also, make sure you install the Tailwind CSS Intellisense extension for VS Code! It's a lifesaver. Check out the little example I made in the index.html. You just apply Tailwind classes to an element as shown, separated by a space. Since Tailwind moves most the CSS into .html, we shouldn't have too many conflicts if we work on separate .html pages.

All that being said, I'm still open to using React. And nothing about this project structure is really incompatible with that. It would probably be good not to do *too* much UI work in HTML/JS if we do plan on using React, so let's try to decide soon. But for now I think we can play around with some basic UI stuff and API calls and just wanted to get the project setup/make sure everyone was familiar with Vite

Final note, source files (that's your .html, .css, .js, pretty much any code) are in src/ and any assets you want to use (that's images, fonts, etc.) should go in static/. A cool thing about Vite is that I can tell it to treat static as a public directory, meaning all those files will be loaded as if they're at the root of our website. Also, we'll surely start extending the Tailwind theme soon. You're welcome to modify the config or you can leave that to me if it seems intimidating for now. I'll add our custom colors, for ex., as soon as we agree on a palette. I'd like to agree on some custom fonts as well.

Best of luck! -Jacob