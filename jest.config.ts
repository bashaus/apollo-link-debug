import { Config } from 'jest';

const config: Config = {
  projects: ['packages/*'],
  coverageReporters: ['text', 'cobertura'],
};

export default config;
