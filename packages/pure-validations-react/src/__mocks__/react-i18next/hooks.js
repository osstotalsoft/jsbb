// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

const mock = {}

mock.useTranslation = jest.fn(() => [undefined, ({
    language: 'ro-RO'
})]);

module.exports = mock;