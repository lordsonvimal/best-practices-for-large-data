import "./App.scss";

import { Component, JSX, createSignal } from "solid-js";

const UPLOAD_PATH = "http://localhost:1323/upload";

const App: Component = () => {
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);

  const uploadFile = async () => {
    const formData = new FormData();

    const file = selectedFile();

    if (!file) return;

    // Update the formData object
    formData.append(
        "file",
        file,
        file.name
    );

    const response = await fetch(UPLOAD_PATH, {
      method: "POST",
      body: formData
    })
    const result = await response.json();
    console.log(result);
  };

  const onFileChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const target = event.currentTarget as HTMLInputElement;
    const files = target.files as FileList;
    setSelectedFile(files[0] || null);
  }

  return (
    <>
      <main>
        <div class="uploader">
          <input type="file" name="file" onChange={onFileChange} />
          <input class="btn-submit" onClick={() => uploadFile()} type="submit" value="Submit" />
        </div>
      </main>
    </>
  );
};

export default App;
