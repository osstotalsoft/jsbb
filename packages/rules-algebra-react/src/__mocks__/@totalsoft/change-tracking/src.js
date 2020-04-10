const mock = jest.genMockFromModule("@totalsoft/change-tracking");

mock.ensureArrayUIDsDeep = jest.fn(obj => obj);
mock.setInnerProp = jest.fn((obj, _propPath, _value) => obj._innerProp === _value ? obj : ({ ...obj, _innerProp: _value }));
mock.toUniqueIdMap = jest.fn(arr => arr.reduce((acc, value, index) => ({ ...acc, value, index }), {}));

mock.__clearMocks = function () {
  mock.ensureArrayUIDsDeep.mockClear();
  mock.toUniqueIdMap.mockClear();
  mock.setInnerProp.mockClear();
};

// eslint-disable-next-line no-undef
module.exports = mock;
