import { test, describe, expect } from "vitest";
import { from } from "./from-to-now";

describe("from", () => {
  test("Returns version number & migrate function", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { version, migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    expect(version).toBe(2);
    expect(migrate).toBeDefined();
  });

  test("Versions are 0-indexed", () => {
    const { version } = from({
      x: 100,
      y: 100,
    }).now({ x: 100, y: 100 });

    expect(version).toBe(0);
  });

  test("Can migrate data to latest version", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    const data = migrate(
      {
        x: 200,
        y: 200,
      },
      0
    );

    expect(data).toEqual({
      x: 200,
      y: 200,
      z: 100,
      θ: 0,
    });
  });

  test("Data unchanged if latest version", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    const data = migrate(
      {
        x: 200,
        y: 200,
        z: 100,
        θ: 0,
      },
      2
    );

    expect(data).toEqual({
      x: 200,
      y: 200,
      z: 100,
      θ: 0,
    });
  });

  test("Throws if version is not found", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    expect(() => {
      migrate(
        {
          x: 200,
          y: 200,
        },
        3
      );
    }).toThrow();
  });

  test("Throws if version not a number", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    expect(() => {
      migrate(
        {
          x: 200,
          y: 200,
        },
        // @ts-expect-error
        "3"
      );
    }).toThrow();
  });

  test("Throws if version too high", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    expect(() => {
      migrate(
        {
          x: 200,
          y: 200,
        },
        4
      );
    }).toThrow();
  });

  test("Throws if version too low", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    expect(() => {
      migrate(
        {
          x: 200,
          y: 200,
        },
        -1
      );
    }).toThrow();
  });

  test("Calling migrate with no input returns final version", () => {
    let initialState = {
      x: 100,
      y: 100,
      z: 100,
      θ: 0,
    };

    const { migrate } = from({
      x: 100,
      y: 100,
    })
      .to((state) => ({
        ...state,
        z: 100,
      }))
      .to((state) => ({
        ...state,
        θ: 0,
      }))
      .now(initialState);

    expect(migrate()).toEqual(initialState);
  });

  test("Complex object test", () => {
    const { migrate, version } = from({
      name: "John",
      age: 20,
    })
      .to((x) => {
        return {
          ...x,
          occupation: "Developer",
        };
      })
      .to((x) => {
        return {
          ...x,
          age: {
            amount: x.age,
            unit: "years",
          },
        };
      })
      .now({
        name: "Lisa",
        age: {
          amount: 30,
          unit: "years",
        },
        occupation: "Software Architect",
      });

    expect(version).toBe(2);

    expect(migrate()).toEqual({
      name: "Lisa",
      age: {
        amount: 30,
        unit: "years",
      },
      occupation: "Software Architect",
    });

    expect(
      migrate(
        {
          name: "Joe",
          age: 55,
          occupation: "Youtuber",
        },
        1
      )
    ).toEqual({
      name: "Joe",
      age: {
        amount: 55,
        unit: "years",
      },
      occupation: "Youtuber",
    });
  });
});
