type ChangeSafe<T> = {
  result: T;
  version: number;
  next: <U>(fn: (arg: T) => U) => ChangeSafe<U>;
};

export function changeSafe<T>(args: () => T, version = 0): ChangeSafe<T> {
  let result = args();
  return {
    result,
    version,
    next<U>(fn: (arg: T) => U) {
      return changeSafe(() => fn(result), version + 1);
    },
  };
}

// How it should work:
// const { version, migrate } = changeSafe(() => {
//   return { name: "John", age: 20 };
// }).next(person => {
//   return { ...person, occupation: "programmer" };
// });

// const x = migrate(); // {result: { name: "John", age: 20, occupation: "programmer" }, version: 1}
// const y = migrate(0, { name: "Sarah", age: 100 }); // {result: { name: "Sarah", age: 100, occupation: "programmer" }, version: 1}

/**
TO DO:
- also there is no way to call the transforms on actual data. AHHHH YOU IDIOT
- write the tests for this
- also, find a way to get the schema type
- also see if there is a way to automatically increment the schema version
 */
