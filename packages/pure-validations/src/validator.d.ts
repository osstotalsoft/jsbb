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
  <TModel>(func: (model: TModel, context?: ValidatorContext) => Success | Failure): Validator<TModel>;

  // tslint:disable:no-unnecessary-generics
  of<TModel>(validation: Success | Failure): Validator<TModel>;
};

export function validate<TModel>(validator: Validator<TModel>, model: TModel, ctx?: ValidatorContext): Success | Failure;
export function validate<TModel>(validator: Validator<TModel>): F.Curry<(model: TModel, ctx?: ValidatorContext) => Success | Failure>;
