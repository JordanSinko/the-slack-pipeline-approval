const { AwsCdkConstructLibrary, FileBase } = require("projen");

class ContentFile extends FileBase {
  constructor(project, path, options) {
    super(project, path, options);
    this.options = options;
  }

  synthesizeContent() {
    return this.options.content;
  }
}

const project = new AwsCdkConstructLibrary({
  cdkVersion: "1.66.0",
  name: "@JordanSinko/the-slack-pipeline-approval",
  authorName: "Jordan Sinko",
  authorAddress: "jordan5sinko@gmail.com",
  repository: "https://github.com/JordanSinko/the-slack-pipeline-approval",
  scripts: {
    clean: "rimraf coverage dist lib node_modules",
    format: "pretty-quick --staged",
    "compile:construct": "jsii --silence-warnings=reserved-word --no-fix-peer-dependencies && jsii-docgen",
    "compile:handlers": "npm run compile:requester && npm run compile:approver",
    "compile:requester":
      "esbuild src/requester/index.ts --outfile=lib/requester/index.js --platform=node --target=es2019 --format=cjs --bundle",
    "compile:approver":
      "esbuild src/approver/index.ts --outfile=lib/approver/index.js --platform=node --target=es2019 --format=cjs --bundle",
  },
  devDependencies: {
    esbuild: "^0.7.9",
    husky: "^4.3.0",
    prettier: "^2.1.2",
    "pretty-quick": "^3.0.2",
    "npm-run-all": "^4.1.5",

    // Dependencies for handlers which are bundled with esbuild
    "@types/aws-lambda": "^8.10.63",
    "aws-sdk": "^2.766.0",
    phin: "^3.5.0",
  },
  cdkDependencies: [
    "@aws-cdk/core",
    "@aws-cdk/aws-codepipeline",
    "@aws-cdk/aws-codepipeline-actions",
    "@aws-cdk/aws-sns",
    "@aws-cdk/aws-sns-subscriptions",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-apigatewayv2",
  ],
  cdkTestDependencies: ["@aws-cdk/assert"],
  eslint: false,
  releaseWorkflow: true,
  buildWorkflow: true,
  mergify: true,
  npmRegistry: "npm.pkg.github.com",
});

project.addScript("compile", "npm run compile:construct && npm run compile:handlers");

project.addFields({
  jsii: {
    ...project.manifest.jsii,
    excludeTypescript: ["src/approver", "src/requester"],
  },
});

new ContentFile(project, ".prettierignore", {
  content: `package.json
API.md
`,
});

new ContentFile(project, "husky.config.js", {
  content: `module.exports = {
  hooks: {
    "pre-commit": "run-s format",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  },
};
`,
});

new ContentFile(project, "commitlint.config.js", {
  content: `module.exports = {
  extends: ["@commitlint/config-conventional"],
};
`,
});

new ContentFile(project, "prettier.config.js", {
  content: `module.exports = {
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 120,
  endOfLine: "lf",
};
`,
});

project.synth();
