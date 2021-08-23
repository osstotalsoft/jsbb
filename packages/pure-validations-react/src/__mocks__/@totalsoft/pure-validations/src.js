// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

const mock = jest.genMockFromModule("@totalsoft/pure-validations");

mock.Success = { value: true, toString: () => "Success" };
mock.Failure = () => ({ value: false, toString: () => "Failure" });

mock.isValid = jest.fn(validation => validation.value);
mock.getErrors = jest.fn(_ => []);

mock.Validator = {
  of: validation => ({ validation })
};
mock.validate = jest.fn(validator => validator.validation);

mock.logTo = jest.fn(_ => validator => ({ ...validator }));
mock.filterFields = jest.fn(_ => validator => ({ ...validator }));

mock.__clearMocks = function() {
  mock.validate.mockClear();
  mock.logTo.mockClear();
  mock.filterFields.mockClear();
  mock.isValid.mockClear();
  mock.getErrors.mockClear();
};

// eslint-disable-next-line no-undef
module.exports = mock;
