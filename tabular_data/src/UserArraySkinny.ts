export interface UserInArraySkinny extends Array<number | string> {
  0: number; // id
  1: string; // name
  2: string; // email
  3: string; // job_title
};

export class UserArraySkinny {
  getId(user: UserInArraySkinny) {
    return user[0];
  }

  getUserName(user: UserInArraySkinny) {
    return user[1];
  }

  getEmail(user: UserInArraySkinny) {
    return user[2];
  }

  getTitle(user: UserInArraySkinny) {
    return user[3];
  }

  filter(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (user: UserInArraySkinny) => user[1].indexOf(lowerCaseSearchTerm) === 0;
  }
}
