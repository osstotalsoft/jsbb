const i18nextMock = jest.genMockFromModule("i18next");
i18nextMock.t = (text, props = {}) => {
  // eslint-disable-next-line no-unused-vars
  const { defaultValue, ...rest } = props;
  return text + (rest ? JSON.stringify(rest) : "");
};

export default i18nextMock;
