import Reader from "@totalsoft/zion/data/reader";
import { curry } from "ramda";
import { contramap, $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export const field = curry(function field(key, rule) {
    checkRules(rule);
    return (
        rule
        |> _logFieldPath
        |> contramap((model, ctx) => [model[key], _getFieldContext(model, ctx, key)])
        |> mergeParent(key)
    );
});

const mergeParent = curry(function mergeParent(field, fieldRule) {
    return $do(function* () {
        const [model,] = yield Reader.ask();
        const fieldValue = yield fieldRule;

        return model[field] === fieldValue ? model : { ...model, [field]: fieldValue };
    });
});


function _logFieldPath(rule) {
    return $do(function* () {
        const [, fieldContext] = yield Reader.ask();
        const result = yield rule;
        _log(fieldContext, `Rule result is ${result} for path ${fieldContext.fieldPath.join(".")}`);
        return result;
    });
}

function _getFieldContext(model, context, key) {
    return { ...context, fieldPath: [...context.fieldPath, key], prevModel: context.prevModel && context.prevModel[key], parentModel: model, parentContext: context };
}

function _log(context, message) {
    if (context.log) {
        context.logger.log(message);
    }
}

export default field