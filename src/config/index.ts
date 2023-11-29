export default {
  appName: process.env.APP_NAME || 'baseapi',
  domain: process.env.DOMAIN,
  environment: process.env.ENVIRONMENT,
  /** Default 3000 */
  serverPort: process.env.SERVER_PORT,
  /**Distance for search home, default  10 kilometers */
  distanceSearch: Number(process.env.DISTANCE_SEARCH) || 10, // Kilometer
  /** Mysql database information */
  database: {
    hostname: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    databaseName: process.env.DB_NAME,
  },
  /** Authentication information*/
  auth: {
    AccessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    RefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    SaltRounds: Number(process.env.SALT_ROUNDS),
    AccessTokenExpire: Number(process.env.ACCESS_TOKEN_EXPIRE),
    RefreshTokenExpire: Number(process.env.REFRESH_TOKEN_EXPIRE),
  },
};
