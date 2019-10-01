// import fl from "fantasy-land";
// import { concat } from "./fantasy/prelude";

// const validationErrorPrototype = {
//   [fl.concat]: function(other) {
//     const errors = [...this.errors, ...other.errors];
//     const fields = merge(this.fields, other.fields);

//     return ValidationError(errors, fields);
//   },
//   getField: function(key) {
//     return this.fields[key];
//   }
// };

// export function ValidationError(errors = [], fields = {}) {
//   const self = Object.create(validationErrorPrototype);
//   self.errors = errors;
//   self.fields = fields;

//   return self;
// }

// function notIsNullOrUndefined(val) {
//   return val !== null && val !== undefined;
// }

// function merge(leftObj, rightObj) {
//   const fields = [...new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])];
//   var result = {};
//   for (let f of fields) {
//     const leftValue = leftObj[f];
//     const rightValue = rightObj[f];

//     if (notIsNullOrUndefined(leftValue) && notIsNullOrUndefined(rightValue)) {
//       result[f] = concat(leftValue, rightValue);
//     } else if (notIsNullOrUndefined(leftValue)) {
//       result[f] = leftValue;
//     } else {
//       result[f] = rightValue;
//     }
//   }

//   return result;
// }
