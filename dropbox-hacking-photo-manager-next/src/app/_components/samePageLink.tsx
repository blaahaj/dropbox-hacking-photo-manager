import { RouteState, urlForState } from "dropbox-hacking-photo-manager-shared";
import * as React from "react";

const samePageLink = ({
  routeState,
  ...props
}: {
  routeState: RouteState;
} & Omit<
  React.JSX.IntrinsicElements["a"],
  "href"
>): React.ReactElement | null => {
  const href = urlForState(routeState);

  return (
    <a href={href} {...props}>
      {props.children}
    </a>
  );
};

export default samePageLink;
