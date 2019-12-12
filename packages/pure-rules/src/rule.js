import Reader from "@totalsoft/zion/data/reader";
import { curry, chain} from "ramda";
import fl from "fantasy-land";
import { contramap } from "@totalsoft/zion";
import { setInnerProp } from "./objectUtils";

export const Rule = Reader;
Rule.of = Rule[fl.of];
Rule.prototype[fl.concat] = function (that) {
    return this |> chain(newModel => that |> contramap((model, ctx) => [newModel, _getContext(model, newModel, ctx)]))
};

function _getContext(model, newModel, ctx) {
    const { fieldPath, document } = ctx;
    return model === newModel ? ctx : { ...ctx, document: setInnerProp(document, fieldPath, newModel) }
}

const emptyContext = {
    prevDocument: undefined,
    document: undefined,
    fieldPath: [],
    scopePath: [],
    log: false,
    logger: { log: () => { } },
};

export const applyRule = curry(function applyRule(rule, newModel, prevModel = undefined, ctx = undefined) {
    return rule.runReader(newModel, { ...emptyContext, ...ctx, prevModel, document: newModel, prevDocument: prevModel });
});
