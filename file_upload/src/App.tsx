import "./App.scss";

import { Component } from "solid-js";

const App: Component = () => {
  return (
    <>
      <main>
        <form class="uploader" action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" />
          <input class="btn-submit" type="submit" value="Submit" />
        </form>
      </main>
    </>
  );
};

export default App;
