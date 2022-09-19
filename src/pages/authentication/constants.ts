export const ERROR_FIELD_NAME = "error_message";

export interface AuthenticationResponse {
  [ERROR_FIELD_NAME]?: string;
}