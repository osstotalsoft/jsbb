import { Rule } from "../rule";

export const unchanged = Rule(model => model);

export function constant(value) {
    return Rule.of(value);
}