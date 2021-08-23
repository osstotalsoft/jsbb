// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

interface ValidationError {}
declare let ValidationError: {
  (errors: string | string[], fields?: { [key: string]: ValidationError }): ValidationError;
};

export default ValidationError;
