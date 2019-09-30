const mock = jest.genMockFromModule('@totalsoft/pure-validations');

mock.Validation = {
    Success: () => ({ value: true }),
    Failure: () => ({ value: false })
}
mock.isValid = jest.fn(validation => validation.value)

mock.Validator = {
    of: validation => ({ validation })
}
mock.validate = jest.fn((validator) => validator.validation)

mock.logTo = jest.fn(_ => validator => ({...validator}))
mock.filterFields = jest.fn(_ => validator => ({...validator}))

mock.__clearMocks = function() {
    mock.validate.mockClear();
    mock.logTo.mockClear();
    mock.filterFields.mockClear();
    mock.isValid.mockClear();
}

// eslint-disable-next-line no-undef
module.exports = mock;
