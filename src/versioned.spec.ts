import { test, describe, expect } from "vitest";
import { versioned } from "./versioned";

describe("versioned", () => {
  test("Returns version number & migrate function", () => {
    const { migrate } = versioned({
      version: "1",
      data: () => {
        return 100;
      },
    })
      .next({
        version: "2",
        fn: (x) => {
          return x + 1;
        },
      })
      .next({
        version: "3",
        fn: (x) => {
          return x * 10;
        },
      });

    const { result, version } = migrate("1", 520);

    expect(version).toBe("3");
    expect(result).toBe(5210);
  });

  test("Can migrate data to latest version", () => {
    const { migrate } = versioned({
      version: "1",
      data: () => {
        return 100;
      },
    })
      .next({
        version: "2",
        fn: (x) => {
          return x + 1;
        },
      })
      .next({
        version: "3",
        fn: (x) => {
          return x * 10;
        },
      });

    const { result, version } = migrate("2", 520);

    expect(version).toBe("3");
    expect(result).toBe(5200);
  });

  test("Data unchanged if latest version", () => {
    const { migrate } = versioned({
      version: "1",
      data: () => {
        return 100;
      },
    })
      .next({
        version: "2",
        fn: (x) => {
          return x + 1;
        },
      })
      .next({
        version: "3",
        fn: (x) => {
          return x * 10;
        },
      });

    const { result, version } = migrate("3", 520);

    expect(version).toBe("3");
    expect(result).toBe(520);
  });

  test("Throws if version is not found", () => {
    const { migrate } = versioned({
      version: "1",
      data: () => {
        return 100;
      },
    })
      .next({
        version: "2",
        fn: (x) => {
          return x + 1;
        },
      })
      .next({
        version: "3",
        fn: (x) => {
          return x * 10;
        },
      });

    // @ts-expect-error
    expect(() => migrate("4", 520)).toThrow("Version 4 not found");
  });

  test("Complex object test", () => {
    const { migrate } = versioned({
      version: "1",
      data: () => {
        return {
          name: "John",
          age: 20,
        };
      },
    })
      .next({
        version: "2",
        fn: (x) => {
          return {
            ...x,
            occupation: "Developer",
          };
        },
      })
      .next({
        version: "3",
        fn: (x) => {
          return {
            ...x,
            age: {
              amount: x.age,
              unit: "years",
            },
          };
        },
      });

    const { result, version } = migrate("1", {
      name: "John",
      age: 20,
    });

    expect(version).toBe("3");
    expect(result).toEqual({
      name: "John",
      age: {
        amount: 20,
        unit: "years",
      },
      occupation: "Developer",
    });
  });
});
