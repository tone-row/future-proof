/**
 * Upkeep is a function for lazily ensuring that data is migrated to the latest
 * version.
 */
export const upkeep = <T>(
  migrations: /**
   * The migrations to run, if a value is passed in.
   */
  Map<string, (data: any) => any>
): ((rest: {
  /**
   * The data to migrate, if a value is passed in.
   */
  data?: any;
  /**
   * The version to migrate from, if a value is passed in.
   */
  version?: string;
}) => [T, string]) => {
  // If no migrations are passed in, throw an error
  if (!migrations || !migrations.size) {
    throw new Error(
      "You must have at least one migration which specifies the initial value."
    );
  }
  return (rest) => {
    let version = rest.version ?? "",
      data = structuredClone(rest.data);

    const versions = Array.from(migrations.keys());

    for (const [key, migration] of migrations) {
      if (version && !versions.includes(version)) {
        throw new Error(
          `The version ${version} is not in the list of migrations: ${versions.join(
            ", "
          )}`
        );
      }

      const versionIndex = version ? versions.indexOf(version) : -1;
      const migrationIndex = versions.indexOf(key);

      if (versionIndex < migrationIndex) {
        // If the version is less than the migration version, run the migration
        data = migration(data);
        version = key;
      }
    }

    return [data, version];
  };
};
