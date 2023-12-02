import "./App.scss";

import { Component, JSX, createEffect, createSignal, Show, onCleanup, Switch, Match } from "solid-js";
import { VirtualList } from "./VirtualList";
import { Users } from "./Users";
import { UserCard } from "./UserCard";
import { Paginate } from "./Paginate";
import { useUser } from "./UserContext";

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

const App: Component = () => {
  const [fetchMode, setFetchMode] = createSignal<FetchMode>(0);
  const [context, setContext] = createSignal<keyof typeof RECORDS_URL>("1K");
  const [isLoading, setIsLoading] = createSignal(false);
  const [mode, setMode] = createSignal<Mode>(0);

  const { filteredUsers, getUsers, pageNo, pages, searchTerm, setPageNo, setPaginate, setSearchTerm, setTotalRecords, setUsers } = useUser();

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
      setPageNo(1);
      setPaginate(MODES[mode()] === "CLIENT_PAGINATE" || MODES[mode()] === "SERVER_PAGINATE");
      setTotalRecords(responseJson.users.length); // Update it for server side
      setIsLoading(false);
      setUsers(responseJson.users as never[]);
      // comparisonWorker.postMessage({ event: "update", users: responseJson.users });
    } catch(e) {}
  };

  createEffect(() => {
    fetchRecords(context(), fetchMode());
  });

  createEffect(() => {
    const currentMode = mode();
    setPaginate(MODES[currentMode] === "CLIENT_PAGINATE" || MODES[currentMode] === "SERVER_PAGINATE");
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
    setSearchTerm(e.currentTarget.value);
    setPageNo(1);
  }

  return (
    <>
      <main>
        <h2>Users</h2>
        <div class="list-toolbar">
          <input autofocus onInput={searchUsers} placeholder="Search users..." value={searchTerm()} />
          <Show when={MODES[mode()] === "CLIENT_PAGINATE" || MODES[mode()] === "SERVER_PAGINATE"}>
            <Paginate onChange={(pageNo: number) => setPageNo(pageNo)} pageNo={pageNo()} pages={pages()} />
          </Show>
          <Show when={!isLoading()} fallback={<div><b>Loading...</b></div>}>
            <span>Showing <b>{filteredUsers().length}</b> users</span>
          </Show>
        </div>
        <Show when={!isLoading()} fallback={<div />}>
          <Switch>
            <Match when={MODES[mode()] === "CLIENT_DEFAULT"}>
              <Users users={getUsers() as never[]} renderer={(user: never) => <UserCard user={user} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "CLIENT_VIRTUALIZE"}>
              <VirtualList users={getUsers() as never[]} renderer={(user: never) => <UserCard user={user} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "CLIENT_PAGINATE"}>
              <Users users={getUsers() as never[]} renderer={(user: never) => <UserCard user={user} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "SERVER_PAGINATE"}>
              <Users users={getUsers() as never[]} renderer={(user: never) => <UserCard user={user} onCompare={getUsersWithSameJob} />} />
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
