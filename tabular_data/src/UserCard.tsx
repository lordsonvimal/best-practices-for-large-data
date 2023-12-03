import { Show } from "solid-js";
import { User, useUser } from "./UserContext";

type Props = {
  user: never,
  onCompare: (user: User) => void
};

export function UserCard(props: Props) {
  const { userInfo } = useUser();
  return (
    <Show when={props.user}>
      <div class="user-card" onClick={[props.onCompare, props.user]}>
        <div class="user-info">
          <div class="user-name"><b>{userInfo().getUserName(props.user)}</b></div>
          <div class="user-email">{userInfo().getEmail(props.user)}</div>
        </div>
        <div class="user-job">
          {userInfo().getTitle(props.user)}
        </div>
      </div>
    </Show>
  );
}
