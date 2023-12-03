import "./App.scss";

import { Component, JSX, createEffect, createSignal, Show, onCleanup, Switch, Match, createMemo, batch } from "solid-js";
import { VirtualList } from "./VirtualList";
import { Users } from "./Users";
import { UserCard } from "./UserCard";
import { Paginate } from "./Paginate";
import { User, useUser } from "./UserContext";
import { debounce, throttle } from "@solid-primitives/scheduled";

type ResponseJson = {
  users: User[],
  total_records: number
};

const RECORDS_URL = {
  "1K": "http://localhost:1324/get_1k_records",
  "10K": "http://localhost:1324/get_10k_records",
  "100K": "http://localhost:1324/get_100k_records",
  "2M": "http://localhost:1324/get_2m_records"
};

export const PAGE_SIZE = 50;

const MODES = ["DEFAULT", "VIRTUALIZE", "PAGINATE"] as const;
type Mode = 0 | 1 | 2;

const FETCH_MODES = ["default", "skinny", "array", "object_optimized", "array_optimized", "server_optimized"] as const;
type FetchMode = 0 | 1 | 2 | 3 | 4 | 5;

const FETCH_MODES_DISPLAY = {
  0: "DE",
  1: "SK",
  2: "AR",
  3: "OS",
  4: "AS",
  5: "SO"
};

const COMPARE_MODES = ["COMPARE_DEFAULT", "COMPARE_WEB_WORKER"] as const;

const comparisonWorker = new Worker(new URL("./comparisonWorker.ts", import.meta.url));

const App: Component = () => {
  const [fetchMode, setFetchMode] = createSignal<FetchMode>(0);
  const [context, setContext] = createSignal<keyof typeof RECORDS_URL>("1K");
  const [isLoading, setIsLoading] = createSignal(false);
  const [mode, setMode] = createSignal<Mode>(0);

  // createEffect(() => {
  //   console.log(isLoading());
  // });

  const {
    getTotalRecords,
    getUsers,
    lastIdOnPage,
    pageNo,
    pages,
    searchTerm,
    setIsServer,
    setLastIdOnPage,
    setPageNo,
    setPaginate,
    setSearchTerm,
    setTotalRecords,
    setUsers,
    userInfo
  } = useUser();

  onCleanup(() => {
    comparisonWorker.terminate();
  });

  const isServerPaginate = createMemo(() => MODES[mode()] === "PAGINATE" && FETCH_MODES[fetchMode()] === "server_optimized");
  
  const setLastId = createMemo(() => {
    const lastIds = lastIdOnPage();
    const page = pageNo();
    const info = userInfo();
    return (users: never[]) => {
      setLastIdOnPage({
        ...lastIds,
        [page]: users.length ? info.getId(users[users.length - 1] as never) : 0
      });
    }
  });

  const getUrl = (count: keyof typeof RECORDS_URL) => {
    const BASE_URL = RECORDS_URL[count];
    const modeToFetch = fetchMode();
    const params = isServerPaginate() ? `?search=${searchTerm().toLowerCase()}&id=${lastIdOnPage()[pageNo() - 1] || ""}` : "";
    return `${BASE_URL}_${FETCH_MODES[modeToFetch]}${params}`;
  };

  const debounceLoading = debounce((val: boolean) => {
    setIsLoading(val);
  }, 300);

  const fetchRecords = async (count: keyof typeof RECORDS_URL) => {
    try {
      debounceLoading(true);
      const response = await fetch(getUrl(count));
      const responseJson: ResponseJson = await response.json();
      batch(() => {
        debounceLoading(false);
        setTotalRecords(isServerPaginate() ? responseJson.total_records : responseJson.users.length); // Update it for server side
        setUsers(responseJson.users as never[] || []);
        setLastId()(responseJson.users as never[] || []);
        setIsServer(isServerPaginate());
      });
      // comparisonWorker.postMessage({ event: "update", users: responseJson.users });
    } catch(e) {
      console.log(e);
      
    }
  };

  const memoizedFetch = createMemo(() => {
    return {
      context: context(),
      fetchMode: fetchMode()
    };
  });

  const memoizedServerFetch = createMemo(() => {
    return {
      context: context(),
      isServerPaginate: isServerPaginate(),
      pageNo: pageNo()
    }
  });

  const debouncedFetchRecords = debounce((count: keyof typeof RECORDS_URL) => {
    fetchRecords(count);
  }, 200);

  createEffect((prevServerFetch) => {
    const serverFetch = memoizedServerFetch();
    if (!serverFetch.isServerPaginate) return;
    if (prevServerFetch === serverFetch) return;
    fetchRecords(serverFetch.context);
    return serverFetch;
  });
  
  createEffect((prevSearch) => {
    const serverFetch = memoizedServerFetch();
    if (!serverFetch.isServerPaginate) return searchTerm();
    if (prevSearch === searchTerm()) return searchTerm();
    debouncedFetchRecords(serverFetch.context);
    return searchTerm();
  })
  
  createEffect((prevFetch) => {
    if (isServerPaginate()) return;
    const fetch = memoizedFetch();
    if (prevFetch === fetch) return;
    fetchRecords(fetch.context as keyof typeof RECORDS_URL);
    return fetch;
  });

  createEffect((prevMode) => {
    const currentMode = mode();
    if (currentMode === prevMode) return;
    setLastIdOnPage({});
    return currentMode;
  });

  const resetPagination = (currentMode: Mode) => {
    setPageNo(1);
    setPaginate(MODES[currentMode] === "PAGINATE");
  }

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
    batch(() => {
      resetPagination(newMode);
      setMode(newMode);
    });
  };
  
  const goToPrevMode = () => {
    const currentMode = mode();
    if (currentMode === 0) {
      return;
    }
    
    const newMode = currentMode - 1 as Mode;
    batch(() => {
      resetPagination(newMode);
      setMode(newMode);
    });
  };

  const getUsersWithSameJob = (user: User) => {
    // const job = util instanceof UserArray ? util.getTitle(user as UserInArray) : util.getTitle(user as UserInObject);
    // comparisonWorker.postMessage({ event: "compare", job: "" });
  };

  const changeContext = (context: keyof typeof RECORDS_URL) => {
    setContext(context);
  };

  const searchUsers: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    batch(() => {
      setSearchTerm(e.currentTarget.value);
      setPageNo(1);
      setLastIdOnPage({});
    });
  }

  const onChangePage = (num: number) => {
    setPageNo(num);
  };

  return (
    <>
      <main>
        <h2>Users</h2>
        <div class="list-toolbar">
          <input autofocus onInput={searchUsers} placeholder="Search users..." value={searchTerm()} />
          <Show when={MODES[mode()] === "PAGINATE"}>
            <Paginate onChange={onChangePage} pageNo={pageNo()} pages={pages()} />
          </Show>
          <Show when={!isLoading()} fallback={<div><b>Loading...</b></div>}>
            <span>Showing <b>{getTotalRecords()}</b> users</span>
          </Show>
        </div>
        <Show when={!isLoading()} fallback={<div />}>
          <Switch>
            <Match when={MODES[mode()] === "DEFAULT"}>
              <Users users={getUsers() as never[]} renderer={(user: never) => <UserCard user={user} onCompare={getUsersWithSameJob} />} />
            </Match>
            <Match when={MODES[mode()] === "VIRTUALIZE"}>
              <VirtualList renderer={(user: never) => {return <UserCard user={user} onCompare={getUsersWithSameJob} />}} />
            </Match>
            <Match when={MODES[mode()] === "PAGINATE"}>
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
          <b class="mode-text">{FETCH_MODES_DISPLAY[fetchMode()]}</b>
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
