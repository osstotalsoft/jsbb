import Reader from "@totalsoft/zion/data/reader";
import { map, curry } from "ramda";
import { contramap, $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export const field = curry(function field(key, rule) {
    checkRules(rule);
    return (
        rule
        |> _logFieldPath
        |> contramap((model, ctx) => [model[key], _getFieldContext(model, ctx, key)])
        |> map(moveToField(key))
    );
});

const moveToField = curry(function moveToField(field, value) {
    return ({ [field]: value });
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
    return { ...context, fieldPath: [...context.fieldPath, key], parentModel: model, parentContext: context };
}

function _log(context, message) {
    if (context.log) {
        context.logger.log(message);
    }
}

export default field