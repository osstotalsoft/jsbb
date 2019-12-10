const mock = jest.genMockFromModule("@totalsoft/pure-rules");

mock.Rule = {
  of: value => ({ value })
};
mock.applyRule = jest.fn((rule, model, _prevModel) => ({ ...model, _ruleValue: rule.value }));

mock.logTo = jest.fn(_ => rule => ({ ...rule }));
mock.ensureArrayUIDsDeep = jest.fn(obj => obj);
mock.toMap = jest.fn(arr => arr.reduce((acc, value, index) => ({ ...acc, value, index }), {}));

mock.__clearMocks = function () {
  mock.applyRule.mockClear();
  mock.logTo.mockClear();
  mock.ensureArrayUIDsDeep.mockClear();
  mock.toMap.mockClear();
};

// eslint-disable-next-line no-undef
module.exports = mock;
