import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import Link from "next/link";

const contentList = ({
  items,
}: {
  items: readonly ContentHashCollection[];
}) => {
  return (
    <div>
      <h2>Collection of {items.length} items</h2>
      <ol style={{ marginInlineStart: "2em" }}>
        {items.map((item) => (
          <li key={item.contentHash}>
            <Link href={`/next-gen/content-hash/${item.contentHash}`}>
              <div>
                <div>pic!</div>
                <div>{item.contentHash}</div>
                <div>{item.timestamp}</div>
                <div>{item.date}</div>
                <div>{item.photo?.description}</div>
                <div>{item.photo?.tags}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`http://localhost:4000/image/rev/${item.namedFiles[0].rev}/w128h128/bestfit/jpeg`}
                  alt=""
                  loading="lazy"
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default contentList;
