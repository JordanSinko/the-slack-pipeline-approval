module.exports = {
  hooks: {
    "pre-commit": "run-s format",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  },
};
