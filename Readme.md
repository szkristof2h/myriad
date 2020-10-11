# Myriad

[![Dependency Status][dep-status-img]][dep-status-link] [![devDependency Status][dev-dep-status-img]][dev-dep-status-link]


[dep-status-img]: https://david-dm.org/szkristof2h/myriad.svg
[dep-status-link]: https://david-dm.org/szkristof2h/myriad
[dev-dep-status-img]: https://david-dm.org/szkristof2h/myriad/dev-status.svg
[dev-dep-status-link]: https://david-dm.org/szkristof2h/myriad?type=dev

> [Myriad Demo](https://myriad-demo.herokuapp.com) hosted on Heroku (gets memory issues sometimes, but haven't found any good alternative yet)

## About
**Myriad** is a website for browsing user submitted content that are sorted by popularity: users can share images, websites, etc., and the Myriad will sort them to three tiers depending on the number of upvotes/downvotes they get. The first tier is the most popular (visitors can browse by tags, users or without any filter).
 - A single post is loaded from the first tier, in the center of the page
 - The second tier posts surround the first tier post
 - Similarly, the third tier posts frame the second tier ones

This means that, although each of the more popular posts fill up a larger area by themselves, the overall number of less popular posts will always be higher. This hopefully creates better balance between the tiers.

## Frameworks, libraries, etc
 - Typescript
 - Node.js
 - Express
 - MongoDB
 - Webpack 4
 - React
 - CSS-in-JS (styled-components)

## Goal
I started working on this project to learn, experiment and practice with new features of various frameworks, libraries, etc., I use. I felt that I have neglected actual practice with some of them --like React-- so I decided to create a smaller project where practice is a lot easier. This also means that I might use alpha or beta versions of dependencies.

## Roadmap (mostly in order of importance, finished ones at the end of the list)
 1. Test & fix bugs after re-deployment (the site is up at heroku once again mostly functional, but there're still some issues to work out)
 1. Make tags better and creating some kind of browsing component (*on hold until **#1** finishes*)
 1. Implement facebook and twitter social login
 1. Improve Profile page
 2. Create better loader component(s) to use with suspense
 3. Implement unit testing
 1. Fix the css mess ~~(currently in the process of refactoring components to use CSS-in-JS) (2020)~~
 4. Experiment with webpack for better performance
 1. ~~Convert js -> ts on the backend (*in progress*)~~ (2020. 09. 14.)
 6. ~~Try coming up with a better solution for handling requests~~
    1. ~~*Backend*: Create error handler for each request~~ 
    1. ~~*Frontend*: Come up with a better way to handle `isLoading` and `cancel()` (`axios`)~~
 1. ~~Convert js(x) -> ts(x) on the frontend~~ (2020. 01. 19.)
 8. ~~Fix eslint config~~ (2019)
 2. ~~Add option to embed youtube videos~~ (2019)

## Known issues
 1. I'm still very much in the process of learning typescript, so types, interfaces, etc might not be consistent & they might have issues
 1. Some pages are really slow to load: investigate what causes the performance issues
 2. Opened youtube video posts' main area isn't responsive
 3. ~~Spreading an object to a React component messes up its type~~
