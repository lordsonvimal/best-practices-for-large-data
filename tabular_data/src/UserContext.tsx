import { Accessor, createSignal, createContext, useContext, createMemo, JSX, Setter, createEffect } from "solid-js";
import { UserArray, UserInArray } from "./UserArray";
import { UserInObject, UserObject } from "./UserObject";
import { UserInObjectSkinny, UserObjectSkinny } from "./UserObjectSkinny";
import { UserArraySkinny, UserInArraySkinny } from "./UserArraySkinny";

export type User = UserInObject | UserInArray | UserInObjectSkinny | UserInArraySkinny;

type Props = {
  children: JSX.Element
};

type Context = {
  filteredUsers: Accessor<User[]>,
  isServer: Accessor<boolean>,
  getTotalRecords: () => number,
  getUsers: () => User[],
  lastIdOnPage: Accessor<Record<number, number>>,
  pageNo: Accessor<number>,
  pages: () => number,
  paginatedUsers: Accessor<User[]>,
  searchTerm: Accessor<string>,
  setIsServer: Setter<boolean>,
  setLastIdOnPage: Setter<Record<number, number>>,
  setPageNo: Setter<number>,
  setPaginate: Setter<boolean>,
  setSearchTerm: Setter<string>,
  setTotalRecords: Setter<number>,
  setUsers: Setter<never[]>,
  userInfo: Accessor<UserArray | UserObject | UserArraySkinny | UserObjectSkinny>
};

const UserContext = createContext<Context>();

const PAGE_SIZE = 50;

const USER_INFO = {
  arr: new UserArray(),
  arrSkinny: new UserArraySkinny(),
  obj: new UserObject(),
  objSkinny: new UserObjectSkinny()
}

export function UserProvider(props: Props) {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [users, setUsers] = createSignal([]);
  const [paginate, setPaginate] = createSignal(false);
  const [pageNo, setPageNo] = createSignal(1);
  const [totalRecords, setTotalRecords] = createSignal(0);
  const [lastIdOnPage, setLastIdOnPage] = createSignal<Record<number, number>>({});
  const [isServer, setIsServer] = createSignal(false);

  // createEffect(() => {
  //   console.log(lastIdOnPage());
  // });
  
  const userInfo = createMemo(() => {
    const sampleUser = users()[0];

    if (!sampleUser) return new UserObject();

    const isArray = Array.isArray(sampleUser);

    if (isArray) {
      if (sampleUser[4]) return USER_INFO.arr;
      return USER_INFO.arrSkinny;
    }

    if ((sampleUser as UserInObjectSkinny).name) return USER_INFO.objSkinny;
    return USER_INFO.obj;
  });

  const filteredUsers = createMemo<User[]>(() => {
    if (isServer()) return users();
    if (!searchTerm()) return users();
    return users().filter(userInfo().filter(searchTerm()));
  });

  const pages = () => {
    if (isServer()) return Math.ceil(totalRecords() / PAGE_SIZE);
    const totalUsers = filteredUsers().length;
    if (totalUsers === 0) return 1;
    return Math.ceil(totalUsers / PAGE_SIZE);
  };
  
  const paginatedUsers = createMemo<User[]>(() => {
    const startIndex = (pageNo() - 1) * PAGE_SIZE;
    const endIndex = PAGE_SIZE * pageNo();
    
    return filteredUsers().slice(startIndex, endIndex);
  });

  const getUsers = (): User[] => {
    if (isServer()) return users();
    return paginate() ? paginatedUsers() : filteredUsers();
  };

  const getTotalRecords = () => {
    if (isServer()) return totalRecords();
    return filteredUsers().length;
  };

  const providerValue = {
    filteredUsers,
    getTotalRecords,
    isServer,
    getUsers,
    lastIdOnPage,
    pageNo,
    pages,
    paginatedUsers,
    searchTerm,
    setIsServer,
    setLastIdOnPage,
    setPageNo,
    setPaginate,
    setSearchTerm,
    setTotalRecords,
    setUsers,
    userInfo,
  };
  
  return (
    <UserContext.Provider value={providerValue}>
      {props.children}
    </UserContext.Provider>
  );
}

function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext: cannot find a UserContext");
  }
  return context;
}

export function useUser() { return useUserContext(); }
