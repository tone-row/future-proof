import { test, describe, expect } from "vitest";
import { create } from "./create";

describe("create", () => {
  test("Returns a version number and a migrate function", () => {
    const { migrate } = create("1", () => {
      return 100;
    })
      .next("2", (x) => {
        return x + 1;
      })
      .next("3", (x) => {
        return x * 10;
      });

    const { result, version } = migrate("1", 520);

    expect(version).toBe("3");
    expect(result).toBe(5210);
  });

  test("Can pass in version number and data to migrate", () => {
    const { migrate } = create("1", () => {
      return 100;
    })
      .next("2", (x) => {
        return x + 1;
      })
      .next("3", (x) => {
        return x * 10;
      });

    const { result, version } = migrate("2", 520);

    expect(version).toBe("3");
    expect(result).toBe(5200);
  });

  test("Doesn't change data if version is up to date", () => {
    const { migrate } = create("1", () => {
      return 100;
    })
      .next("2", (x) => {
        return x + 1;
      })
      .next("3", (x) => {
        return x * 10;
      });

    const { result, version } = migrate("3", 520);

    expect(version).toBe("3");
    expect(result).toBe(520);
  });

  test("Throws if version is not found", () => {
    const { migrate } = create("1", () => {
      return 100;
    })
      .next("2", (x) => {
        return x + 1;
      })
      .next("3", (x) => {
        return x * 10;
      });

    // @ts-expect-error
    expect(() => migrate("4", 520)).toThrow("Version 4 not found");
  });
});
