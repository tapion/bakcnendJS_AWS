const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json')

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */),
  modulePaths: [
    '<rootDir>'
  ],
  // moduleNameMapper: {
  //   "~/(.*)": "<rootDir>/src/$1"
  // },
}