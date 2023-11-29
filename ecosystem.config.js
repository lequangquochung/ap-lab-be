const MAX_MEMORY_RESTART = '1000M';
const KILL_TIMEOUT = 5000;
const WAIT_READY = true;
const LISTEN_TIMEOUT = 20000;

module.exports = {
  apps: [
    {
      name: 'clinic-api-dev',
      script: './dist/index.js',
      watch: false,
      autorestart: false,
      env: {
        PORT: 3000,
        NODE_ENV: 'dev',
      },
    },
    {
      name: 'clinic-api-stg',
      script: './dist/index.js',
      watch: false,
      autorestart: false,
      env_staging: {
        PORT: 3000,
        NODE_ENV: 'staging',
      },
    },
    {
      name: 'clinic-api-prod',
      script: './dist/index.js',
      watch: false,
      env_staging: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};
