// import Booking from '$entities/Booking';
// import BookingDraft from '$entities/BookingDraft';
// import ConsultOption from '$entities/ConsultOption';
// import MedicalRecord from '$entities/MedicalRecord';
// import Member from '$entities/Member';
// import Plan from '$entities/Plan';
// import Room from '$entities/Room';
// import Service from '$entities/Service';
// import ServiceGroup from '$entities/ServiceGroup';
// import {
//   BookingStatus,
//   BookingType,
//   ClinicBranchesName,
//   CODE_BILL,
//   CommonStatus,
//   MailTemplateCode,
//   MedicalExaminationType,
//   MedicalRecordStatus,
//   MedicalRecordUsageType,
//   NotificationHeading,
//   NotificationTitle,
//   NotificationType,
//   PlanStatus,
//   PlanType,
//   PointHistoryType,
//   PointHistoryUsageType,
//   RegisterType,
//   ServiceGroupType,
//   SHORT_BREAK_TIME,
// } from '$enums';
// import log from '$helpers/log';
// import { sendMail, sendMailByTemplateCode } from '$helpers/mail';
// import {
//   convertDate,
//   convertDateTimeRange,
//   convertTimeRange,
//   getConsultOptionText,
//   getFreeServiceTitleText,
//   getMedicalExaminationTypeText,
//   getServiceNameWithOption,
// } from '$helpers/utils';
// import { sendNotificationRemindCreateMedical } from '$services/app.auth';
// import { sendNoti, sendNotiToMembers } from '$services/app.notification';
// import { setTimeOffSechedule } from '$services/booking/app/booking';
// import _ from 'lodash';
// import moment from 'moment-timezone';
// import cron from 'node-cron';
// import format from 'string-format';
// import { getConnection, getManager, getRepository, In } from 'typeorm';
// import {
//   findBranch,
//   getAllBookingDraftOverTime,
//   getAllBookingNotCheckAddPoint,
//   getAllBookingOverTime,
//   getIdsWithTypeAddPoint,
//   getMembersNotBookingCourseAfterLongTime,
//   getRoomData,
//   sendNotiAddPoint,
//   sendNotificationBookingFinish,
// } from './method';
// import { SendMailQueue, SendNotificationQueue } from './queue';
// import PlanOption from '$entities/PlanOption';
// import Option from '$entities/Option';
// import MedicalMember from '$entities/MedicalMember';
// import PlanService from '$entities/PlanService';
// import { getOverlapsBooking } from '$services/booking/app/detailBooking';
// import config from '$config';
// import PointHistory from '$entities/PointHistory';
// import { getRecentBookingByMemberId } from '$services/booking/app/timeBookingVer3';
// import NotificationBK from '$entities/NotificationBK';
// import Notification from '$entities/Notification';

// const logger = log('Schedule');

// export default async function intiSchedule() {
//   logger.info('Scheduled has been initialized!');

//    /* -------------------------------------------------------------------------------------------------- */
//   /*           Job cập nhật trạng thái booking thành done khi qúa giờ            */
//   /* -------------------------------------------------------------------------------------------------- */
//   cron.schedule(`*/15 * * * *`, async function () {
//     logger.info('Begin job update booking status to done when overtime');
//     const allBookingOverTime: any[] = await getAllBookingOverTime();

//     const bookingIds = [];
//     const planIds = [];
//     const medicalRecordIds = [];
//     allBookingOverTime.forEach((booking) => {
//       bookingIds.push(booking.id);
//       if (booking.planId) {
//         planIds.push(booking.planId);
//       }
//       // FINISHED medical record nếu hoàn thành tất cả plan
//       const isAllPlanDone = booking?.plans
//         ?.filter((plan: any) => plan.id !== booking.planId)
//         .every((plan: any) => [PlanStatus.CANCEL, PlanStatus.FINISHED].includes(plan.status));
//       if (isAllPlanDone && booking.medicalRecord) {
//         medicalRecordIds.push(booking?.medicalRecord?.id);
//       }

//       // Booking tự do
//       if (booking.type === BookingType.EXAMINATION && booking?.medicalRecordFree) {
//         booking?.plansFree?.forEach((plan: any) => planIds.push(plan.id));
//         medicalRecordIds.push(booking?.medicalRecordFree?.id);
//       }
//       sendNotificationBookingFinish(booking.memberId, booking);
//     });
//     getConnection().transaction(async (transaction) => {
//       await transaction
//         .getRepository(Booking)
//         .update({ id: In(bookingIds.filter(Boolean)) }, { status: BookingStatus.DONE });
//       await transaction
//         .getRepository(Plan)
//         .update({ id: In(planIds.filter(Boolean)) }, { status: PlanStatus.FINISHED });
//       await transaction.getRepository(MedicalRecord).update(
//         { id: In(medicalRecordIds.filter(Boolean)) },
//         {
//           status: MedicalRecordStatus.FINISHED,
//           everDoneBefore: () =>
//             `IF(usage_type = ${MedicalRecordUsageType.PLAN}, ${CommonStatus.ACTIVE}, ever_done_before)`,
//         }
//       );
//     });
//     logger.info('End job update booking status to done when overtime');
//   });
// }
