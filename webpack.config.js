const path = require("path");

const clientDir = path.resolve(__dirname, "src", "client");
const jsxProcessor = path.resolve(clientDir, "jsxProcessor.js");

module.exports = () => {
  return {
    entry: path.resolve(clientDir, "main.jsx"),
    mode: "development",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: ["babel-loader"],
        },
      ],
    },
    resolve: {
      alias: {
        jsxProcessor,
        "react/jsx-runtime": jsxProcessor,
      },
    },
  };
};
