export enum ConnectionStatus {
  NOT_CONNECTED,
  CONNECTED,
  PENDING,
}

/**
 * Enum used to repesent a User status. If the user does not have a status, then this field would be null or undefined.
 */
export enum UserStatus {
  LOOKING_FOR_A_FRIEND = 'Looking for a friend',
  WILLING_TO_HELP = 'Willing to help',
}

/**
 * A class that contains all possible contact details fields for a user.
 * Only nus_email is a mandatory field.
 */
export interface ContactDetails {
  email: string;
  telegramHandle?: string;
  phoneNumber?: string;
}

/**
 * Class that contains all fields necessary for displaying a user listing in a list.
 */
export interface User {
  id: string;
  name: string;
  // link to thumbnail image for this user
  thumbnailPic?: string;
  connectionStatus: ConnectionStatus;
  // the status of this user in the mod
  userStatus?: UserStatus;
}

/**
 * Class containing all fields necessary to show full user details.
 */
export interface DetailedUser extends User {
  // link to full profile pic for this user
  profilePic?: string;
  contact_details: ContactDetails;
  // year that this user matriculated into NUS
  matriculationYear: string;
  // course they are in
  universityCourse: string;
  // short writeup about user
  bio: string;
}

/**
 * Class that repesents a university module.
 */
export interface UniModule {
  // code guaranteed to be unique for each module
  code: string;
  name: string;
  // optional since sometimes we may want the module simple details without enrolled students
  enrolledStudents?: Array<User>;
}

export interface Connection {
  id: string;
  // other user thats associated with this connction
  otherUser: User;
  uniModule: UniModule;
  dateTime: Date;
}
