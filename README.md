<p align="center">
![Logo](/images/logo.svg?raw=true)
</p>

Nodes is a poorly coded yet fully functional Vue.js node graph editor. It features multiple data types, retina support, a (probably) endless canvas, a compact mode, a working calculator sample with 8 node types, an outdated design and unintuitive controls.

<p align="center">
  ![Example](/images/compact1.png?raw=true)


  [**Try it online!**](https://nodes.okat.best/)
</p>

## How to use

Hit `Space` to open the node picker. Click and drag a node to move it, or the background to move around the canvas. To link two nodes, click and drag from any output towards the input you want to connect. To break a link, right click on its input port. To make a node compact, double click on it.

## Setup

Since it is not a library this project is not available on any package manager. This is simply an experiment, and you should not be using any of it in a production project. If you'd like to try it out, you can go to the version I host, or run your own by cloning/downloading the content of this repository and running `npm run dev` like any other Vue project.

## How it works

The main idea is to use three layers. The first layer contains the nodes themselves, which are simple divs. A second layer under draws node links using a full screen canvas. Finally, a simple SVG image is offset using CSS properties to show the grid background. Nodes are represented as simple objects in a Vuex store, containing display and link information. Display nodes then work back through links to compute the value they should display.


## But why?

Because I like node graphs and I have always wanted to try building an editor. The goal was to build a simple yet functional system just for the challenge. I decided to build it with Vue to have it run on the web, and to have an excuse to learn more about Canvas. I just jumped in with little thought and sort of built it hackathon-style, then refined as I went until I eventually stopped.


## Can I use it/contribute?

Sure, but you should probably start your own from scratch. I built this in about two evenings and it was an interesting experience, I recommend you do the same. My goal was never to make good or reusable code, so it's neither good nor reusable. If you do decide to work on such a system, I would suggest adding the following:

 - Grid system
 - Multiple node selection, dragging, and deletion system
 - Sort nodes on Z by last selection
 - Data types (for example: Boolean, Vector...)

## Alright then.

Cool. I'm on Twitter if you have questions and stuff: https://twitter.com/OKatBest
