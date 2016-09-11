# Simple Programs simulator

A web application for simulating simple programs in the vain of Stephen
Wolfram's "A New Kind Of Science".

## Creating new types of programs

To create a new module, do the following:

1. Create a new JS file for the module.
1. In that file, create a new namespace object that will hold all logic for the
   module. The module must return this object.
1. Implement a `load` function and a `run` function for the module.
1. Load the JS file in the head of the main HTML file.
1. Add a button for loading that file to the front page.

## Testing

This application comes with its own lightweight unit testing framework.

TODO: Document testing framework.

## Current capabilities

* One dimensional, binary automata.
