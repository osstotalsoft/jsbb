const mock = {}

mock.useTranslation = jest.fn(() => [undefined, ({
    language: 'ro-RO'
})]);

module.exports = mock;