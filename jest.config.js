module.exports = {
    "verbose": true,
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["<rootDir>/build/"],
    modulePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/packages/[^/]+/build/"]
}