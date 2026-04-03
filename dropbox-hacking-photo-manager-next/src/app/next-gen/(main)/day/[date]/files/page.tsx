"use client";
import logRender from "@lib/logRender";
import ClientSide from "./clientSide";
import Navigation from "@components/navigation";
import React, { type Usable } from "react";
import type { Params } from "next/dist/server/request/params";

const Page = ({ params: pathParams }: { params: Usable<Params> }) => {
  const { date } = React.use(pathParams);

  return (
    <div>
      <Navigation />
      <ClientSide date={date as string} />
    </div>
  );
};

export default logRender(Page, false);
