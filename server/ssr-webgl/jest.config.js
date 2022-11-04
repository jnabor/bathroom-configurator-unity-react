const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
    bail: true,
    verbose: true,
    testEnvironment: "node",
    globals: {
        "ts-jest": {
            tsconfig: {
                ...compilerOptions,
                allowJs: true,
            },
            astTransformers: {
                before: [
                    "./ts-jest-keys-transformer.js",
                ],
            },
        },
    },
    moduleNameMapper: pathsToModuleNameMapper(
        compilerOptions.paths,
        {
            prefix: "<rootDir>/",
        },
    ),
    roots: [
        "<rootDir>",
    ],
    modulePathIgnorePatterns: ["<rootDir>/img/"],
    testMatch: [
        "<rootDir>/test/?(*.)+(spec|test).[jt]s?(x)",
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "\\/web-core-utils\\/lib\\/.+": "ts-jest",
    },
    reporters: [ "jest-standard-reporter" ],
};