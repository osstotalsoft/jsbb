import Reader from "@totalsoft/zion/data/reader";
import { checkRules } from "./_utils"
import { curry } from "ramda";
import fl from "fantasy-land";

export const Rule = Reader;
Rule.of = Rule[fl.of];

const emptyContext = {
    prevDocument: undefined,
    document: undefined,
    fieldPath: [],
    scopePath: [],
    log: false,
    logger: { log: () => { } },
};

export const applyRule = curry(function applyRule(rule, newModel, prevModel = undefined, ctx = undefined) {
    checkRules(rule)
    return rule.runReader(newModel, { ...emptyContext, ...ctx, prevModel, document: newModel, prevDocument: prevModel });
});
