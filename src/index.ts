require('dotenv').config();

import 'reflect-metadata';
import 'module-alias/register';
import 'express-async-errors';
import './app/require';

import * as bodyParser from 'body-parser';

import { ConnectionOptions, createConnection } from 'typeorm';

import { CustomLogger } from './CustomLogger';
import { RootRoute } from '$helpers/decorator';
import cors from 'cors';
import { createServer } from 'http';
import express from 'express';
import { handleError } from '$middlewares/handleError';
import helmet from 'helmet';
import log from '$helpers/log';
import logRequest from '$middlewares/logRequest';
import User from '$entities/User';
import { hash } from 'bcryptjs';
import { AccountStatus, ROLE } from '$enums/index';
import config from '$config';

const logger = log('Index');
const app = express();
const http = createServer(app);

connectToDatabase()
  .then(async (connection) => {
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(logRequest);
    app.use(express.static('public'));

    app.use(RootRoute);

    app.use(handleError);

    // Disable ONLY_FULL_GROUP_BY
    // await getManager().query(
    //   `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
    // );

    if (process.env.SERVER_TYPE === 'full') {
      
    }
  
    const userRepository = connection.getRepository(User);

    const admin = await userRepository.findOne({ email: "anphuc.admin@gmail.com" });
    if (!admin) {
      const password = await hash("123456", config.auth.SaltRounds);

      const admin = new User();
      admin.id = 1;
      admin.birthday = new Date();
      admin.email = "anphuc.admin@gmail.com";
      admin.role = ROLE.ADMIN;
      admin.phoneNumber = "0927633733";
      admin.gender = 1;
      admin.fullName = "anphuc";
      admin.password = password;
      admin.status = AccountStatus.ACTIVE;
      await userRepository.save(admin);
    }

    http.listen(process.env.SERVER_PORT, () => {
      logger.info(
        `Express server started on port ${process.env.SERVER_PORT}. ENV: ${process.env.ENVIRONMENT}`
      );
    });
  })
  .catch((error) => logger.error(error));

  async function connectToDatabase() {
    try {
      const connectionOptions: ConnectionOptions = {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        supportBigNumbers: false,
        synchronize: true, // Alway use migration.
        logging: process.env.ENVIRONMENT === 'production' ? false : true,
        charset: 'utf8mb4',
        migrationsTableName: 'migration',
        entities: ['dist/app/entities/**/*.js'],
        migrations: ['dist/database/migrations/**/*.js'],
        subscribers: ['dist/database/subscribers/**/*.js'],
        timezone: 'Z',
        cli: {
          entitiesDir: 'src/app/entities',
          migrationsDir: 'src/database/migrations',
          subscribersDir: 'src/database/subscribers',
        },
        extra: {
          connectionLimit: 50,
       },
        logger: process.env.ENVIRONMENT === 'production' ? new CustomLogger() : undefined,
      };
  
      const connection = await createConnection(connectionOptions);
  
      console.log('Connected to the database');
      return connection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }