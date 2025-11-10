import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@integrations/(.*)$': '<rootDir>/src/integrations/$1',
    '^@workers/(.*)$': '<rootDir>/src/workers/$1',
    '^@dtos/(.*)$': '<rootDir>/src/dtos/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  }
};

export default config;
