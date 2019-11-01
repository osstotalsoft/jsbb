import { F } from "ts-toolbelt";
import { Success, Failure } from "./validation";

export type ValidatorContext = {
  fieldPath: string[];
  fieldFilter: (context: ValidatorContext) => boolean;
  log: boolean;
  logger: { log: (message: string) => void };
  parentModel: any;
  parentContext: any;
  [key: string]: any;
};

export interface Validator<TModel> {}
export let Validator: {
  <TModel>(func: (model: TModel, context?: ValidatorContext) => Success | Failure): Validator<TModel>;
  of(validation: Success | Failure): Validator<any>;
};

export function validate<TModel>(validator: Validator<TModel>, model: TModel, ctx?: ValidatorContext): Success | Failure;
export function validate<TModel>(validator: Validator<TModel>): F.Curry<(model: TModel, ctx?: ValidatorContext) => Success | Failure>;
