export function create<
  FirstVersion extends string | number | symbol,
  FirstData
>(version: FirstVersion, data: () => FirstData) {
  const migrations = {
    [version]: data,
  };

  return createInner<{ [V in FirstVersion]: FirstData }, FirstVersion>(
    migrations,
    [version]
  );
}

function createInner<VersionMap, Version extends keyof VersionMap>(
  migrations: Record<string | number | symbol, Function>,
  versions: (string | number | symbol)[]
) {
  return {
    next: <NextVersion extends string | number | symbol, NextData>(
      nextVersion: NextVersion,
      fn: (args: VersionMap[Version]) => NextData
    ) => {
      migrations[nextVersion] = fn;

      return createInner<
        VersionMap & { [V in NextVersion]: NextData },
        NextVersion
      >(migrations, [...versions, nextVersion]);
    },
    migrate: <V extends keyof VersionMap, D extends VersionMap[V]>(
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
        if (!migration)
          throw new Error(`Migration ${key.toString()} not found`);

        data = migration(data);
      }

      return {
        version: versions[versions.length - 1],
        result: data,
      };
    },
  };
}
