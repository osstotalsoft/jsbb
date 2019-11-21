const mock = jest.genMockFromModule("@totalsoft/pure-rules");

mock.Rule = {
  of: value => ({ value })
};
mock.applyRule = jest.fn((rule, model, _prevModel) => ({ ...model, _ruleValue: rule.value }));

mock.logTo = jest.fn(_ => rule => ({ ...rule }));

mock.__clearMocks = function () {
  mock.applyRule.mockClear();
  mock.logTo.mockClear();
};

// eslint-disable-next-line no-undef
module.exports = mock;
