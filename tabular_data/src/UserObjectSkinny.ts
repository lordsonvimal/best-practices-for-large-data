export interface UserInObjectSkinny {
  id: number;
  email: string;
  job_title: string;
  name: string;
};

export class UserObjectSkinny {
  getId(user: UserInObjectSkinny) {
    return user.id
  }

  getUserName(user: UserInObjectSkinny) {
    return user.name;
  }

  getEmail(user: UserInObjectSkinny) {
    return user.email;
  }

  getTitle(user: UserInObjectSkinny) {
    return user.job_title;
  }

  filter(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (user: UserInObjectSkinny) => user.name.indexOf(lowerCaseSearchTerm) === 0;
  }
}
