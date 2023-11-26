import "./App.scss";

import { Component, JSX, createEffect, createSignal, Show, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { VirtualList } from "./VirtualList";
import { Users } from "./Users";
import { UserCard } from "./UserCard";

export type User = {
  email: string,
  job_title: string,
  first_name: string,
  last_name: string
};

type ResponseJson = {
  users: User[]
}

const RECORDS_URL = {
  "1K": "http://localhost:1324/get_1k_records",
  "10K": "http://localhost:1324/get_10k_records",
  "100K": "http://localhost:1324/get_100k_records",
  "2M": "http://localhost:1324/get_2m_records"
};

const comparisonWorker = new Worker(new URL("./comparisonWorker.ts", import.meta.url));

const App: Component = () => {
  const [records, setRecords] = createSignal<User[]>([]);
  const [context, setContext] = createSignal<keyof typeof RECORDS_URL>("1K");
  const [searhTerm, setSearchTerm] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  onCleanup(() => {
    comparisonWorker.terminate();
  });

  const fetchRecords = async (count: keyof typeof RECORDS_URL) => {
    try {
      setIsLoading(true);
      const response = await fetch(RECORDS_URL[count]);
      const responseJson = await response.json() as ResponseJson;
      setRecords(responseJson.users);
      comparisonWorker.postMessage({ event: "update", users: responseJson.users });
      setIsLoading(false);
    } catch(e) {}
  };

  createEffect(() => {
    fetchRecords(context());
  });

  comparisonWorker.onmessage = (e) => {
    console.log(e.data.users);
  };

  const getUsersWithSameJob = (user: User) => {
    comparisonWorker.postMessage({ event: "compare", job: user.job_title });
  };

  const changeContext = (context: keyof typeof RECORDS_URL) => {
    setContext(context);
  };

  const searchUsers: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setSearchTerm(e.currentTarget.value);
  }

  const filteredUsers = () => {
    return records().filter(record => `${record.email} ${record.last_name}`.toLowerCase().startsWith(searhTerm().toLowerCase()));
  };

  return (
    <>
      <main>
        <div class="list-toolbar">
          <input autofocus onInput={searchUsers} placeholder="Search users..." value={searhTerm()} />
          <Show when={!isLoading()} fallback={<div><b>Loading...</b></div>}>
            <span>Showing <b>{filteredUsers().length}</b> users</span>
          </Show>
        </div>
        <Show when={!isLoading()} fallback={<div />}>
          {/* <Users records={filteredUsers()} renderer={(user: User) => <UserCard user={user} onCompare={getUsersWithSameJob} />} /> */}
          <VirtualList records={filteredUsers()} renderer={(user: User) => <UserCard user={user} onCompare={getUsersWithSameJob} />} />
        </Show>
        <div class="btn-group">
          <button classList={{ "btn": true, "btn-selected": context() === "1K" }} onClick={[changeContext, "1K"]}>1K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "10K" }} onClick={[changeContext, "10K"]}>10K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "100K" }} onClick={[changeContext, "100K"]}>100K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "2M" }} onClick={[changeContext, "2M"]}>2M records</button>
        </div>
      </main>
    </>
  );
};

export default App;
