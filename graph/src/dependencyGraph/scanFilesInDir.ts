import { lstat, readdir } from "node:fs/promises";
import { join } from "node:path";

const processFile = async (dir: string, name: string) => {
  return { _: "file", dir, name };
};

export const scanFilesInDir = async (
  dir: string,
): Promise<readonly Awaited<ReturnType<typeof processFile>>[]> => {
  const names = await readdir(dir);

  return (
    await Promise.all(
      names.map(async (name) => {
        const stats = await lstat(join(dir, name));

        if (stats.isFile()) {
          return await processFile(dir, name);
        } else if (stats.isDirectory()) {
          return await scanFilesInDir(join(dir, name));
        }
      }),
    )
  )
    .filter((t) => t !== undefined)
    .flat();
};
