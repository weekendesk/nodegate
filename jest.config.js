module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    experimentalFetch: true,
  },
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
    '!**/assets/**',
  ],
};
