module.exports = api => {

  api.cache.using(() => process.env.NODE_ENV)

  const defaultAlias = {
    "@totalsoft/zion": "@totalsoft/zion/src",
    "@totalsoft/pure-validations": "@totalsoft/pure-validations/src",
    "@totalsoft/rules-algebra": "@totalsoft/rules-algebra/src",
    "@totalsoft/react-state-lens": "@totalsoft/react-state-lens/src",
    "@totalsoft/change-tracking": "@totalsoft/change-tracking/src",
    "@totalsoft/change-tracking-react": "@totalsoft/change-tracking-react/src",
    "@totalsoft/change-tracking-react/lensProxy": "@totalsoft/change-tracking-react/src/lensProxy",
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
        plugins: [["@babel/plugin-transform-runtime"]]
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
