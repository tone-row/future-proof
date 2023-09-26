# future-proof

Dealing with changes in the shape of your application's data over time can be a challenging task. The conventional methods often result in a complicated mess, making it hard to ensure that your data is always up-to-date. This is where [future-proof](https://github.com/tone-row/future-proof) comes into play.

Here's how you can define migration steps using Future-proof:

```typescript
// In the beginning
const initialState = { x: 0, y: 0 };
const { version, migrate } = from({ x: 0, y: 0 }).init(initialState);
```
As your data evolves, you can add migration steps:

```typescript
// Later on
const initialState = { x: 0, y: 0, z: 0 };
const { version, migrate } = from({ x: 0, y: 0 })
  .to((state) => ({ ...state, z: 0 }))
  .init(initialState);
```
Each to function takes a callback that receives the current state object and returns a new state object with the desired changes.

Applying migrations is as simple as calling the migrate function with your data object and its version:

```typescript
const data = migrate(
  {
    x: 200,
    y: 200,
  },
  0
);
```
Future-proof has been designed with Zustand persisted stores in mind, making it a seamless integration:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { from } from "future-proof";

type State = { x: number; y: number; z: number; θ: number };
const initialState: State = {
  x: 100,
  y: 100,
  z: 100,
  θ: 0,
};

const { version, migrate } = from({
  x: 100,
  y: 100,
})
  .to((data) => ({ ...data, z: 100 }))
  .to((data) => ({ ...data, θ: 0 }))
  .init(initialState);

const useStore = create<State>()(
  persist((set) => initialState, {
    name: "my-persisted-store",
    version,
    migrate,
  })
);
```

By using Future-proof, you can confidently change the shape of your data as your app evolves, keeping your data migration logic clean and easy to read.
