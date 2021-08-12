// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Rule, RuleContext } from "../rule";
import { F } from "ts-toolbelt";

/**
 * Used to reduce a list of rules. It applies all rules by chaining outputs to inputs.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#chainRules
 */
export function chainRules<TModel>(rules: Array<Rule<TModel>>): Rule<TModel>;

/**
 * Used to apply a rule for just a field of the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#field
 */
export function field(key: string, rule: Rule<any>): Rule<object>;

/**
 * Used to apply a rule for just a field of the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#field
 */
export function field(key: string): (rule: Rule<any>) => Rule<object>;

/**
 * Useful when you need the model in the composition process.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#frommodel
 */
export function fromModel<TModel>(ruleFactory: (model: TModel) => Rule<TModel>): Rule<TModel>;

/**
 * Useful when you need the parent model in the composition process.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#fromparent
 */
export function fromParent<TModel>(ruleFactory: (parentModel: any) => Rule<TModel>): Rule<TModel>;

/**
 * Useful when you need the root model in the composition process.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#fromroot
 */
export function fromRoot<TModel>(ruleFactory: (rootModel: any) => Rule<TModel>): Rule<TModel>;

/**
 * Used to create a conditional rule by providing a predicate or condition, a rule for the "true" branch and another for the "false" branch.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#ifThenElse
 */
export function ifThenElse<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean), ruleWhenTrue: Rule<TModel>, ruleWhenFalse: Rule<TModel>): Rule<TModel>;

/**
 * Used to create a conditional rule by providing a predicate or condition, a rule for the "true" branch and another for the "false" branch.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#ifThenElse
 */
export function ifThenElse<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean), ruleWhenTrue: Rule<TModel>): (ruleWhenFalse: Rule<TModel>) => Rule<TModel>;

/**
 * Used to create a conditional rule by providing a predicate or condition, a rule for the "true" branch and another for the "false" branch.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#ifThenElse
 */
export function ifThenElse<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean)): F.Curry<(ruleWhenTrue: Rule<TModel>, ruleWhenFalse: Rule<TModel>) => Rule<TModel>>;

/**
 * Takes an item rule and produces applies it for each item in the provided collection.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#items
 */
export function items<TItem>(itemRule: Rule<TItem>): Rule<TItem[]>;

export type Logger = { log: (message: string) => void };

/**
 * Logs the rule application process to the speficfied logger.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#logto
 */
export function logTo<TModel>(logger: Logger, rule: Rule<TModel>): Rule<TModel>;

/**
 * Logs the rule application process to the speficfied logger.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#logto
 */
export function logTo<TModel>(logger: Logger): (rule: Rule<TModel>) => Rule<TModel>;

export type Reader<TContext, TValue> = { computation: (ctx: TContext) => TValue };

export function parent(reader: Reader<any, any>): Reader<any, any>;

export function readFrom<TContext, TValue>(func: (ctx: TContext) => TValue): Reader<TContext, TValue>;

/**
 * Creates a scope over the given rule where the document is substituted by the current value.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#scope
 */
export function scope<TModel>(rule: Rule<TModel>): Rule<TModel>;

/**
 * Used to compose complex rules from field rules.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#shape
 */
export function shape<TRuleObj extends { [k: string]: Rule<unknown> }>(
  validatorObj: TRuleObj
): Rule<{ [k in keyof TRuleObj]: TRuleObj[k] extends Rule<infer U> ? U : unknown }>;

/**
 * Used to create a conditional rule by providing a predicate or condition and a rule.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#when
 */
export function when<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean), rule: Rule<TModel>): Rule<TModel>;

/**
 * Used to create a conditional rule by providing a predicate or condition and a rule.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#when
 */
export function when<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean)): (rule: Rule<TModel>) => Rule<TModel>;

/**
 * Used to create a rule that repeats the provided rule until the condition is true.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#until
 */
export function until<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean), rule: Rule<TModel>): Rule<TModel>;

/**
 * Used to create a rule that repeats the provided rule until the condition is true.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#until
 */
export function until<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean)): (rule: Rule<TModel>) => Rule<TModel>;
