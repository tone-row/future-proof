import { test, describe, expect } from "vitest";
import { changeSafe } from "./changeSafe";

describe("changeSafe", () => {
  test("Returns a version number alongside the result", () => {
    const x = changeSafe(() => {
      return 100;
    });
    expect(x.result).toEqual(100);
    expect(x.version).toEqual(0);

    const y = x.next((x) => x + 1);
    expect(y.result).toEqual(101);
    expect(y.version).toEqual(1);
  });

  test.todo("throws if no migrations are provided");

  test.todo("returns defaults if only one migration given");

  test.todo("only applies first migration if version is missing");

  test.todo("throws if version is not in list of migrations");

  test.todo("applies only needed migrations");
});
