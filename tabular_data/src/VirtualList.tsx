import { createVirtualizer } from "@tanstack/solid-virtual";
import { JSX, createMemo } from "solid-js";
import { useUser } from "./UserContext";

type Props = {
  renderer: (user: never) => JSX.Element
};

export function VirtualList(props: Props) {
  let parentRef!: HTMLDivElement;

  const { getUsers } = useUser();

  // const memoizedUsers = createMemo(() => {
  //   return getUsers();
  // });

  const virtualizer = createMemo(() => {
    return createVirtualizer({
      count: getUsers().length,
      getScrollElement: () => parentRef || null,
      estimateSize: () => 80 + 8,
      overscan: 5,
      paddingStart: 8,
      paddingEnd: 8
    });
  });

  return (
    <div ref={parentRef} style={{ overflow: "auto" }}>
      <div
        style={{
          height: `${virtualizer().getTotalSize()}px`,
          width: "100%",
          overflow: "unset",
          position: "relative"
        }}
      >
        {virtualizer().getVirtualItems().map((virtualRow) => {
          return(
            <div
              style={{
                padding: "4px",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              {props.renderer(getUsers()[virtualRow.index] as never)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
