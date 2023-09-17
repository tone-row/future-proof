import { test, describe, expect } from "vitest";
import { upkeep } from "./object.upkeep";

describe("upkeep", () => {
  test("throws if no migrations are provided", () => {
    // @ts-ignore
    expect(() => upkeep({})).toThrow();
  });

  test("returns defaults if only one migration given", () => {
    const migrations = new Map();
    migrations.set("1", () => ({ test: "test" }));

    const [data, version] = upkeep({
      migrations,
    });

    expect(data).toEqual({ test: "test" });
    expect(version).toEqual("1");
  });

  test("only applies first migration if version is missing", () => {
    const migrations = new Map();
    migrations.set("1", () => ({ test: "test" }));

    const [data, version] = upkeep({
      migrations,
      version: "1",
      data: { test: "i've already been set!" },
    });

    expect(data).toEqual({ test: "i've already been set!" });
    expect(version).toEqual("1");
  });

  test("throws if version is not in list of migrations", () => {
    const migrations = new Map();
    migrations.set("1", () => ({ test: "test" }));

    expect(() =>
      upkeep({
        migrations,
        version: "2",
      })
    ).toThrow();
  });

  test("applies only needed migrations", () => {
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

    expect(data).toEqual({ test: "i've already been set!", test2: "test2" });
    expect(version).toEqual("2");
  });
});
