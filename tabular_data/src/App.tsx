import "./App.scss";

import { Component, createEffect, createSignal, For } from "solid-js";

type User = {
  email: string,
  id: number,
  first_name: string,
  last_name: string,
  phone: string,
  sex: string
};

type ResponseJson = {
  users: User[]
}

const RECORDS_URL = {
  "1K": "http://localhost:1324/get_1k_records",
  "10K": "http://localhost:1324/get_10k_records",
  "2M": "http://localhost:1324/get_2m_records"
};

const App: Component = () => {
  const [records, setRecords] = createSignal<User[]>([]);
  const [context, setContext] = createSignal<keyof typeof RECORDS_URL>("1K");

  const fetchRecords = async (count: keyof typeof RECORDS_URL) => {
    try {
      const response = await fetch(RECORDS_URL[count]);
      const responseJson = await response.json() as ResponseJson;
      
      setRecords(responseJson.users);
    } catch(e) {}
  };

  createEffect(() => {
    fetchRecords(context());
  });

  const changeContext = (context: keyof typeof RECORDS_URL) => {
    setContext(context);
  };

  return (
    <>
      <main>
        <div class="btn-group">
          <button classList={{ "btn": true, "btn-selected": context() === "1K" }} onClick={[changeContext, "1K"]}>1K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "10K" }} onClick={[changeContext, "10K"]}>10K records</button>
          <button classList={{ "btn": true, "btn-selected": context() === "2M" }} onClick={[changeContext, "2M"]}>2M records</button>
        </div>
        <div class="users-container">
          <For each={records()}>
            {item => (
              <div class="user-card">
                <div class="user-icon"></div>
                {/* email and first name are swapped in DB */}
                <div>{item.email} {item.last_name}</div>
              </div>
            )}
          </For>
        </div>
      </main>
    </>
  );
};

export default App;
