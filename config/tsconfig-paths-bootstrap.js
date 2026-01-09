const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");
const path = require("path");

const baseUrl = path.join(__dirname, "../dist");

// Em produção, os arquivos estão em 'dist/' e não mais em 'src/'
// Precisamos remover o prefixo 'src/' dos mapeamentos de caminhos
const paths = {};
Object.keys(tsConfig.compilerOptions.paths).forEach((key) => {
  paths[key] = tsConfig.compilerOptions.paths[key].map((p) =>
    p.replace(/^src\//, "./")
  );
});

tsConfigPaths.register({
  baseUrl,
  paths: paths,
});
