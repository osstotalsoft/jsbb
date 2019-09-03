const i18nextMock = jest.genMockFromModule("i18next");
i18nextMock.t = (text, props = {}) => {
  const { defaultValue, ...rest } = props;
  return text + (rest ? JSON.stringify(rest) : "");
};

export default i18nextMock;
