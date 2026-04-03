import { RouteState, urlForState } from "dropbox-hacking-photo-manager-shared";
import Link from "next/link";
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
    <Link href={href} {...props}>
      {props.children}
    </Link>
  );
};

export default samePageLink;
