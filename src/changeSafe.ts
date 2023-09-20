// @ts-nocheck
type ChangeSafe<T> = {
  version: number;
  next: <U>(fn: (arg: T) => U) => ChangeSafe<U>;
  migrate: (version?: number) => { result: T; version: number };
};

export function changeSafe<T>(
  migrationFn: () => T,
  version = 0,
  migrations = [migrationFn]
): ChangeSafe<T> {
  return {
    version,
    next<U>(fn: (arg: T) => U) {
      migrations.push(fn);
      return changeSafe(fn, version + 1, migrations);
    },
    migrate(version = -1, data) {
      let result = data;
      // start at the passed-in version and apply all migrations
      for (let i = version + 1; i < migrations.length; i++) {
        result = migrations[i](result);
      }

      return { result, version: migrations.length - 1 };
    },
  };
}

// How it should work:
const { version, migrate } = changeSafe(() => {
  return { name: "John", age: 20 };
}).next((person) => {
  return { ...person, occupation: "programmer" };
});

const x = migrate(); // {result: { name: "John", age: 20, occupation: "programmer" }, version: 1}
const y = migrate(0, { name: "Sarah", age: 100 }); // {result: { name: "Sarah", age: 100, occupation: "programmer" }, version: 1}

/**
TO DO:
- also there is no way to call the transforms on actual data. AHHHH YOU IDIOT
- write the tests for this
- also, find a way to get the schema type
- also see if there is a way to automatically increment the schema version
 */
