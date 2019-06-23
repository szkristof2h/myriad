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
 - Node.js
 - Express
 - MongoDB
 - Passport for authentication (currently only for google)
 - Webpack 4
 - React
 - CSS-in-JS (styled-components)

## Goal
I started working on this project to learn, experiment and practice with new features of various frameworks, libraries, etc., I use. I felt that I have neglected actual practice with some of them --like React-- so I decided to create a smaller project where practice is a lot easier. This also means that I might use alpha or beta versions of dependencies.

## Roadmap (mostly in order of importance)
 1. Implement facebook and twitter social login
 2. Add option to embed youtube videos
 1. Fix the css mess (currently in the process of refactoring components to use CSS-in-JS)
 2. Make tags better and creating some kind of browsing component
 2. Create better loader component(s) to use with suspense
 3. Implement unit testing
 4. Experiment with webpack for better performance

## Known issues
 1. Some pages are really slow to load: investigate what causes the performance issues
 2. Opened youtube video posts' main area isn't responsive
