/**
 * Declare all URL paths in this file.
 */
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const VERIFY_EMAIL_PATH = '/otp/verify';
export const LOGOUT_PATH = '/logout';
export const VERIFY_AUTHENTICATION = '/token/verify';
export const GET_LIST_OF_MODULES_PATH = '/modules';
export const REFRESH_TOKEN_PATH = '/token/refresh';
export const RESEND_OTP_PATH = '/otp/send';
export function getPathForGetListOfUsersForModule(moduleCode: string) {
  return '/modules/' + moduleCode + '/users';
}
export const GET_MODULES_OF_STUDENT_PATH = '/user/modules';
export function getPathForGetUserDetails(userId: string) {
  return '/user/' + userId;
}
export function getPathForGetStudentsOfModule(moduleCode: string) {
  return '/modules/' + moduleCode + '/users';
}
export const OWN_USER_DETAILS_PATH = '/user';
export const ENROLL_MODULE_PATH = '/user/modules/enroll';
export const CONNECTIONS_PATH = '/user/connections';
export function getPathForSetModuleStatusForUser(moduleCode: string) {
  return '/user/status/' + moduleCode;
}

export const OWN_USER_MODULE_STATUS = '/user/modules/status';
// TODO: check how we want to implement profile picture viewing logic
export const PROFILE_PICTURE_PATH = '/user/picture';
