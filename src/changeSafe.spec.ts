import { test, describe, expect } from "vitest";
import { changeSafe } from "./changeSafe";

describe("changeSafe", () => {
  test("Returns a version number and a migrate function and next function", () => {
    const { migrate } = changeSafe(() => {
      return 100;
    });

    const { version, result } = migrate();
    expect(version).toBe(0);
    expect(result).toBe(100);
  });

  test("Can use next function to describe a migration", () => {
    const { migrate } = changeSafe(() => {
      return 100;
    }).next((x) => {
      return x + 1;
    });

    const { version, result } = migrate();
    expect(version).toBe(1);
    expect(result).toBe(101);
  });

  test("Can pass in version number and data to migrate", () => {
    const { migrate } = changeSafe(() => {
      return 100;
    }).next((x) => {
      return x + 1;
    });

    const { version, result } = migrate(0, 50);
    expect(version).toBe(1);
    expect(result).toBe(51);
  });

  test("Doesn't change data if version is up to date", () => {
    const { migrate } = changeSafe(() => {
      return 100;
    })
      .next((x) => {
        return x + 1;
      })
      .next((x) => {
        return x * 10;
      });

    const { version, result } = migrate(2, 50);
    expect(version).toBe(2);
    expect(result).toBe(50);
  });
});
