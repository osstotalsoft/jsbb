import Reader from "@totalsoft/zion/data/reader";

export function variadicApply(variadicFn) {
  const res = function(...args) {
    if (args.length === 1 && Array.isArray(args[0])) {
      return variadicFn(...args[0]);
    }

    return variadicFn(...args);
  };
  res.toString = function() {
    return variadicFn.toString();
  };
  return res;
}

export function checkRules(...readers) {
  readers.forEach(function(reader) {
    if (!Reader.is(reader)) {
      throw new Error(`Value '${reader ? reader.toString() : reader}' is not a rule!`);
    }
  });
}
