// import config from '$config';
// import { QueueName } from '$enums';
// import { execSendMail } from '$helpers/mail';
// import { execSendNotification } from '$helpers/notification';
// import Queue from 'bull';

// const prefix: string = `bull_lsa_${config.environment}`;

// const queueOption: Queue.QueueOptions = {
//   prefix,
//   redis: {
//     host: config.redis.host,
//     port: config.redis.port,
//     password: config.redis.password,
//   },
//   defaultJobOptions: {
//     attempts: 5,
//     backoff: {
//       type: 'exponential',
//       delay: 5000,
//     },
//   },
// };

// export const SendMailQueue = new Queue<any>(QueueName.SEND_MAIL, {
//   ...queueOption,
//   limiter: { max: 1, duration: 1200 }, // send 1 mail each 1.2s
// });
// SendMailQueue.process(async (job, done) => {
//   execSendMail(job.data);
//   done();
// });

// export const SendNotificationQueue = new Queue<any>(QueueName.SEND_NOTIFICATION, {
//   ...queueOption,
//   limiter: { max: 10, duration: 1000 }, // send 10 notification each 1s
// });
// SendNotificationQueue.process(async (job, done) => {
//   execSendNotification(job.data);
//   done();
// });
