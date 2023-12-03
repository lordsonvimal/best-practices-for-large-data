import { For, JSX } from "solid-js";

type Props = {
  users: never[],
  renderer: (user: never) => JSX.Element
};

export function Users(props: Props) {
  return (
    <div class="users-container">
      <For each={props.users}>
        {(user) => {
          return props.renderer(user);
        }}
      </For>
    </div>
  );
}
