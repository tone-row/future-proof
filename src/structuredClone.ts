export const structuredClone =
  typeof window !== "undefined" && (window as any).structuredClone
    ? (window.structuredClone as <T>(i: T) => T)
    : typeof self !== "undefined" && (self as any).structuredClone
    ? (self.structuredClone as <T>(i: T) => T)
    : <T>(i: T): T => (i ? JSON.parse(JSON.stringify(i)) : i);
