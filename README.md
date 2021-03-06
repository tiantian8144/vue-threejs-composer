# vue-threejs-composer

Build beautiful and interactive scenes in the easy way.

## What?

Today there are already a few libraries out there to create scenes in Vue with Three.js:

- [vue-gl](https://github.com/vue-gl/vue-gl)
- [vue-threejs](https://github.com/fritx/vue-threejs)

These libraries are good for creating simple scenes, as they allow us to easily create basic 3D content.

For more complex ones however, they aren’t enough, as integrating custom components can’t be done with ease. Managing and tracking the loading progress of your assets also becomes more difficult the more assets you use.

This library tries to solve these problems.

## Features

This library focuses on **managing** your Three.js assets, scenes and objects.

As such, it won’t include any basic geometries, materials and so on, as you can implement them yourself very easily.

But rather than speaking about what this library doesn’t handle, here the main strong points:

1. Asset bundles to (pre)load your assets

2. Easily create and organize objects in your scenes.

3. Helpers for loading 3D models and automatically assigning their materials

4. You write your THREE.js objects, we manage them for you: Practically all objects are customizable and accept factory functions.


## Installation

Install THREE.js:
`npm install three --save`

Optionally, install THREE.js typings:
`npm install @types/three --save-dev`

Install this package:
`npm install vue-threejs-composer --save`


## Samples

If you want to test out our samples, you can clone our repository and launch our samples with the following commands:

Install dependencies
`npm install`

Launch development server
`npm run serve`

Play around with the files in */samples*. The demo scene is situated at */samples/views/Demo.vue*


## Documentation

The writing of the documentation is still in progress.
Here however the link to the official documentation: [vue-threejs-composer.netlify.com](https://vue-threejs-composer.netlify.com/)

If you can't find what you are looking for in the documentation, you can also open a new ticket describing your issue.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) for details

## Acknowledgments

- Inspired in some ways by [vue-gl](https://github.com/vue-gl/vue-gl)
