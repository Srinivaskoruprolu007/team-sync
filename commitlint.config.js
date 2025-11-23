module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat", // A new feature
                "fix", // A bug fix
                "docs", // Documentation only changes
                "style", // Changes that don't affect code meaning (formatting, missing semicolons, etc.)
                "refactor", // Code change that neither fixes a bug nor adds a feature
                "perf", // Code change that improves performance
                "test", // Adding missing tests or correcting existing tests
                "chore", // Changes to build process, dependencies, or tooling
                "ci", // Changes to CI configuration
                "revert", // Reverts a previous commit
            ],
        ],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "scope-case": [2, "always", "lower-case"],
        "scope-empty": [2, "never"],
        "subject-case": [
            2,
            "never",
            ["start-case", "pascal-case", "upper-case"],
        ],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "subject-exclamation-mark": [2, "never"],
        "header-max-length": [2, "always", 100],
        "body-leading-blank": [2, "always"],
        "body-max-line-length": [2, "always", 100],
        "footer-leading-blank": [2, "always"],
        "footer-max-line-length": [2, "always", 100],
    },
};
