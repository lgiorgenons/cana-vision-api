const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = "../dist"; // Adjusted because it's now inside config/

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});