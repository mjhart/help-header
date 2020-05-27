module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.[jt]s?(x)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
