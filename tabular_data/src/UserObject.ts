export interface UserInObject {
  id: number;
  email: string;
  job_title: string;
  first_name: string;
  last_name: string;
};

export class UserObject {
  getId(user: UserInObject) {
    return user.id;
  }

  getUserName(user: UserInObject) {
    return `${user.first_name} ${user.last_name}`;
  }

  getEmail(user: UserInObject) {
    return user.email;
  }

  getTitle(user: UserInObject) {
    return user.job_title;
  }

  filter(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (user: UserInObject) => `${user.first_name} ${user.last_name}`.toLowerCase().indexOf(lowerCaseSearchTerm) === 0;
  }
}
