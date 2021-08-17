import { Rule } from "../rule";
import { lift, curry, curryN } from "ramda";
import { propertiesChanged } from "../predicates";
import { when } from "../higherOrderRules";

export const ensureRuleParams = curry(function(N, func) {
  return curryN(N, function(...args) {
    const ruleArgs = args.map(ensureRule);
    return func(...ruleArgs);
  });
});

export const unchanged = Rule(model => model);

export function constant(value) {
  return Rule.of(value);
}

export function computed(computation) {
  return Rule((prop, { document, prevDocument }) => computation(document, prevDocument, prop));
}

export const min = lift(curry(Math.min)) |> ensureRuleParams(2);
export const max = lift(curry(Math.max)) |> ensureRuleParams(2);
export const sum = lift(a => b => a + b) |> ensureRuleParams(2);

export const minimumValue = max(unchanged) |> ensureRuleParams(1);
export const maximumValue = min(unchanged) |> ensureRuleParams(1);

export function sprintf(format) {
  const params = format.match(/{{\s*[\w.]+\s*}}/g).map(x => x.match(/[\w.]+/)[0]);
  const makeRegex = key => new RegExp(`{{${key}}}`);
  return (
    computed(document => params.reduce((str, key) => str.replace(makeRegex(key), document[key]), format))
    |> when(propertiesChanged(document => params.map(key => document[key])))
  );
}

function ensureRule(selector) {
  if (Rule.is(selector)) {
    return selector;
  }
  if (typeof selector === "function") {
    return computed(selector);
  }

  return constant(selector);
}
