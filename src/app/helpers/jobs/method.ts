// import _, { map } from 'lodash';
// import {
//   AccountType,
//   BookingStatus,
//   BookingType,
//   CommonStatus,
//   MedicalExaminationType,
//   MemberType,
//   NotificationTargetType,
//   NotificationTitle,
//   NotificationType,
//   PointHistoryType,
//   PointHistoryUsageType,
//   ScheduleType,
//   ServiceGroupType,
//   START_FIXED_TIMEOFF,
//   TimeOffType,
// } from '$enums';
// import { getRepository, In } from 'typeorm';
// import log from '$helpers/log';
// import Booking from '$entities/Booking';
// import moment, { Moment } from 'moment-timezone';
// import { sendNoti, sendNotiToMembers } from '$services/app.notification';
// import { PlanStatus } from '$enums';
// import Service from '$entities/Service';
// import Plan from '$entities/Plan';
// import BookingDraft from '$entities/BookingDraft';
// import Room from '$entities/Room';
// import TimeOffSchedule from '$entities/TimeOffSchedule';
// import format from 'string-format';
// import { listConfig } from '$services/resource';
// import { formatNumber, getWorkingTimeVer2 } from '$helpers/utils';
// import { sendMail } from '$helpers/mail';
// import config from '$config';
// import HolidaySchedule from '$entities/HolidaySchedule';

// const logger = log('Job');

// /**
//  * xử lý (worker)
//  */
// export async function sendNotificationBookingSuccess(memberId: number) {
//   await sendNoti({
//     title: NotificationTitle.BOOKING_SUCCESS,
//     memberId: memberId,
//     type: NotificationType.BOOKING_SUCCESS,
//   });
//   logger.info('Noti When Create Booking Success');
// }

// export async function sendNotificationBookingUpdate(memberId: number) {
//   sendNoti({
//     title: NotificationTitle.BOOKING_UPDATED,
//     memberId: memberId,
//     type: NotificationType.BOOKING_UPDATED,
//   });

//   logger.info('Noti When Update Booking Success');
// }

// export async function sendNotificationBookingFinish(memberId: number, booking: any) {
//   sendNoti({
//     title: NotificationTitle.BOOKING_FINISHED,
//     memberId: memberId,
//     type: NotificationType.BOOKING_FINISHED,
//     targetId: booking.id,
//     targetType: NotificationTargetType.BOOKING,
//     data: booking,
//   });

//   logger.info('Noti When Finish Booking Success');
// }

// export async function sendNotificationBookingCancel(memberId: number, bookingId: number) {
//   sendNoti({
//     title: NotificationTitle.BOOKING_CANCEL,
//     memberId: memberId,
//     type: NotificationType.BOOKING_CANCEL,
//   });

//   logger.info('Noti When Cancel Booking Success');
// }

// export async function sendNotificationBookingArrived(memberId: number, bookingId: number) {
//   sendNoti({
//     title: NotificationTitle.BOOKING_ARRIVED,
//     memberId: memberId,
//     type: NotificationType.BOOKING_ARRIVED,
//     targetId: bookingId,
//     targetType: NotificationTargetType.BOOKING,
//     data: {
//       bookingId,
//     },
//   });

//   logger.info('Noti When Booking Check In');
// }

// export async function sendNotificationRoomOff(memberId: number, bookingId: number) {
//   sendNoti({
//     title: NotificationTitle.ROOM_OFF,
//     memberId: memberId,
//     type: NotificationType.ROOM_OFF,
//   });

//   logger.info('Noti When Room Off Success');
// }

// export async function getMembersNotBookingCourseAfterLongTime() {
//   const bookingRepo = getRepository(Booking);
//   const bookings = await bookingRepo
//     .createQueryBuilder('booking')
//     .select(['booking.memberId memberId', 'MAX(booking.id) bookingId'])
//     .where('1=1')
//     .andWhere('DATE_FORMAT(booking.startTime, "%Y-%m-%d") >= :bookingDate', {
//       bookingDate: moment().tz('Asia/Tokyo').subtract(57, 'days').format('YYYY-MM-DD'),
//     })
//     .andWhere('booking.type = :bookingType', { bookingType: BookingType.EXAMINATION })
//     .andWhere('booking.medicalExaminationType = :medicalExaminationType', {
//       medicalExaminationType: MedicalExaminationType.OFFLINE,
//     })
//     .groupBy('booking.memberId')
//     .getRawMany();
//   const queryBuilder = bookingRepo
//     .createQueryBuilder('booking')
//     .where('1=1')
//     .andWhere('DATE_FORMAT(booking.startTime, "%Y-%m-%d") = :bookingDate', {
//       bookingDate: moment().tz('Asia/Tokyo').subtract(57, 'days').format('YYYY-MM-DD'),
//     })
//     .andWhere('booking.id IN(:bookingIds)', { bookingIds: map(bookings, 'bookingId') })
//     .innerJoinAndMapOne('booking.member', 'Member', 'member', `member.id = booking.memberId`)
//     .innerJoinAndMapOne('booking.plan', Plan, 'plan', `plan.id = booking.planId`)
//     .innerJoinAndMapOne('booking.service', Service, 'service', `service.id = plan.serviceId`)
//     .innerJoinAndMapOne(
//       'booking.serviceGroup',
//       'ServiceGroup',
//       'serviceGroup',
//       `service.serviceGroupId = serviceGroup.id`
//     )
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.startTime',
//       'booking.startTime',
//       'member.id',
//       'member.email',
//       'member.fullName',
//       'member.isNewAccount',
//       'member.isNewMember',
//       'plan.id',
//       'plan.serviceId',
//       'plan.stepNumber',
//       'plan.totalStep',
//       'service.id',
//       'service.duration',
//       'service.title',
//       'serviceGroup.id',
//       'serviceGroup.title',
//     ]);
//   if (process.env.ENVIRONMENT !== 'production') {
//     queryBuilder.andWhere(
//       `member.isNewAccount = :isNewAccount AND member.isNewMember = :isNewMember`,
//       {
//         isNewAccount: AccountType.NEW,
//         isNewMember: MemberType.NEW,
//       }
//     );
//   }
//   const result = await queryBuilder.getMany();

//   return result;
// }

// export async function getMembersNotBookingFreeAfterLongTime() {
//   const bookingRepo = getRepository(Booking);
//   const bookings = await bookingRepo
//     .createQueryBuilder('booking')
//     .select(['booking.memberId memberId', 'MAX(booking.id) bookingId'])
//     .where('1=1')
//     .andWhere('DATE_FORMAT(booking.startTime, "%Y-%m-%d") <= :bookingDate', {
//       bookingDate: moment().tz('Asia/Tokyo').subtract(6, 'months').format('YYYY-MM-DD'),
//     })
//     .andWhere('booking.type = :bookingType', { bookingType: BookingType.EXAMINATION })
//     .andWhere('booking.medicalExaminationType = :medicalExaminationType', {
//       medicalExaminationType: MedicalExaminationType.FREE,
//     })
//     .groupBy('booking.memberId')
//     .getRawMany();
//   const queryBuilder = bookingRepo
//     .createQueryBuilder('booking')
//     .where('1=1')
//     .andWhere('DATE_FORMAT(booking.startTime, "%Y-%m-%d") = :bookingDate', {
//       bookingDate: moment().tz('Asia/Tokyo').subtract(6, 'months').format('YYYY-MM-DD'),
//     })
//     .andWhere('booking.id IN(:bookingIds)', { bookingIds: map(bookings, 'bookingId') })
//     .innerJoinAndMapOne('booking.member', 'Member', 'member', `member.id = booking.memberId`)
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.startTime',
//       'booking.startTime',
//       'member.id',
//       'member.email',
//       'member.fullName',
//       'member.isNewAccount',
//       'member.isNewMember',
//     ]);
//   if (process.env.ENVIRONMENT !== 'production') {
//     queryBuilder.andWhere(
//       `member.isNewAccount = :isNewAccount AND member.isNewMember = :isNewMember`,
//       {
//         isNewAccount: AccountType.NEW,
//         isNewMember: MemberType.NEW,
//       }
//     );
//   }
//   const result = await queryBuilder.getMany();

//   return result;
// }

// export async function checkIsHoliday(date: string) {
//   const queryBuilder = getRepository(HolidaySchedule)
//   .createQueryBuilder('hs')
//   .where(`hs.date = '${date}'`)
//   const holiday = await queryBuilder.getOne();
//   return !!holiday;
// }

// export async function getAllBookingOverTime() {
//   const date = moment().format('YYYY-MM-DD'); 
//   const bookingRepo = getRepository(Booking);
//   const isHoliday = await checkIsHoliday(date);
//   const { endTime } = getWorkingTimeVer2(date, isHoliday);

//   const bookingsBuilder = bookingRepo
//     .createQueryBuilder('booking')
//     .leftJoinAndMapOne('booking.plan', 'Plan', 'plan', `plan.id = booking.planId`)
//     .leftJoinAndMapOne(
//       'booking.medicalRecord',
//       'MedicalRecord',
//       'mr',
//       '(mr.id = plan.medicalRecordId)'
//     )
//     .leftJoinAndMapMany(
//       'booking.plans',
//       'Plan',
//       'plans',
//       `(plans.medicalRecordId = plan.medicalRecordId)`
//     )
//     .leftJoinAndMapOne(
//       'booking.medicalRecordFree',
//       'MedicalRecord',
//       'mrf',
//       `(mrf.id = booking.medicalRecordId AND booking.type = ${BookingType.EXAMINATION})`
//     )
//     .leftJoinAndMapMany(
//       'booking.plansFree',
//       'Plan',
//       'plansFree',
//       `(plansFree.medicalRecordId = booking.medicalRecordId)`
//     )
//     .where('1=1')
//     .andWhere('booking.status NOT IN (:status)', {
//       status: [BookingStatus.DONE, BookingStatus.CANCELLED, BookingStatus.CANCELLED_2],
//     });

//     //Trong giờ làm việc chỉ tự động hoàn thành những booking không phải là tư vấn, bác sĩ và bill
//     if (moment().toDate() < endTime) {
//       bookingsBuilder
//       .leftJoinAndMapOne('plan.serviceGroup', 'ServiceGroup', 'sg', 'sg.id = plan.serviceGroupId')
//       .andWhere('booking.type NOT IN (:types)', {
//         types: [BookingType.CONSULT, BookingType.BILL]
//       })
//       .andWhere('sg.type != :sgType', {
//         sgType: ServiceGroupType.DOCTOR
//       })
//     }
    
//     const bookings = bookingsBuilder
//     .andWhere('booking.endTime < UTC_TIMESTAMP()')
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.medicalRecordId',
//       'booking.planId',
//       'booking.medicalExaminationType',
//       'booking.type',
//       'plan.id',
//       'plan.status',
//       'plan.stepNumber',
//       'plan.totalStep',
//       'plan.medicalRecordId',
//       'mr.id',
//       'plans.id',
//       'plans.status',
//       'plansFree.id',
//       'plansFree.status',
//       'mrf.id',
//     ])
//     .getMany();

//   return bookings;
// }

// export async function getBookingOverTimeAndFirstBookingBodyRemoval(bookingId?: number) {
//   const bookingRepo = getRepository(Booking);
//   const queryBuilder = await bookingRepo
//     .createQueryBuilder('booking')
//     .leftJoinAndMapOne('booking.member', 'Member', 'm', '(m.id = booking.memberId)')
//     .leftJoinAndMapOne('booking.medicalMember', 'MedicalMember', 'mm', `(m.id = mm.memberId)`)
//     .leftJoinAndMapOne('booking.memberReferral', 'Member', 'mr', '(mr.code = mm.referralCode)')
//     .leftJoinAndMapOne('booking.plan', 'Plan', 'plan', `plan.id = booking.planId`)
//     .leftJoinAndMapOne('plan.service', 'Service', 's', `(s.id = plan.serviceId)`)
//     .leftJoinAndMapOne('plan.serviceGroup', 'ServiceGroup', 'sg', `(sg.id = plan.serviceGroupId)`)
//     .leftJoinAndMapMany('booking.planMember', 'Plan', 'plan2', `plan2.memberId = booking.memberId`)
//     .leftJoinAndMapMany(
//       'mr.pointHistory',
//       'PointHistory',
//       'ph',
//       `(ph.memberId = mr.id and ph.type in (${
//         (PointHistoryType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL,
//         PointHistoryType.POINT_REFERAL_FIRST_BOOKING_DRNS)
//       }))`
//     )
//     .where('1=1')
//     .andWhere('sg.type = :sgType', {
//       sgType: ServiceGroupType.DEFAULT,
//     })
//     .andWhere('booking.type != :type', {
//       type: BookingType.CONSULT,
//     })
//     .andWhere('booking.checkinTime IS NOT NULL')
//     .andWhere('sg.isAddPointReferralBody = :isAddPointReferralBody', {
//       isAddPointReferralBody: CommonStatus.ACTIVE,
//     })
//     .andWhere('booking.checkedAddPoint = :checkedAddPoint', {
//       checkedAddPoint: CommonStatus.INACTIVE,
//     })
//     .andWhere('mr.id is not null')
//     .andWhere('m.allowAddPointReferral = :allowAddPointReferral', {
//       allowAddPointReferral: CommonStatus.ACTIVE,
//     })
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.medicalRecordId',
//       'booking.planId',
//       'booking.medicalExaminationType',
//       'booking.type',
//       'booking.status',
//       'mm.referralCode',
//       'm.id',
//       'mr.id',
//       'mr.pointFromAdmin',
//       'mr.code',
//       'plan.id',
//       'plan.status',
//       'plan.isAddPointReferral',
//       'plan2.id',
//       'plan2.status',
//       'plan2.isAddPointReferral',
//       'ph.id',
//       'ph.referalId',
//     ]);

//   if (bookingId) {
//     queryBuilder.andWhere('booking.id = :bookingId', { bookingId });
//   } else {
//     queryBuilder
//       .andWhere('booking.status = :status', {
//         status: BookingStatus.DONE,
//       })
//       .andWhere('booking.endTime < UTC_TIMESTAMP()');
//   }

//   return queryBuilder.getMany();
// }

// export async function getBookingOverTimeAndFirstBookingRemoval(bookingId?: number) {
//   const bookingRepo = getRepository(Booking);
//   const queryBuilder = await bookingRepo
//     .createQueryBuilder('booking')
//     .leftJoinAndMapOne('booking.member', 'Member', 'm', '(m.id = booking.memberId)')
//     .leftJoinAndMapOne('booking.medicalMember', 'MedicalMember', 'mm', `(m.id = mm.memberId)`)
//     .leftJoinAndMapOne('booking.memberReferral', 'Member', 'mr', '(mr.code = mm.referralCode)')
//     .leftJoinAndMapOne('booking.plan', 'Plan', 'plan', `plan.id = booking.planId`)
//     .leftJoinAndMapOne('plan.service', 'Service', 's', `(s.id = plan.serviceId)`)
//     .leftJoinAndMapOne('plan.serviceGroup', 'ServiceGroup', 'sg', `(sg.id = plan.serviceGroupId)`)
//     .leftJoinAndMapMany('booking.planMember', 'Plan', 'plan2', `plan2.memberId = booking.memberId`)
//     .leftJoinAndMapMany(
//       'mr.pointHistory',
//       'PointHistory',
//       'ph',
//       `(ph.memberId = mr.id and ph.type in (${
//         (PointHistoryType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL,
//         PointHistoryType.POINT_REFERAL_FIRST_BOOKING_DRNS)
//       }))`
//     )
//     .where('1=1')
//     .andWhere('sg.type = :sgType', {
//       sgType: ServiceGroupType.DEFAULT,
//     })
//     .andWhere('booking.type != :type', {
//       type: BookingType.CONSULT,
//     })
//     .andWhere('booking.checkinTime IS NOT NULL')
//     .andWhere('sg.isAddPointRemoval = :isAddPointRemoval', {
//       isAddPointRemoval: CommonStatus.ACTIVE,
//     })
//     .andWhere('booking.checkedAddPoint = :checkedAddPoint', {
//       checkedAddPoint: CommonStatus.INACTIVE,
//     })
//     .andWhere('mr.id is not null')
//     .andWhere('m.allowAddPointReferral = :allowAddPointReferral', {
//       allowAddPointReferral: CommonStatus.ACTIVE,
//     })
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.medicalRecordId',
//       'booking.planId',
//       'booking.medicalExaminationType',
//       'booking.type',
//       'booking.status',
//       'mm.referralCode',
//       'm.id',
//       'mr.id',
//       'mr.pointFromAdmin',
//       'mr.code',
//       'plan.id',
//       'plan.status',
//       'plan.isAddPointReferral',
//       'plan2.id',
//       'plan2.status',
//       'plan2.isAddPointReferral',
//       'ph.id',
//       'ph.referalId',
//     ]);

//   if (bookingId) {
//     queryBuilder.andWhere('booking.id = :bookingId', { bookingId });
//   } else {
//     queryBuilder
//       .andWhere('booking.status = :status', {
//         status: BookingStatus.DONE,
//       })
//       .andWhere('booking.endTime < UTC_TIMESTAMP()');
//   }

//   return queryBuilder.getMany();
// }

// export async function getBookingOverTimeAndFirstBookingDrNs(bookingId?: number) {
//   const bookingRepo = getRepository(Booking);
//   const queryBuilder = await bookingRepo
//     .createQueryBuilder('booking')
//     .leftJoinAndMapOne('booking.member', 'Member', 'm', '(m.id = booking.memberId)')
//     .leftJoinAndMapOne('booking.medicalMember', 'MedicalMember', 'mm', `(m.id = mm.memberId)`)
//     .leftJoinAndMapOne('booking.memberReferral', 'Member', 'mr', '(mr.code = mm.referralCode)')
//     .leftJoinAndMapOne('booking.plan', 'Plan', 'plan', `plan.id = booking.planId`)
//     .leftJoinAndMapOne('plan.service', 'Service', 's', `(s.id = plan.serviceId)`)
//     .leftJoinAndMapOne('plan.serviceGroup', 'ServiceGroup', 'sg', `(sg.id = plan.serviceGroupId)`)
//     .leftJoinAndMapMany('booking.planMember', 'Plan', 'plan2', `plan2.memberId = booking.memberId`)
//     .leftJoinAndMapMany(
//       'mr.pointHistory',
//       'PointHistory',
//       'ph',
//       `(ph.memberId = mr.id and ph.type in (${
//         (PointHistoryType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL,
//         PointHistoryType.POINT_REFERAL_FIRST_BOOKING_DRNS)
//       }))`
//     )
//     .where('1=1')
//     .andWhere('sg.type IN (:typeSg)', {
//       typeSg: [ServiceGroupType.DOCTOR, ServiceGroupType.NURSE],
//     })
//     .andWhere('booking.type != :type', {
//       type: BookingType.CONSULT,
//     })
//     .andWhere('booking.checkinTime IS NOT NULL')
//     .andWhere('booking.checkedAddPoint = :checkedAddPoint', {
//       checkedAddPoint: CommonStatus.INACTIVE,
//     })
//     .andWhere('mr.id is not null')
//     .andWhere('m.allowAddPointReferral = :allowAddPointReferral', {
//       allowAddPointReferral: CommonStatus.ACTIVE,
//     })
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.medicalRecordId',
//       'booking.planId',
//       'booking.medicalExaminationType',
//       'booking.type',
//       'booking.status',
//       'mm.referralCode',
//       'm.id',
//       'mr.id',
//       'mr.pointFromAdmin',
//       'mr.code',
//       'plan.id',
//       'plan.status',
//       'plan.isAddPointReferral',
//       'plan2.id',
//       'plan2.status',
//       'plan2.isAddPointReferral',
//       'ph.id',
//       'ph.referalId',
//     ]);

//   if (bookingId) {
//     queryBuilder.andWhere('booking.id = :bookingId', { bookingId });
//   } else {
//     queryBuilder
//       .andWhere('booking.status = :status', {
//         status: BookingStatus.DONE,
//       })
//       .andWhere('booking.endTime < UTC_TIMESTAMP()');
//   }
//   return queryBuilder.getMany();
// }

// export async function getAllBookingDraftOverTime() {
//   const bookingRepo = getRepository(BookingDraft);
//   const bookings = await bookingRepo
//     .createQueryBuilder('booking')
//     .leftJoinAndMapOne('booking.plan', 'Plan', 'plan', `plan.id = booking.planId`)
//     .leftJoinAndMapOne(
//       'booking.medicalRecord',
//       'MedicalRecord',
//       'mr',
//       '(mr.id = plan.medicalRecordId)'
//     )
//     .leftJoinAndMapMany(
//       'booking.plans',
//       'Plan',
//       'plans',
//       `(plans.medicalRecordId = plan.medicalRecordId)`
//     )
//     .leftJoinAndMapOne(
//       'booking.medicalRecordFree',
//       'MedicalRecord',
//       'mrf',
//       `(mrf.id = booking.medicalRecordId AND booking.type = ${BookingType.EXAMINATION})`
//     )
//     .leftJoinAndMapMany(
//       'booking.plansFree',
//       'Plan',
//       'plansFree',
//       `(plansFree.medicalRecordId = booking.medicalRecordId)`
//     )
//     .where('1=1')
//     .andWhere('booking.status NOT IN (:status)', {
//       status: [BookingStatus.DONE, BookingStatus.CANCELLED, BookingStatus.CANCELLED_2],
//     })
//     .andWhere('booking.endTime < UTC_TIMESTAMP()')
//     .select([
//       'booking.id',
//       'booking.bookingId',
//       'booking.medicalRecordId',
//       'booking.planId',
//       'booking.medicalExaminationType',
//       'booking.type',
//       'plan.id',
//       'plan.status',
//       'plan.stepNumber',
//       'plan.totalStep',
//       'plan.medicalRecordId',
//       'mr.id',
//       'plans.id',
//       'mrf.id',
//     ])
//     .getMany();

//   return bookings;
// }

// export async function getBookingOverTimeAndHasAddPointReferral(bookingId?: number) {
//   const bookingRepo = getRepository(Booking);
//   const queryBuilder = await bookingRepo
//     .createQueryBuilder('booking')
//     .leftJoinAndMapOne('booking.plan', 'Plan', 'plan', `plan.id = booking.planId`)
//     .leftJoinAndMapOne('booking.member', 'Member', 'm', '(m.id = booking.memberId)')
//     .leftJoinAndMapOne('booking.medicalMember', 'MedicalMember', 'mm', `(m.id = mm.memberId)`)
//     .leftJoinAndMapOne('booking.memberReferral', 'Member', 'mr', '(mr.code = mm.referralCode)')
//     .where('1=1')
//     .andWhere('plan.isAddPointReferral = 1')
//     .andWhere('booking.checkinTime IS NOT NULL')
//     .andWhere('booking.checkedAddPoint = :checkedAddPoint', {
//       checkedAddPoint: CommonStatus.INACTIVE,
//     })
//     .andWhere('mr.id is not null')
//     .select([
//       'booking.id',
//       'booking.memberId',
//       'booking.medicalRecordId',
//       'booking.planId',
//       'booking.medicalExaminationType',
//       'booking.type',
//       'booking.status',
//       'mm.referralCode',
//       'm.id',
//       'mr.id',
//       'mr.pointFromAdmin',
//       'mr.code',
//     ]);

//   if (bookingId) {
//     queryBuilder.andWhere('booking.id = :bookingId', { bookingId });
//   } else {
//     queryBuilder
//       .andWhere('booking.status = :status', {
//         status: BookingStatus.DONE,
//       })
//       .andWhere('booking.endTime < UTC_TIMESTAMP()');
//   }
//   return queryBuilder.getMany();
// }

// export async function getIdsWithTypeAddPoint(bookingId?: number) {
//   const allFirstBookingBodyRemoval: any[] = await getBookingOverTimeAndFirstBookingBodyRemoval(
//     bookingId
//   );
//   const allFirstBookingRemoval: any[] = await getBookingOverTimeAndFirstBookingRemoval(bookingId);
//   const allFirstBookingDrNs: any[] = await getBookingOverTimeAndFirstBookingDrNs(bookingId);
//   const allBookingAddPointReferral: any[] = await getBookingOverTimeAndHasAddPointReferral(
//     bookingId
//   );

//   const allFirstBookingBodyRemovalFilter = [],
//     allFirstBookingRemovalFilter = [],
//     allFirstBookingDrNsFilter = [];

//   allFirstBookingBodyRemoval?.forEach((booking, index) => {
//     if (booking?.planMember && booking?.planMember?.length >= 1) {
//       let hasPlanCompleteOrAddPoint = false,
//         hasAddPoint = false,
//         firstPlanComplete;
//       booking?.planMember?.forEach((el) => {
//         if (el?.status === PlanStatus.FINISHED && !firstPlanComplete) {
//           firstPlanComplete = el;
//         }
//       });

//       if (firstPlanComplete?.id !== booking?.planId) {
//         hasPlanCompleteOrAddPoint = true;
//       }
//       // prevent double add point
//       booking?.memberReferral?.pointHistory?.forEach((el) => {
//         if (el.referalId === booking?.memberId) {
//           hasAddPoint = true;
//         }
//       });
//       if (!hasPlanCompleteOrAddPoint && !hasAddPoint) {
//         allFirstBookingBodyRemovalFilter.push(booking);
//       }
//     }
//   });

//   allFirstBookingRemoval?.forEach((booking, index) => {
//     if (booking?.planMember && booking?.planMember?.length >= 1) {
//       let hasPlanCompleteOrAddPoint = false,
//         hasAddPoint = false,
//         firstPlanComplete;
//       booking?.planMember?.forEach((el) => {
//         if (el?.status === PlanStatus.FINISHED && !firstPlanComplete) {
//           firstPlanComplete = el;
//         }
//       });

//       if (firstPlanComplete?.id !== booking?.planId) {
//         hasPlanCompleteOrAddPoint = true;
//       }
//       // prevent double add point
//       booking?.memberReferral?.pointHistory?.forEach((el) => {
//         if (el.referalId === booking?.memberId) {
//           hasAddPoint = true;
//         }
//       });
//       if (!hasPlanCompleteOrAddPoint && !hasAddPoint) {
//         allFirstBookingRemovalFilter.push(booking);
//       }
//     }
//   });

//   allFirstBookingDrNs?.forEach((booking, index) => {
//     if (booking?.planMember && booking?.planMember?.length >= 1) {
//       let hasPlanCompleteOrAddPoint = false,
//         hasAddPoint = false,
//         firstPlanComplete;
//       booking?.planMember?.forEach((el) => {
//         if (el?.status === PlanStatus.FINISHED && !firstPlanComplete) {
//           firstPlanComplete = el;
//         }
//       });

//       if (firstPlanComplete?.id !== booking?.planId) {
//         hasPlanCompleteOrAddPoint = true;
//       }
//       // prevent double add point
//       booking?.memberReferral?.pointHistory?.forEach((el) => {
//         if (el.referalId === booking?.memberId) {
//           hasAddPoint = true;
//         }
//       });
//       if (!hasPlanCompleteOrAddPoint && !hasAddPoint) {
//         allFirstBookingDrNsFilter.push(booking);
//       }
//     }
//   });

//   const listUpdatePoint = [];
//   const listPointHistory = [];
//   // const listUpdateAll = [];
//   // const listDrNs = [];
//   // const listAddPointReferral = [];
//   const configs = await listConfig();

//   const listMemberId = _.union(
//     allFirstBookingBodyRemovalFilter.map((el) => el?.memberReferral?.id),
//     allFirstBookingDrNsFilter.map((el) => el?.memberReferral?.id),
//     allBookingAddPointReferral.map((el) => el?.memberReferral?.id),
//     allFirstBookingRemovalFilter?.map((el) => el?.memberReferral?.id)
//   );
//   listMemberId?.forEach((el) => {
//     const isInBookingRemovalBody = allFirstBookingBodyRemovalFilter?.filter(
//       (booking) => booking?.memberReferral?.id === el
//     );
//     const isInBookingRemoval = allFirstBookingRemovalFilter?.filter(
//       (booking) => booking?.memberReferral?.id === el
//     );
//     const isInBookingDrNs = allFirstBookingDrNsFilter?.filter(
//       (booking) => booking?.memberReferral?.id === el
//     );
//     const isInBookingAddPoint = allBookingAddPointReferral?.filter(
//       (booking) => booking?.memberReferral?.id === el
//     );
//     const listMemberAddPoint = [];
//     let pointAddForMember = Number(
//       [
//         ...isInBookingRemoval,
//         ...isInBookingDrNs,
//         ...isInBookingAddPoint,
//         ...isInBookingRemovalBody,
//       ][0]?.memberReferral?.pointFromAdmin
//     );
//     if (isInBookingAddPoint?.length > 0) {
//       isInBookingAddPoint?.forEach((item) => {
//         listMemberAddPoint.push(item?.memberId);
//         listPointHistory.push({
//           amount: Number(configs.POINT_REFERAL_TICKET) || 0,
//           type: PointHistoryType.POINT_REFERAL_TICKET,
//           usageType: PointHistoryUsageType.BUY,
//           referalId: item?.member?.id,
//           memberId: el,
//         });
//       });
//       pointAddForMember += isInBookingAddPoint.length * Number(configs.POINT_REFERAL_TICKET) || 0;
//     }
//     if (isInBookingDrNs?.length > 0) {
//       let countBooking = 0;
//       isInBookingDrNs?.forEach((item) => {
//         if (!listMemberAddPoint.includes(item?.memberId)) {
//           listPointHistory.push({
//             amount: Number(configs.POINT_REFERAL_FIRST_BOOKING_DRNS) || 0,
//             type: PointHistoryType.POINT_REFERAL_FIRST_BOOKING_DRNS,
//             usageType: PointHistoryUsageType.BUY,
//             referalId: item?.member?.id,
//             memberId: el,
//           });
//           countBooking++;
//         }
//       });
//       pointAddForMember += countBooking * Number(configs.POINT_REFERAL_FIRST_BOOKING_DRNS) || 0;
//     }
//     if (isInBookingRemovalBody?.length > 0) {
//       let countBooking = 0;
//       isInBookingRemovalBody?.forEach((item) => {
//         if (!listMemberAddPoint.includes(item?.memberId)) {
//           listPointHistory.push({
//             amount: Number(configs.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL) || 0,
//             type: PointHistoryType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL,
//             usageType: PointHistoryUsageType.BUY,
//             referalId: item?.member?.id,
//             memberId: el,
//           });
//           countBooking++;
//         }
//       });

//       pointAddForMember +=
//         countBooking * Number(configs.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL) || 0;
//     }
//     if (isInBookingRemoval?.length > 0) {
//       let countBooking = 0;
//       isInBookingRemoval?.forEach((item) => {
//         if (!listMemberAddPoint.includes(item?.memberId)) {
//           listPointHistory.push({
//             amount: Number(configs.POINT_REFERAL_FIRST_BOOKING_REMOVAL) || 0,
//             type: PointHistoryType.POINT_REFERAL_FIRST_BOOKING_REMOVAL,
//             usageType: PointHistoryUsageType.BUY,
//             referalId: item?.member?.id,
//             memberId: el,
//           });
//           countBooking++;
//         }
//       });

//       pointAddForMember += countBooking * Number(configs.POINT_REFERAL_FIRST_BOOKING_REMOVAL) || 0;
//     }

//     if (pointAddForMember !== 0) {
//       listUpdatePoint.push({
//         id: el,
//         pointFromAdmin: pointAddForMember,
//       });
//     }
//   });
//   return { listPointHistory, listUpdatePoint };
// }

// export async function sendNotiAddPoint(listPointHistory?: any[]) {
//   const configs = await listConfig();
//   sendNotificationPointListMember(
//     listPointHistory
//       ?.filter((el) => el.type === PointHistoryType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL)
//       ?.map((el) => el.memberId),
//     NotificationType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL,
//     Number(configs.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL)
//   );
//   sendNotificationPointListMember(
//     listPointHistory
//       ?.filter((el) => el.type === PointHistoryType.POINT_REFERAL_FIRST_BOOKING_DRNS)
//       ?.map((el) => el.memberId),
//     NotificationType.POINT_REFERAL_FIRST_BOOKING_DRNS,
//     Number(configs.POINT_REFERAL_FIRST_BOOKING_DRNS)
//   );
//   sendNotificationPointListMember(
//     listPointHistory
//       ?.filter((el) => el.type === PointHistoryType.POINT_REFERAL_TICKET)
//       ?.map((el) => el.memberId),
//     NotificationType.POINT_REFERAL_TICKET,
//     Number(configs.POINT_REFERAL_TICKET)
//   );
// }

// //noti point
// export async function sendNotificationPoint(memberId: number, typePoint: number, point) {
//   let title, typeNoti;
//   const pointFormat = formatNumber(point);
//   switch (typePoint) {
//     case NotificationType.DEPOSIT_POINT:
//       title = format(NotificationTitle.DEPOSIT_POINT, { point: pointFormat });
//       typeNoti = NotificationType.DEPOSIT_POINT;
//       break;
//     case NotificationType.POINT_ADMIN_CHANGE:
//       title = format(NotificationTitle.POINT_ADMIN_CHANGE, { point: pointFormat });
//       typeNoti = NotificationType.POINT_ADMIN_CHANGE;
//       break;
//     case NotificationType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL:
//       title = format(NotificationTitle.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL, {
//         point: pointFormat,
//       });
//       typeNoti = NotificationType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL;
//       break;
//     case NotificationType.POINT_REFERAL_FIRST_BOOKING_DRNS:
//       title = format(NotificationTitle.POINT_REFERAL_FIRST_BOOKING_DRNS, { point: pointFormat });
//       typeNoti = NotificationType.POINT_REFERAL_FIRST_BOOKING_DRNS;
//       break;
//     case NotificationType.POINT_REFERAL_TICKET:
//       title = format(NotificationTitle.POINT_REFERAL_TICKET, { point: pointFormat });
//       typeNoti = NotificationType.POINT_REFERAL_TICKET;
//       break;
//     case NotificationType.ACCEPT_REQUEST_WITHDRAW:
//       title = format(NotificationTitle.ACCEPT_REQUEST_WITHDRAW, { point: pointFormat });
//       typeNoti = NotificationType.ACCEPT_REQUEST_WITHDRAW;
//       break;
//     case NotificationType.REQUEST_WITHDRAW:
//       title = format(NotificationTitle.REQUEST_WITHDRAW, { point: pointFormat });
//       typeNoti = NotificationType.REQUEST_WITHDRAW;
//       break;
//     case NotificationType.POINT_ADD_FEEDBACK:
//       title = format(NotificationTitle.POINT_ADD_FEEDBACK, { point: pointFormat });
//       typeNoti = NotificationType.POINT_ADD_FEEDBACK;
//       break;
//     case NotificationType.POINT_REFERAL_LP:
//       title = format(NotificationTitle.POINT_REFERAL_LP, { point: pointFormat });
//       typeNoti = NotificationType.POINT_REFERAL_LP;
//       break;
//     default:
//       break;
//   }
//   sendNoti({
//     title: title,
//     memberId: memberId,
//     type: typeNoti,
//   });

//   logger.info('Noti When Update Point Success');
// }

// export async function sendNotificationPointListMember(
//   memberIds: number[],
//   typePoint: number,
//   point
// ) {
//   let title, typeNoti;
//   const pointFormat = formatNumber(point);
//   switch (typePoint) {
//     case NotificationType.DEPOSIT_POINT:
//       title = format(NotificationTitle.DEPOSIT_POINT, { point: pointFormat });
//       typeNoti = NotificationType.DEPOSIT_POINT;
//       break;
//     case NotificationType.POINT_ADMIN_CHANGE:
//       title = format(NotificationTitle.POINT_ADMIN_CHANGE, { point: pointFormat });
//       typeNoti = NotificationType.POINT_ADMIN_CHANGE;
//       break;
//     case NotificationType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL:
//       title = format(NotificationTitle.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL, {
//         point: pointFormat,
//       });
//       typeNoti = NotificationType.POINT_REFERAL_FIRST_BOOKING_BODY_REMOVAL;
//       break;
//     case NotificationType.POINT_REFERAL_FIRST_BOOKING_DRNS:
//       title = format(NotificationTitle.POINT_REFERAL_FIRST_BOOKING_DRNS, { point: pointFormat });
//       typeNoti = NotificationType.POINT_REFERAL_FIRST_BOOKING_DRNS;
//       break;
//     case NotificationType.POINT_REFERAL_TICKET:
//       title = format(NotificationTitle.POINT_REFERAL_TICKET, { point: pointFormat });
//       typeNoti = NotificationType.POINT_REFERAL_TICKET;
//       break;
//     case NotificationType.ACCEPT_REQUEST_WITHDRAW:
//       title = format(NotificationTitle.ACCEPT_REQUEST_WITHDRAW, { point: pointFormat });
//       typeNoti = NotificationType.ACCEPT_REQUEST_WITHDRAW;
//       break;
//     case NotificationType.POINT_ADD_FEEDBACK:
//       title = format(NotificationTitle.POINT_ADD_FEEDBACK, { point: pointFormat });
//       typeNoti = NotificationType.POINT_ADD_FEEDBACK;
//       break;
//     default:
//       break;
//   }
//   sendNotiToMembers({
//     title: title,
//     memberIds: memberIds,
//     type: typeNoti,
//   });

//   logger.info('Noti When Update Point Success');
// }

// export async function sendNotificationBookinBill(memberId: number, bookingId: number) {
//   sendNoti({
//     title: NotificationTitle.CREATE_BILL_OPTION,
//     memberId: memberId,
//     type: NotificationType.CREATE_BILL_OPTION,
//     targetId: bookingId,
//     targetType: NotificationTargetType.BOOKING,
//     data: {
//       bookingId,
//     },
//   });

//   logger.info('Noti When Booking bill created');
// }

// export async function sendNotificationUpdateBookinBill(memberId: number, bookingId: number) {
//   sendNoti({
//     title: NotificationTitle.UPDATE_BILL_OPTION,
//     memberId: memberId,
//     type: NotificationType.UPDATE_BILL_OPTION,
//     targetId: bookingId,
//     targetType: NotificationTargetType.BOOKING,
//     data: {
//       bookingId,
//     },
//   });

//   logger.info('Noti When Booking bill updated');
// }

// export async function getAllBookingNotCheckAddPoint() {
//   const bookingRepo = getRepository(Booking);
//   const bookings = await bookingRepo
//     .createQueryBuilder('booking')
//     .where('1=1')
//     .andWhere('booking.endTime < UTC_TIMESTAMP()')
//     .andWhere('booking.checkedAddPoint = 0')
//     .getMany();

//   return bookings;
// }

// export async function isRoomHasFixedTimeOff(roomId: number): Promise<boolean> {
//   const roomsWithFixedTimeOff = await getRepository(Room)
//     .createQueryBuilder('r')
//     .where(`r.status = :status`, { status: CommonStatus.ACTIVE })
//     .andWhere(`r.id = :roomId`, { roomId })
//     .andWhere(`r.hasFixedLongTimeOff = :hasFixedLongTimeOff`, { hasFixedLongTimeOff: 1 })
//     .select(['r.id', 'r.code', 'r.hasFixedLongTimeOff', 'r.startLongTimeOff', 'r.endLongTimeOff'])
//     .getMany();
//   return roomsWithFixedTimeOff.length > 0;
// }

// export async function importFixedTimeOffByDateRange(
//   startDate: Moment,
//   endDate: Moment
// ): Promise<void> {
//   const numOfDay = endDate.diff(startDate, 'days') + 1;
//   const dates = [...Array(numOfDay)].map((_e, i) => startDate.clone().add(i, 'd').toDate());

//   if (dates.length === 0) return;
//   const timeOffScheduleRepo = getRepository(TimeOffSchedule);
//   const roomsWithFixedLongTimeOff = await getRepository(Room)
//     .createQueryBuilder('r')
//     .where(`r.status = :status`, { status: CommonStatus.ACTIVE })
//     .andWhere(`r.hasFixedLongTimeOff = :hasFixedLongTimeOff`, { hasFixedLongTimeOff: 1 })
//     .select(['r.id', 'r.code', 'r.hasFixedLongTimeOff', 'r.startLongTimeOff', 'r.endLongTimeOff'])
//     .getMany();
//   if (roomsWithFixedLongTimeOff && roomsWithFixedLongTimeOff.length > 0) {
//     const roomIds = roomsWithFixedLongTimeOff.map((room) => room.id);
//     const stringDates = dates.map((date) => moment(date).format('YYYY-MM-DD'));
//     const timeOffInDates = await timeOffScheduleRepo
//       .createQueryBuilder('r')
//       .where(`r.type = :type`, { type: TimeOffType.STAFF_TIME_OFF })
//       .andWhere(`r.roomId IN (:roomIds)`, { roomIds })
//       .andWhere(`r.date IN (:stringDates)`, { stringDates })
//       .select(['r.id'])
//       .getMany();
//     if (timeOffInDates && timeOffInDates.length > 0) {
//       const wbdIds = timeOffInDates.map((e) => e.id);
//       await timeOffScheduleRepo.delete({ id: In(wbdIds) });
//     }
//     dates.forEach((date) => {
//       roomsWithFixedLongTimeOff.map(async (room) => {
//         try {
//           const startLongTimeOff = getTimeOffByDate(date, room['startLongTimeOff']);
//           const endLongTimeOff = getTimeOffByDate(date, room['endLongTimeOff']);
//           if (await isHaveBookingInTime(room.id, startLongTimeOff, endLongTimeOff)) return;
//           await timeOffScheduleRepo.save({
//             startTime: startLongTimeOff,
//             endTime: endLongTimeOff,
//             scheduleType: ScheduleType.UNEXPECTED,
//             date: moment(date).format('YYYY-MM-DD'),
//             type: TimeOffType.STAFF_TIME_OFF,
//             reason: '休憩',
//             roomId: room.id,
//             bgColor: 'linear-gradient(rgb(255, 255, 255), rgb(255, 139, 128))',
//             isFixedTimeOff: 1,
//           });
//         } catch (err) {
//           console.log(err);
//         }
//       });
//     });
//   }
// }

// const getTimeOffByDate = (date: Date, hoursMinutes: string): string => {
//   const arrayTimes = hoursMinutes.split(':').map((e) => +e);
//   return moment(date).hour(arrayTimes[0]).minute(arrayTimes[1]).toISOString();
// };

// async function isHaveBookingInTime(
//   roomId: number,
//   startTime: string,
//   endTime: string,
//   table = 'booking'
// ): Promise<boolean> {
//   const bookings = await getRepository(table === 'booking' ? Booking : TimeOffSchedule)
//     .createQueryBuilder('b')
//     .where('b.roomId = :roomId', { roomId })
//     .andWhere(
//       '((:startTime >= b.startTime AND :startTime < b.endTime) OR (:endTime > b.startTime AND :endTime <= b.endTime) OR (:startTime <= b.startTime AND :endTime >= b.endTime))',
//       { startTime, endTime }
//     )
//     .select([
//       'b.id id',
//       'b.startTime startTime',
//       'b.endTime endTime',
//       'b.roomId roomId',
//       'b.createdAt createdAt',
//       'b.updatedAt updatedAt',
//     ])
//     .getRawMany();
//   return bookings?.length > 0;
// }

// export async function getTimeOffQuery(
//   startDate: string,
//   endDate: string,
//   rooms: number[],
//   st: string,
//   et: string,
//   type: string,
//   isAllowOverlap: boolean,
//   dowAllow: number[]
// ): Promise<string> {
//   const roomData = await getRoomData();

//   const sd = moment(startDate);
//   const ed = moment(endDate);
//   const color =
//     type === 'full'
//       ? 'linear-gradient(#FFFFFF, #FFFFFF)'
//       : 'linear-gradient(rgb(255, 255, 255), rgb(255, 139, 128))';
//   const reason = type === 'rest' ? '休憩' : '';
//   const numOfDay = ed.diff(sd, 'days') + 1;
//   const dates = [...Array(numOfDay)].map((_e, i) => sd.clone().add(i, 'd').format('YYYY-MM-DD'));
//   let sql = `INSERT INTO time_off_schedule (date, start_time, end_time, type, reason, schedule_type, clinic_branch_id, room_id, updated_at, created_at, bg_color) VALUES 
// `;
//   for (const r of rooms) {
//     if (isAllowOverlap) {
//       for (const d of dates) {
//         if (dowAllow.includes(moment(d).day())) {
//           sql += `('${d}', '${d} ${st}', '${d} ${et}', 2, '${reason}', 2, ${+findBranch(
//             roomData,
//             r
//           )}, ${r}, '${moment().format('YYYY-MM-DD HH:mm:00')}', '${moment().format(
//             'YYYY-MM-DD HH:mm:00'
//           )}', '${color}') ,
// `;
//         }
//       }
//     } else {
//       const dupB = await isHaveBookingInTime2(r, startDate, endDate, st, et);
//       const dupT = await isHaveTimeoffInTime(r, startDate, endDate, st, et);
//       const dupDate = _.union(dupB, dupT).sort();
//       const validDate = _.difference(dates, dupDate);
//       for (const d of validDate) {
//         if (dowAllow.includes(moment(d).day())) {
//           sql += `('${d}', '${d} ${st}', '${d} ${et}', 2, '${reason}', 2, ${+findBranch(
//             roomData,
//             r
//           )}, ${r}, '${moment().format('YYYY-MM-DD HH:mm:00')}', '${moment().format(
//             'YYYY-MM-DD HH:mm:00'
//           )}', '${color}') ,
// `;
//         }
//       }
//     }
//   }
//   return sql.slice(0, -2).concat(';');
// }

// async function isHaveBookingInTime2(
//   roomId: number,
//   startDate: string,
//   endDate: string,
//   startTime: string,
//   endTime: string
// ): Promise<string[]> {
//   const bookings = await getRepository(Booking)
//     .createQueryBuilder('b')
//     .where('b.roomId = :roomId', { roomId })
//     .andWhere('DATE(b.startTime) >= :startDate', { startDate })
//     .andWhere('DATE(b.endTime) <= :endDate', { endDate })
//     .andWhere(
//       `((:startTime >= TIME(b.startTime) AND :startTime < TIME(b.endTime)) OR
//        (:endTime > TIME(b.startTime) AND :endTime <= TIME(b.endTime)) OR 
//        (:startTime <= TIME(b.startTime) AND :endTime >= TIME(b.endTime)))`,
//       { startTime, endTime }
//     )
//     .select("DATE_FORMAT(b.startTime, '%Y-%m-%d') as date")
//     .distinct()
//     .orderBy('date')
//     .getRawMany();
//   return bookings.map((e) => e.date);
// }

// async function isHaveTimeoffInTime(
//   roomId: number,
//   startDate: string,
//   endDate: string,
//   startTime: string,
//   endTime: string
// ): Promise<string[]> {
//   const bookings = await getRepository(TimeOffSchedule)
//     .createQueryBuilder('t')
//     .where('t.roomId = :roomId', { roomId })
//     .andWhere('t.date >= :startDate', { startDate })
//     .andWhere('t.date <= :endDate', { endDate })
//     .andWhere(
//       `((:startTime >= TIME(t.startTime) AND :startTime < TIME(t.endTime)) OR
//        (:endTime > TIME(t.startTime) AND :endTime <= TIME(t.endTime)) OR 
//        (:startTime <= TIME(t.startTime) AND :endTime >= TIME(t.endTime)))`,
//       { startTime, endTime }
//     )
//     .select("DATE_FORMAT(t.date, '%Y-%m-%d') as date")
//     .distinct()
//     .orderBy('date')
//     .getRawMany();
//   return bookings.map((e) => e.date);
// }

// export async function getRoomData() {
//   return await getRepository(Room).find({
//     where: { status: 1 },
//     select: ['id', 'clinicBranchId'],
//   });
// }

// export const findBranch = (rooms: any[], id: string | number) =>
//   _.result(_.find(rooms, { id: Number(id) }), 'clinicBranchId', null);

// export const sendHelp = (param: any) => {
//   const { code, email, fullName, message, phoneNumber } = param;

//   const content = `
//   <p>ユーザ: ${fullName ?? ''} </p>
//   <p>コード: ${code ?? ''} </p>
//   <p>メールアドレス: ${email ?? ''} </p>
//   <p>電話番号: ${phoneNumber ?? ''} </p>
//   <p>問い合わせ内容: ${message ?? ''} </p>
//   `;
//   sendMail(config.mailer.mailContactAddress, `ヘルプ情報`, content, false, false, false);
// };
