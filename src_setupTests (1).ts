import '@testing-library/jest-dom';

// Mock chrome API
global.chrome = {
  storage: {
    sync: {
      get: jest.fn((keys, callback) => callback({})),
      set: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn((message, callback) => callback ? callback({}) : undefined),
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
} as any;

// Console warn mock to avoid cluttering test output
console.warn = jest.fn();