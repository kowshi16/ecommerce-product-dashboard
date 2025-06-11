export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.js'];
export const roots = ['<rootDir>/src'];
export const testMatch = [
  '**/?(*.)+(spec|test).[jt]s?(x)',
];
export const moduleNameMapper = {
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
};
export const extensionsToTreatAsEsm = ['.ts', '.tsx'];

export default {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {},
};