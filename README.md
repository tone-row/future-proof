# Readme

## Upkeep

Upkeep is a function for lazily ensuring that data is migrated to the latest version.

### Usage

```typescript
import { upkeep } from "./object.upkeep";

/**
 * The data to migrate, if a value is passed in.
 */
const data = {
  /* your data object */
};

/**
 * The version to migrate from, if a value is passed in.
 */
const version = "1";

/**
 * The migrations to run, if a value is passed in.
 * A Map object where the key is the version and the value is a function that performs the migration on the data.
 */
const migrations = new Map<string, (data: any) => any>();
migrations.set("1", (data) => {
  /* migration logic for version 1 */
});
migrations.set("2", (data) => {
  /* migration logic for version 2 */
});

const [migratedData, migratedVersion] = upkeep({
  data,
  version,
  migrations,
});
```

### API

#### `upkeep`

The `upkeep` function takes an object as its argument with the following properties:

- `data` (optional): The data to migrate, if a value is passed in.
- `version` (optional): The version to migrate from, if a value is passed in.
- `migrations`: The migrations to run, specified as a `Map` object where the key is the version and the value is a function that performs the migration on the data.

The `upkeep` function returns an array with two elements:

- `migratedData`: The migrated data after applying the necessary migrations.
- `migratedVersion`: The version of the data after migration.

### Examples

#### Throws if no migrations are provided

```typescript
import { upkeep } from "./object.upkeep";

try {
  upkeep({});
} catch (error) {
  console.error(error);
}
```

#### Returns defaults if only one migration given

```typescript
import { upkeep } from "./object.upkeep";

const migrations = new Map();
migrations.set("1", () => ({ test: "test" }));

const [data, version] = upkeep({
  migrations,
});

console.log(data); // { test: "test" }
console.log(version); // "1"
```

#### Only applies first migration if version is missing

```typescript
import { upkeep } from "./object.upkeep";

const migrations = new Map();
migrations.set("1", () => ({ test: "test" }));

const [data, version] = upkeep({
  migrations,
  version: "1",
  data: { test: "i've already been set!" },
});

console.log(data); // { test: "i've already been set!" }
console.log(version); // "1"
```

#### Throws if version is not in list of migrations

```typescript
import { upkeep } from "./object.upkeep";

const migrations = new Map();
migrations.set("1", () => ({ test: "test" }));

try {
  upkeep({
    migrations,
    version: "2",
  });
} catch (error) {
  console.error(error);
}
```

#### Applies only needed migrations

```typescript
import { upkeep } from "./object.upkeep";

const migrations = new Map();
migrations.set("1", () => ({ test: "test" }));
migrations.set("2", (data) => ({ ...data, test2: "test2" }));

const [data, version] = upkeep<{
  test: string;
  test2: string;
}>({
  migrations,
  version: "1",
  data: { test: "i've already been set!" },
});

console.log(data); // { test: "i've already been set!", test2: "test2" }
console.log(version); // "2"
```

### License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
