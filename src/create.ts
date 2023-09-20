export function create<
  FirstVersion extends string | number | symbol,
  FirstData
>(version: FirstVersion, fn: () => FirstData) {
  return createInner<{ [V in FirstVersion]: FirstData }, FirstVersion>();
}

function createInner<VersionMap, Version extends keyof VersionMap>() {
  return {
    next: <NextVersion extends string | number | symbol, NextData>(
      nextVersion: NextVersion,
      fn: (args: VersionMap[Version]) => NextData
    ) => {
      return createInner<
        VersionMap & { [V in NextVersion]: NextData },
        NextVersion
      >();
    },
    migrate: <V extends keyof VersionMap, D extends VersionMap[V]>(
      version: V,
      data: D
    ) => {
      console.log("HI THERE");
    },
  };
}

const x3 = create("1", () => ({ x: 10 }));
const y3 = x3.next("2", (input) => ({ ...input, y: 20 }));
const z3 = y3.next("3", (input) => ({ ...input, z: 30 }));
const a3 = z3.next("4", (input) => ({ ...input, a: 40, jorge: 48 }));

a3.migrate("1", { x: 10 });
a3.migrate("3", {
  x: 10,
  y: 20,
  z: 30,
});
