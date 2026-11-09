# Pixel Art Drawer

Pixel Art Drawer is a browser application for creating tiny grid based pixel artworks.

## Features

- Adjustable grid sizes
- Custom color palette picker
- Pencil and eraser tools
- Flood fill bucket tool
- JSON data export modal

## How it works

The application dynamically builds a grid of button elements based on the selected dimension. JavaScript listens to mouse interactions to paint, erase or flood fill connected pixels with the active color. The grid state can be exported as structured data into a modal text area.

## Run

Open `index.html` in a browser. No install or build step.

## Files

- `index.html`: Main document structure and interface
- `script.js`: Drawing logic and user interactions
- `style.css`: Visual styling and theme rules
