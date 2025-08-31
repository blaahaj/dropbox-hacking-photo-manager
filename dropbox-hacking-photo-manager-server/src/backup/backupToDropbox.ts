import { protoSafeParse } from "@blaahaj/json";
import { Axios } from "axios";
import type { Dropbox } from "dropbox";

import type { BackupConfig } from "./index.js";
import { readableTarGz } from "./readableTar.js";

export const backupToDropbox = async (
  backupConfig: BackupConfig,
  dbx: Dropbox,
  remotePath: string,
) => {
  const url = (
    await dbx.filesGetTemporaryUploadLink({
      commit_info: {
        path: remotePath,
        mode: { ".tag": "overwrite" },
      },
    })
  ).result.link;

  const resp = await new Axios().post(url, readableTarGz(backupConfig), {
    validateStatus: () => true,
    headers: {
      "User-Agent": "dropbox-photo-manager-server",
      "Content-Type": "application/octet-stream",
    },

    responseType: "json",
  });

  const data = protoSafeParse(resp.data.toString("utf-8")) as {
    readonly ["content-hash"]: string;
  };

  const hash = data["content-hash"];

  console.log(`Remote backup content hash: ${hash}`);
};
