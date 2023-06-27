// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

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
  <TModel>(func: (model: TModel, context?: ValidatorContext) => Success<TModel> | Failure<TModel>): Validator<TModel>;
  of<TModel>(validation: Success<TModel> | Failure<TModel>): Validator<TModel>;
};

export function validate<TModel>(validator: Validator<TModel>, model: TModel, ctx?: ValidatorContext): Success<TModel> | Failure<TModel>;
export function validate<TModel>(validator: Validator<TModel>): F.Curry<(model: TModel, ctx?: ValidatorContext) => Success<TModel> | Failure<TModel>>;
