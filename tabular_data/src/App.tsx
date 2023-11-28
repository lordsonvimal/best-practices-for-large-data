import "./App.scss";

import { Accessor, Component, JSX, createEffect, createSignal, Show, onCleanup, Setter, Switch, Match, createMemo } from "solid-js";
import { VirtualList } from "./VirtualList";
import { Users } from "./Users";
import { UserCard } from "./UserCard";
import { Paginate } from "./Paginate";

export interface UserInArray extends Array<string> {
  0: string; // name
  1: string; // email
  2: string; // job_title
};

export interface UserInObject {
  email: string;
  job_title: string;
  first_name: string;
  last_name: string;
};

export type User = UserInObject | UserInArray;

type ResponseJson = {
  users: User[]
};

const RECORDS_URL = {
  "1K": "http://localhost:1324/get_1k_records",
  "10K": "http://localhost:1324/get_10k_records",
  "100K": "http://localhost:1324/get_100k_records",
  "2M": "http://localhost:1324/get_2m_records"
};

export const PAGE_SIZE = 50;

const MODES = ["CLIENT_DEFAULT", "CLIENT_VIRTUALIZE", "CLIENT_PAGINATE", "SERVER_PAGINATE"] as const;
type Mode = 0 | 1 | 2 | 3;

const FETCH_MODES = ["default", "skinny", "array"] as const;
type FetchMode = 0 | 1 | 2;

const COMPARE_MODES = ["COMPARE_DEFAULT", "COMPARE_WEB_WORKER"] as const;

const comparisonWorker = new Worker(new URL("./comparisonWorker.ts", import.meta.url));

type Option = {
  pageNo?: number,
  totalRecords?: number,
  paginate?: boolean
}

class UserObject {
  searchTerm: Accessor<string>;
  setSearchTerm: Setter<string>;
  setUsers: Setter<UserInObject[]>;
  users: Accessor<UserInObject[]>;
  paginate: Accessor<boolean>;
  setPaginate: Setter<boolean>;
  pageNo: Accessor<number>;
  setPageNo: Setter<number>;
  totalRecords: Accessor<number>;
  setTotalRecords: Setter<number>;
  pages: () => number;
  paginatedUsers: () => UserInObject[];
  filteredUsers: () => UserInObject[];

  constructor(people: UserInObject[], options: Option = {}) {
    const [searchTerm, setSearchTerm] = createSignal("");
    const [users, setUsers] = createSignal(people);
    const [paginate, setPaginate] = createSignal(options.paginate || false);
    const [pageNo, setPageNo] = createSignal(options.pageNo || 1);
    const [totalRecords, setTotalRecords] = createSignal(options.totalRecords || 0);
    this.searchTerm = searchTerm;
    this.setSearchTerm = setSearchTerm;
    this.users = users;
    this.setUsers = setUsers;
    this.paginate = paginate;
    this.setPaginate = setPaginate;
    this.pageNo = pageNo;
    this.setPageNo = setPageNo;
    this.totalRecords = totalRecords;
    this.setTotalRecords = setTotalRecords;
    this.filteredUsers = createMemo(() => {
      const lowerCaseSearchTerm = searchTerm().toLowerCase();
      return users().filter((user) => `${user.first_name} ${user.last_name}`.toLowerCase().indexOf(lowerCaseSearchTerm) === 0);
    });

    this.pages = () => {
      const totalUsers = this.filteredUsers().length;
      if (totalUsers === 0) return 1;
      return Math.ceil(totalUsers / PAGE_SIZE);
    };
  
    this.paginatedUsers = createMemo(() => {
      const startIndex = (pageNo() - 1) * PAGE_SIZE;
      const endIndex = PAGE_SIZE * pageNo();
      
      return this.filteredUsers().slice(startIndex, endIndex);
    });
  }

  getUser = (index: number) => {
    const user = this.paginate() ? this.paginatedUsers()[index] : this.filteredUsers()[index];
    return user;
  }

  getUserName = (index: number) => {
    const user = this.getUser(index);
    return `${user.first_name} ${user.last_name}`;
  }
  
  getEmail = (index: number) => {
    const user = this.getUser(index);
    return user.email;
  }
  
  getTitle = (index: number) => {
    const user = this.getUser(index);
    return user.job_title;
  }

  filter = (): UserInObject[] => {
    const lowerCaseSearchTerm = this.searchTerm().toLowerCase();
    return this.users().filter((_user, index) => this.getUserName(index).toLowerCase().indexOf(lowerCaseSearchTerm) === 0);
  }
}

class UserArray {
  searchTerm: Accessor<string>;
  setSearchTerm: Setter<string>;
  setUsers: Setter<UserInArray[]>;
  users: Accessor<UserInArray[]>;
  pageNo: Accessor<number>;
  paginate: Accessor<boolean>;
  setPaginate: Setter<boolean>;
  setPageNo: Setter<number>;
  totalRecords: Accessor<number>;
  setTotalRecords: Setter<number>;

  constructor(people: UserInArray[], options: Option) {
    const [searchTerm, setSearchTerm] = createSignal("");
    const [users, setUsers] = createSignal(people);
    const [paginate, setPaginate] = createSignal(options.paginate || false);
    const [pageNo, setPageNo] = createSignal(options.pageNo || 1);
    const [totalRecords, setTotalRecords] = createSignal(options.totalRecords || 0);
    this.searchTerm = searchTerm;
    this.setSearchTerm = setSearchTerm;
    this.users = users;
    this.setUsers = setUsers;
    this.paginate = paginate;
    this.setPaginate = setPaginate;
    this.pageNo = pageNo;
    this.setPageNo = setPageNo;
    this.totalRecords = totalRecords;
    this.setTotalRecords = setTotalRecords;
  }

  getUser = (index: number) => {
    const user = this.paginate() ? this.paginatedUsers()[index] : this.filteredUsers()[index];
    return user;
  }

  getUserName(index: number) {
    return this.filteredUsers()[index][0];
  }

  getEmail(index: number) {
    return this.filteredUsers()[index][1];
  }

  getTitle(index: number) {
    return this.filteredUsers()[index][2];
  }

  filter() {
    const lowerCaseSearchTerm = this.searchTerm().toLowerCase();
    return this.users().filter(user => user[0].indexOf(lowerCaseSearchTerm) === 0);
  }

  filteredUsers = () => {
    return createMemo(() => this.filter())();
  };

  pages = () => {
    const totalUsers = this.filteredUsers().length;
    if (totalUsers === 0) return 1;
    return Math.ceil(totalUsers / PAGE_SIZE);
  };

  paginatedUsers = () => {
    const startIndex = (this.pageNo() - 1) * PAGE_SIZE;
    const endIndex = PAGE_SIZE * this.pageNo();
    return this.filteredUsers().slice(startIndex, endIndex);
  };
}

export type Container = UserArray | UserObject;

const App: Component = () => {
  const [fetchMode, setFetchMode] = createSignal<FetchMode>(0);
  const [container, setContainer] = createSignal<Container>(new UserObject([]));
  const [context, setContext] = createSignal<keyof typeof RECORDS_URL>("1K");
  const [isLoading, setIsLoading] = createSignal(false);
  const [mode, setMode] = createSignal<Mode>(0);

  onCleanup(() => {
    comparisonWorker.terminate();
  });

  const getUrl = (count: keyof typeof RECORDS_URL) => {
    const BASE_URL = RECORDS_URL[count];
    const modeToFetch = fetchMode();

  };

  const fetchRecords = async (count: keyof typeof RECORDS_URL, fetchMode: FetchMode) => {
    try {
      setIsLoading(true);
      const response = await fetch(RECORDS_URL[count]);
      const responseJson: ResponseJson = await response.json();

      const isArray = Array.isArray(responseJson.users[0]);
      const options = {
        totalRecords: responseJson.users.length,
        pageNo: 1,
        paginate: MODES[mode()] === "CLIENT_PAGINATE" || MODES[mode()] === "SERVER_PAGINATE"
      };
      const newContainer = isArray ? new UserArray(responseJson.users as UserInArray[], options) : new UserObject(responseJson.users as UserInObject[], options);      
      setContainer(newContainer);
      setIsLoading(false);
      // comparisonWorker.postMessage({ event: "update", users: responseJson.users });
    } catch(e) {}
  };

  createEffect(() => {
    fetchRecords(context(), fetchMode());
  });

  createEffect(() => {
    const currentMode = mode();
    container().setPaginate(MODES[currentMode] === "CLIENT_PAGINATE" || MODES[currentMode] === "SERVER_PAGINATE");
  });

  comparisonWorker.onmessage = (e) => {
    console.log(e.data.users);
  };

  const goToNextFetchMode = () => {
    const currentFetchMode: FetchMode = fetchMode();
    if (currentFetchMode === FETCH_MODES.length - 1) {
      return;
    }

    const newVal = currentFetchMode + 1 as FetchMode;
    setFetchMode(newVal);
  };

  const goToPrevFetchMode = () => {
    const currentFetchMode = fetchMode();
    if (currentFetchMode === 0) {
      return;
    }

    const newVal = currentFetchMode - 1 as FetchMode;
    setFetchMode(newVal);
  };

  const goToNextMode = () => {
    const currentMode = mode();
    if (currentMode === MODES.length - 1) {
      return;
    }

    const newMode = currentMode + 1 as Mode;
    setMode(newMode);
  };
  
  const goToPrevMode = () => {
    const currentMode = mode();
    if (currentMode === 0) {
      return;
    }
    
    const newMode = currentMode - 1 as Mode;
    setMode(newMode);
  };

  const getUsersWithSameJob = (user: User) => {
    // const job = util instanceof UserArray ? util.getTitle(user as UserInArray) : util.getTitle(user as UserInObject);
    // comparisonWorker.postMessage({ event: "compare", job: "" });
  };

  const changeContext = (context: keyof typeof RECORDS_URL) => {
    setContext(context);
  };

  const searchUsers: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    container().setSearchTerm(e.currentTarget.value);
    container().setPageNo(1);
  }

  return (
    <>
      <main>
        <h2>Users</h2>
        <div class="list-toolbar">
          <input autofocus onInput={searchUsers} placeholder="Search users..." value={container().searchTerm()} />
          <Show when={MODES[mode()] === "CLIENT_PAGINATE" || MODES[mode()] === "SERVER_PAGINATE"}>
            <Paginate onChange={(pageNo: number) => container().setPageNo(pageNo)} pageNo={container().pageNo()} pages={container().pages()} />
          </Show>
          <Show when={!isLoading()} fallback={<div><b>Loading...</b></div>}>
            <span>Showing <b>{container().filteredUsers().length}</b> users</span>
          </Show>
        </div>
        <Show when={!isLoading()} fallback={<div />}>
          <Switch>
            <Match when={MODES[mode()] === "CLIENT_DEFAULT"}>
              <Users container={container} renderer={(container: Accessor<Container>, index: Accessor<number>) => <UserCard container={container} index={index} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "CLIENT_VIRTUALIZE"}>
              <VirtualList container={container} renderer={(container: Accessor<Container>, index: Accessor<number>) => <UserCard container={container} index={index} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "CLIENT_PAGINATE"}>
              <Users container={container} renderer={(container: Accessor<Container>, index: Accessor<number>) => <UserCard container={container} index={index} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "SERVER_PAGINATE"}>
              <Users container={container} renderer={(container: Accessor<Container>, index: Accessor<number>) => <UserCard container={container} index={index} onCompare={getUsersWithSameJob} />} />
            </Match>
          </Switch>
        </Show>
        <div class="btn-group">
          <button classList={{ "btn": true, "btn-selected": context() === "1K" }} onClick={[changeContext, "1K"]}>1K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "10K" }} onClick={[changeContext, "10K"]}>10K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "100K" }} onClick={[changeContext, "100K"]}>100K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "2M" }} onClick={[changeContext, "2M"]}>2M records</button>
          <button classList={{ "btn": true }} disabled={fetchMode() === 0} onClick={goToPrevFetchMode} style={{ "margin-left": "auto" }}>{"<"}</button>
          <b class="mode-text">{FETCH_MODES[fetchMode()][0]}</b>
          <button classList={{ "btn": true }} disabled={fetchMode() === FETCH_MODES.length - 1} onClick={goToNextFetchMode}>{">"}</button>
          <button classList={{ "btn": true }} disabled={mode() === 0} onClick={goToPrevMode}>{"<"}</button>
          <i class="mode-text">{MODES[mode()]}</i>
          <button classList={{ "btn": true }} disabled={mode() === MODES.length - 1} onClick={goToNextMode}>{">"}</button>
        </div>
      </main>
    </>
  );
};

export default App;
