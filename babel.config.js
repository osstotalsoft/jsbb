module.exports = api => {
  const defaultAlias = {
    "@totalsoft/arcadia": "@totalsoft/arcadia/src",
    "@totalsoft/pure-validations": "@totalsoft/pure-validations/src"
  };

  const presets = api.env("test")
    ? [
        [
          "@babel/preset-env",
          {
            targets: { node: "current" }
          }
        ]
      ]
    : [];

  const defaultPlugins = [["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }], "@babel/plugin-proposal-optional-chaining"];

  const plugins = api.env("test")
    ? [
        ...defaultPlugins,
        [
          "babel-plugin-module-resolver",
          {
            root: ["./"],
            alias: defaultAlias
          }
        ]
      ]
    : defaultPlugins;

  return {
    presets,
    plugins
  };
};
