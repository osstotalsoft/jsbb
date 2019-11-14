import Reader from "@totalsoft/zion/data/reader";
import { curry } from "ramda";
import fl from "fantasy-land";

export const Rule = Reader;
Rule.of = Rule[fl.of];

export function Rule1(computation) {
    return Rule((prop, { newDocument, oldDocument }) => computation(newDocument, oldDocument, prop));
}

const emptyContext = {
    oldDocument: undefined,
    newDocument: undefined,
    fieldPath: [],
    log: false,
    logger: { log: () => { } },
};


export const applyRule = curry(function validate(rule, newModel, oldModel, ctx = undefined) {
    return rule.runReader(newModel, { ...emptyContext, ...ctx, newDocument: newModel, oldDocument: oldModel });
});
