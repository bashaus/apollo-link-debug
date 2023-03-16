/* eslint-disable */
export default {
  displayName: 'handle-timer',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  // coverageDirectory: '../../coverage/packages/handle-timer',
};
