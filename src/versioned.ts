import { structuredClone } from "./structuredClone";

type BaseVersion = string | number | symbol;

export function versioned<Version extends BaseVersion, Data>({
  version,
  data,
}: {
  version: Version;
  data: () => Data;
}) {
  const migrations = {
    [version]: data,
  };

  return inner<{ [V in Version]: Data }, Version>(migrations, [version]);
}

function inner<VersionMap, PreviousVersion extends keyof VersionMap>(
  migrations: Record<BaseVersion, Function>,
  versions: BaseVersion[]
) {
  const next = <Version extends BaseVersion, Data>({
    version,
    fn,
  }: {
    version: Version;
    fn: (args: VersionMap[PreviousVersion]) => Data;
  }) => {
    migrations[version] = fn;

    return inner<VersionMap & { [V in Version]: Data }, Version>(migrations, [
      ...versions,
      version,
    ]);
  };

  const migrate = <V extends keyof VersionMap, D extends VersionMap[V]>(
    version: V,
    data: D
  ) => {
    const versionIndex = versions.indexOf(version);
    if (versionIndex === -1) {
      throw new Error(`Version ${version.toString()} not found`);
    }

    for (let i = versionIndex + 1; i < versions.length; i++) {
      const key = versions[i];
      if (!key) throw new Error("Key not found");

      const migration = migrations[key as keyof typeof migrations];
      if (!migration) throw new Error(`Migration ${key.toString()} not found`);

      data = migration(structuredClone(data));
    }

    return {
      version: versions[versions.length - 1],
      result: data,
    };
  };

  return {
    next,
    migrate,
  };
}
