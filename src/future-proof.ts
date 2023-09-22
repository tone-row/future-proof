import { structuredClone } from "./structuredClone";

export function from<Data>(initial: Data) {
  return fromTo(initial, 0, [initial]);
}

function fromTo<From>(from: From, version: number, migrations: any[]) {
  const init = <Final>(final: Final) => {
    let migrate: {
      (): Final;
      (state: any, version: number): Final;
    };

    migrate = (state?: any, fromVersion?: number) => {
      // If no arguments, return the final state
      if (state === undefined || fromVersion === undefined) return final;

      // If the version is the same as the current version, return the state
      if (fromVersion === version) return state;

      // If the version is not a number, throw an error
      if (typeof fromVersion !== "number") {
        throw new Error(`Version ${fromVersion} is not a number`);
      }

      // If the version is too large, throw an error
      if (fromVersion > version) {
        throw new Error(
          `Cannot migrate from version ${fromVersion} to version ${version}`
        );
      }

      // If the version is too small, throw an error
      if (fromVersion < 0) {
        throw new Error(
          `Cannot migrate from version ${fromVersion} to version 0`
        );
      }

      // If the version is not the same as the current version, migrate the state
      for (let i = fromVersion + 1; i < version + 1; i++) {
        const migration = migrations[i];
        if (!migration) throw new Error(`Migration ${i} not found`);

        state = migration(structuredClone(state));
      }

      return state;
    };

    return {
      version,
      migrate,
    };
  };

  const to = <To>(fn: (from: From) => To) => {
    return fromTo(fn(from), version + 1, [...migrations, fn]);
  };

  return {
    to,
    version,
    init,
  };
}
