import _ from 'lodash';
import moment from 'moment';


interface PagingParams {
  pageIndex: number;
  take: number;
  start: number;
  [key: string]: any;
}

export function returnPaging(data: any, totalItems: number, params: any, metadata = {}) {
  return {
    data,
    totalItems,
    paging: true,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.take),
    metadata,
  };
}

export function assignPaging(params) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.take = Number(params.take) || 10;
  params.skip = (params.pageIndex - 1) * params.take;
  return params;
}

/**
 * @param length(option) length of result.
 */
export function randomOTP(length: number = 5): string {
  const digits = '0123456789';
  const digitsLength = digits.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digitsLength);
    result += digits[index];
  }
  return result;
}

export function checkIsBeforeOneDay(startTime: Date | string) {
  const now = moment(new Date(), 'YYYY-MM-DD hh:mm:ss');
  const bookingStartDate = moment(startTime, 'YYYY-MM-DD hh:mm:ss');
  const minutesDiff = bookingStartDate.subtract(0, 'days').startOf('day').diff(now, 'minutes');
  return minutesDiff < 0;
}

export function checkIsBeforeTwoDay(startTime: Date | string) {
  const now = moment(new Date(), 'YYYY-MM-DD hh:mm:ss');
  const bookingStartDate = moment(startTime, 'YYYY-MM-DD hh:mm:ss');
  const minutesDiff = bookingStartDate.subtract(1, 'days').startOf('day').diff(now, 'minutes');
  return minutesDiff < 0;
}

export function nearestFutureMinutes(interval, someMoment) {
  const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
  return someMoment.clone().minute(roundedMinutes).startOf('seconds');
}

export const convertBookingDate = (startTime: string | Date) => {
  return startTime
    ? `${moment(startTime).format('YYYY')}年 ${moment(startTime).format('MM')}月 ${moment(
        startTime
      ).format('DD')}日 ${moment(startTime).format('HH')}時${moment(startTime).format('mm')}分`
    : `---`;
};
// export const convertDate = (date: string | Date) => {

//   return date ? moment(date).tz('Asia/Bangkok').format('YYYY-MM-DD') : '';
// };

// export const convertTime = (time: string | Date) => {
//   return time ? `${moment(time).tz('Asia/Bangkok').format('HH:mm')}` : `---`;
// };
// export const convertDateTimeRange = (startTime: string | Date, endTime: string | Date) => {
//   return `${convertDate(startTime)} ${convertTime(startTime)}~${convertTime(endTime)}`;
// };
// export const convertTimeRange = (startTime: string | Date, endTime: string | Date) => {
//   return `${convertTime(startTime)}~${convertTime(endTime)}`;
// };

export function convertDataConfig(type, value) {
  switch (type) {
    case 'INT':
      return Number(value);

    case 'JSON':
    case 'BOOLEAN':
      return JSON.parse(value);

    default:
      return value;
  }
}