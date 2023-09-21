# from-to-now

The `from-to-now` npm package is a simple and lightweight utility that allows you to migrate your data from one version to another. It provides a fluent interface to define migration steps and apply them to your data.

## Installation

```shell
npm install from-to-now
```

## Basic Usage

```javascript
import { from } from "from-to-now";

// The initial state object, changes as our application evolves
const initialState = {
  x: 100,
  y: 100,
  z: 100,
  θ: 0,
};

const { version, migrate } = from({
  x: 100,
  y: 100,
})
  .to((state) => ({
    ...state,
    z: 100,
  }))
  .to((state) => ({
    ...state,
    θ: 0,
  }))
  .now(initialState);
```

### Defining Migration Steps

You can define your migration steps using the `from` function, which takes an initial state object as a parameter. It returns an object with a fluent interface, allowing you to chain multiple `to` functions to define your migration steps.

Each `to` function takes a callback function that receives the current state object and returns a new state object with the desired changes. You can add as many `to` functions as necessary to transform your data.

Here's an example of defining migration steps:

```javascript
const { version, migrate } = from({
  x: 100,
  y: 100,
})
  .to((state) => ({
    ...state,
    z: 100,
  }))
  .to((state) => ({
    ...state,
    θ: 0,
  }))
  .now(initialState);
```

In this example, we start with an initial state object containing `x` and `y` properties. We apply two transformation steps using the `to` function to add `z` and `θ` properties to the state object. Finally, we call the `now` function with the initial state object to get the final version of the state, along with the version number and the `migrate` function.

### Applying Migration

To apply the migration to your data, you can call the `migrate` function with the data object and the desired version number. The `migrate` function will return the migrated data object.

Here's an example of applying migration:

```javascript
const data = migrate(
  {
    x: 200,
    y: 200,
  },
  0
);
```

In this example, we pass the data object with `x` and `y` properties, along with the version number `0`. The `migrate` function will return the migrated data object, which includes the properties `x`, `y`, `z`, and `θ`.

## Usage with Zustand

This utility was created to help with migrating data in persisted [Zustand](https://github.com/pmndrs/zustand) stores. Here's an example of how you can use it with Zustand:

```javascript
import { create } from "zustand";
```
