export interface PagingParams {
  pageIndex?: number;
  take?: number;
  start?: number;
  skip?: number;
}

export interface ILogging {
  originalUrl: string;
  userId?: number;
  memberId?: number;
}
export interface IMedicalMember {
  memberId: number;
  fullName?: string;
  code?: string;
  address?: string;
  height: number;
  weight: number;
  birthday?: string;
  infected: number;
  infectedInfo?: string;
  allegy: number;
  allegyInfo?: string;
  illnessUnderTreatment: number;
  illnessInfo?: string;
  otherTreatmentHistory?: string;
  rateSurvey?: number;
  surveyQuestionId?: number;
  hairLossIds?: number[];
  diseaseInFaceIds?: number[];
  referralCode?: string;
}

export interface IVerifyImage {
  photoBackUrl: string;
  photoFrontUrl: string;
  memberId?: number;
}
