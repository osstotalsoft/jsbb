import { variadicApply, checkRules } from "../_utils";
import { concat } from "ramda";

const chainRules = variadicApply(function chainRules(...rules) {
    checkRules(...rules);

    return rules.reduce(concat);
});

export default chainRules;
