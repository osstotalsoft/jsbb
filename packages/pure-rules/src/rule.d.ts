import { F } from "ts-toolbelt";

export type RuleContext = {
  prevDocument: any,
  document: any,
  fieldPath: string[];
  log: boolean;
  logger: { log: (message: string) => void };
  parentModel: any;
  parentContext: any;
  [key: string]: any;
};

export interface Rule<TModel> {}
export let Rule: {
  <TModel>(func: (model: TModel, context?: RuleContext) => any): Rule<TModel>;
  of(result: any): Rule<any>;
};

export function applyRule<TModel>(rule: Rule<TModel>, newModel: TModel, prevModel?: TModel, ctx?: RuleContext): any;
export function applyRule<TModel>(rule: Rule<TModel>, newModel: TModel, prevModel?: TModel): (ctx?: RuleContext) => any;
export function applyRule<TModel>(rule: Rule<TModel>, newModel: TModel): F.Curry<(prevModel?: TModel, ctx?: RuleContext) => any>;
export function applyRule<TModel>(rule: Rule<TModel>): F.Curry<(model: TModel, prevModel?: TModel, ctx?: RuleContext) => any>;
