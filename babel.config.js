module.exports = api => {

  api.cache.using(() => process.env.NODE_ENV)

  const defaultAlias = {
    "@totalsoft/zion": "@totalsoft/zion/src",
    "@totalsoft/pure-validations": "@totalsoft/pure-validations/src",
    "@totalsoft/rules-algebra": "@totalsoft/rules-algebra/src"
  };


  // const presets = api.env("test")
  //   ? [
  //       [
  //         "@babel/preset-env",
  //         {
  //           targets: { node: "current" }
  //         }
  //       ]
  //     ]
  //   : [];

  const defaultPlugins = [["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }], "@babel/plugin-proposal-optional-chaining"];

  // const plugins = api.env("test")
  //   ? [
  //       ...defaultPlugins,
  //       [
  //         "babel-plugin-module-resolver",
  //         {
  //           root: ["./"],
  //           alias: defaultAlias
  //         }
  //       ]
  //     ]
  //   : [...defaultPlugins, ["@babel/plugin-transform-modules-commonjs"]];

  return {
    plugins: defaultPlugins,
    env: {
      cjs: {
        presets: [
          [
            "@babel/preset-env",
            {
              modules: "commonjs"
            }
          ]
        ],
      },
      esm: {
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]]
      },
      test: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { node: "current" }
            }
          ]
        ],
        plugins: [
          [
            "babel-plugin-module-resolver",
            {
              root: ["./"],
              alias: defaultAlias
            }
          ]
        ]
      }
    }
  };
};
