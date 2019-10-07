const presets = [
  [
    "@babel/preset-env",
    {
      targets: { esmodules: true }
    }
  ]
];
const plugins = [["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }], "@babel/plugin-proposal-optional-chaining"];
// const ignore = [
//   "**/__mocks__", // ignore the whole test directory
//   "**/__tests__" // ignore the whole test directory
// ];

module.exports = { presets, plugins /*, ignore*/ };
