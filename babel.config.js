module.exports = api => {
 
  api.cache.using(() => process.env.NODE_ENV)

  const defaultAlias = {
    "@totalsoft/zion": "@totalsoft/zion/src",
    "@totalsoft/pure-validations": "@totalsoft/pure-validations/src"
  };

  const defaultPresets = [
    [
      "@babel/preset-env",
      {
        modules: process.env.BABEL_ENV === "esm" ? false : "commonjs"
      }
    ]
  ];

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
    presets: defaultPresets,
    plugins: defaultPlugins,
    env: {
      cjs: {},
      esm: {
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]]
      },
      test: {
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
