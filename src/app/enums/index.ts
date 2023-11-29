export enum ErrorCode {
  Unknown_Error = 0,
  Invalid_Input = 1,
  Member_Blocked = 2,
  Username_Or_Password_Invalid = 3,
  Token_Not_Exist = 4,
  User_Blocked = 5,
  Token_Expired = 6,
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist = 7,
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire = 8,
  /**The client do not have permission for this action. */
  Permission_Denied = 9,
  User_Not_Exist = 10,
  Not_Found = 11,
  Access_Denied = 12,
  No_Data_Found = 13,
  Employee_Not_Exist=14,
  File_Not_Found=15,
  Topic_Not_Exist=16,
  Lab_Image_Not_Exist=17,
  Lab_Service_Not_Exist=18,
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum BlockStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum Gender {
  FEMALE = 2,
  MALE = 1,
}

export enum ROLE {
  ADMIN = "ADMIN"
}

export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum CommonStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum VerifiedCodeStatus {
  UNUSED = 1,
  USED = 2,
}

export enum CREATED_TYPE {
  USER = 1,
  ADMIN = 2,
}

export enum AccountStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}