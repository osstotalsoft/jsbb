const mock = jest.genMockFromModule("@totalsoft/rules-algebra");

mock.Rule = {
  of: value => ({ value })
};
mock.applyRule = jest.fn((rule, model, _prevModel) => ({ ...model, _ruleValue: rule.value }));

mock.logTo = jest.fn(_ => rule => ({ ...rule }));
mock.ensureArrayUIDsDeep = jest.fn(obj => obj);
mock.setInnerProp = jest.fn((obj, _propPath, _value) => obj._innerProp === _value ? obj : ({ ...obj, _innerProp: _value }));
mock.toMap = jest.fn(arr => arr.reduce((acc, value, index) => ({ ...acc, value, index }), {}));

mock.__clearMocks = function () {
  mock.applyRule.mockClear();
  mock.logTo.mockClear();
  mock.ensureArrayUIDsDeep.mockClear();
  mock.toMap.mockClear();
  mock.setInnerProp.mockClear();
};

// eslint-disable-next-line no-undef
module.exports = mock;
