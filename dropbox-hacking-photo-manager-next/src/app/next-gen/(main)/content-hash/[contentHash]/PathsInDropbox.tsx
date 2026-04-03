import type { NamedFile } from "dropbox-hacking-photo-manager-shared";

const PathsInDropbox = ({
  contentHash,
  namedFiles,
}: {
  contentHash: string;
  namedFiles: readonly NamedFile[];
}) => {
  return (
    <ol>
      {namedFiles.map((f) => {
        const lastSlash = f.path_display.lastIndexOf("/");
        const dirname = f.path_display.substring(0, lastSlash);
        const basename = f.path_display.substring(lastSlash + 1);
        return (
          <li key={f.path_lower}>
            <div>
              <a href={`https://www.dropbox.com/home${encodeURI(dirname)}`}>
                {dirname.replaceAll(contentHash, "HASH")}
              </a>{" "}
              &middot;{" "}
              <a
                href={`https://www.dropbox.com/preview${encodeURI(f.path_display)}?context=browse&role=personal`}
              >
                {basename.replaceAll(contentHash, "HASH")}
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default PathsInDropbox;
