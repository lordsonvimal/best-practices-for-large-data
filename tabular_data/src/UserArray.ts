export interface UserInArray extends Array<number | string> {
  0: number; // id
  1: string; // first_name
  2: string; // last_name
  3: string; // email
  4: string; // job_title
};

export class UserArray {
  getId(user: UserInArray) {
    return user[0];
  }

  getUserName(user: UserInArray) {
    return `${user[1]} ${user[2]}`;
  }

  getEmail(user: UserInArray) {
    return user[3];
  }

  getTitle(user: UserInArray) {
    return user[4];
  }

  filter(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (user: UserInArray) => `${user[1]} ${user[2]}`.toLowerCase().indexOf(lowerCaseSearchTerm) === 0;
  }
}
