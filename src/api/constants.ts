/**
 * Declare all URL paths in this file.
 */
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const VERIFY_EMAIL_PATH = '/verify';
export const VERIFY_AUTHENTICATION = '/authenticate';
export const GET_LIST_OF_MODULES_PATH = '/modules';
export const REFRESH_TOKEN_PATH = '/token/refresh';
export const RESEND_OTP_PATH = '/resend_otp'
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
export const ENROLL_MODULE_PATH = '/user/enroll';
export const UNENROLL_MODULE_PATH = '/user/unenroll';
export const CONNECTIONS_PATH = '/user/connections';
export function getPathForSetModuleStatusForUser(moduleCode: string) {
  return '/user/status' + moduleCode;
}
// TODO: check how we want to implement profile picture viewing logic
export const PROFILE_PICTURE_PATH = '/picture';
