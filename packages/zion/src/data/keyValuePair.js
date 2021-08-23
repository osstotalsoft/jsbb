// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { tagged } from "daggy";
import * as fl from "fantasy-land";

const KeyValuePair = tagged("KeyValuePair", ["key", "value"]);

KeyValuePair.getKey = function getKey(x) {
  return x.key;
};

KeyValuePair.getValue = function getValue(x) {
  return x.value;
};

/* Functor ObjectTree */
KeyValuePair.prototype[fl.map] = function(f) {
    return KeyValuePair(this.key, f(this.value));
  };

export default KeyValuePair;
