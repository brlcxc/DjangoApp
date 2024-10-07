# FE Dev Guide

The FE has been refactored for development in React

Clone repo to your machine, (have Node.js installed), and run:
```
npm i
```
From your terminal inside the directory frontend/

To spin up a local server, run:
```
npm run dev
```
I have it set to automatically open the server in a new tab in your default browser. If you dislike this behavior, you can set
```
open: false
```
within the vite.config

This config will also host the server on your local network, so you can visit it with another device on your local network, if you want to test on mobile, etc.

For now, add any React components you write to the src/components/ folder. Remember the name should be capitalized and the extension for these files is .jsx (Javascript with XML). We'll set up routing soon, but for now if you want to test, just import your file into App.jsx and wrap it in the return statement as a DOM element. If anyone has questions, I'm happy to answer them or point you to relevant React docs. Tailwind CSS is also installed, so please do any styling using Tailwind utility classes rather than modifying index.css

(If you're curious, index.jsx is our injection point for React and App.jsx is our main app. I also removed ESLint from the project as I felt it was unnecessary for now)
