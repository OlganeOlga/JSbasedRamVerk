// jest.config.js
export default {
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.test.mjs', // Match test files with .test.mjs extension
    '**/test/**/*.spec.mjs',  // Match test files with .spec.mjs extension
    '**/test/**/*.test.js',    // Match test files with .test.js extension (if applicable)
    '**/test/**/*.spec.js'     // Match test files with .spec.js extension (if applicable)
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['html', 'text'],
  transform: {
    '^.+\\.m?js$': 'babel-jest', // Transform .js and .mjs files using Babel
  },
  transformIgnorePatterns: [
    '/node_modules/(?!your-module-to-transform)', // Customize this if you need to transform specific node_modules
  ]
};
