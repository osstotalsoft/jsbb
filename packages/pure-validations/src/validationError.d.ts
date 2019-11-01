interface ValidationError {}
declare let ValidationError: {
  (errors: string | string[], fields?: { [key: string]: ValidationError }): ValidationError;
};

export default ValidationError;
