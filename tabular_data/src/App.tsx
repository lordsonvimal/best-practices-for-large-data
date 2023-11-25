import "./App.scss";

import { Component, createEffect, createSignal } from "solid-js";

const RECORDS_URL = {
  "1K": "http://localhost:1324/get_1k_records",
  "10K": "http://localhost:1324/get_10k_records",
  "2M": "http://localhost:1324/get_2m_records"
};

const App: Component = () => {
  const [records, setRecords] = createSignal([]);
  const [context, setContext] = createSignal<keyof typeof RECORDS_URL>("1K");

  const fetchRecords = async (count: keyof typeof RECORDS_URL) => {
    const response = await fetch(RECORDS_URL[count]);
    setRecords(await response.json());
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
        <div></div>
      </main>
    </>
  );
};

export default App;
