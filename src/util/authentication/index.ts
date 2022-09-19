export function isValidEmail(email: string) {
  return email.length > 10 && email.endsWith('@u.nus.edu');
}
