/**
 * API call handlers for users.
 */

import { sampleDetailedUser } from './sampleData';
import { DetailedUser } from './types';

/**
 * Returns detailed user object of self
 */
export function getSelfUser(): DetailedUser {
  return sampleDetailedUser;
}
