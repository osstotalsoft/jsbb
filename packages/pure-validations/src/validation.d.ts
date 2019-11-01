import ValidationError from "./validationError";

export interface Success {}
export interface Failure {}
export function Failure(validationError: ValidationError): Failure;
export function getErrors(validation: Success | Failure): string[];
export function getInner(path: string[], validation: Success | Failure): Success | Failure;
export function isValid(validation: Success | Failure): boolean;
