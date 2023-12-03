import { createVirtualizer } from "@tanstack/solid-virtual";
import { JSX, createEffect, createSignal } from "solid-js";

type Props = {
  users: never[],
  renderer: (user: never) => JSX.Element
};

function getVirtualizer(ref: HTMLDivElement | undefined, count: number) {
  return createVirtualizer({
    count: count,
    getScrollElement: () => ref || null,
    estimateSize: () => 80 + 8,
    overscan: 5,
    paddingStart: 8,
    paddingEnd: 8
  });
}

export function VirtualList(props: Props) {
  let parentRef!: HTMLDivElement;

  const [virtualizer, setVirtualizer] = createSignal(getVirtualizer(parentRef, props.users.length));
  
  createEffect((prevRecords) => {
    if (prevRecords === props.users) {
      return prevRecords;
    }

    setVirtualizer(getVirtualizer(parentRef, props.users.length));
    return props.users;
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
              {props.renderer(props.users[virtualRow.index])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
