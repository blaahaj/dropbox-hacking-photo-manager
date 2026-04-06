import {
  isAudioTrack,
  isGeneralTrack,
  isVideoTrack,
  type MediainfoFromHash,
  type VideoTrack,
} from "@blaahaj/dropbox-hacking-mediainfo-db/types";
import logRender from "@lib/logRender";

import styles from "./SummariseMediaInfo.module.css";
import SummaryTable from "./SummaryTable";

const resolutionName = (videoTrack: VideoTrack) => {
  if (Number(videoTrack.Width) === 1920 && Number(videoTrack.Height) === 1080)
    return "HD";
  if (Number(videoTrack.Width) === 3840 && Number(videoTrack.Height) === 2160)
    return "4K";
  return;
};

// Quicktime "mebx": https://developer.apple.com/documentation/quicktime-file-format/timed_metadata_sample_descriptions

const SummariseMediaInfo = ({
  mediaInfo,
}: {
  mediaInfo: MediainfoFromHash;
}) => {
  const tracks = mediaInfo.mediainfoData.media?.track ?? [];
  const generalTrack = tracks.find(isGeneralTrack);
  const videoTrack = tracks.find(isVideoTrack);
  const audioTrack = tracks.find(isAudioTrack);

  return (
    <SummaryTable
      table={{
        sections: [
          {
            name: "General",
            rows: [
              { key: "Format", value: generalTrack?.Format ?? "-" },
              { key: "Duration", value: generalTrack?.Duration ?? "-" },
              { key: "File size", value: generalTrack?.FileSize ?? "-" },
            ],
          },
          {
            name: "Video",
            rows: [
              { key: "Format", value: videoTrack?.Format ?? "-" },
              {
                key: "Resolution",
                value:
                  videoTrack?.Width && videoTrack?.Height ? (
                    <>
                      {videoTrack.Width}
                      {" x "}
                      {videoTrack.Height}
                      {resolutionName(videoTrack) && (
                        <span className={styles.resolutionName}>
                          {resolutionName(videoTrack)}
                        </span>
                      )}
                    </>
                  ) : (
                    "-"
                  ),
              },
              {
                key: "Aspect ratio",
                value: videoTrack?.DisplayAspectRatio_String ?? "-",
              },
              {
                key: "fps",
                value: videoTrack?.FrameRate
                  ? Math.round(Number(videoTrack.FrameRate))
                  : "-",
              },
            ],
          },
          {
            name: "Audio",
            rows: [
              { key: "Format", value: audioTrack?.Format ?? "-" },
              { key: "Sampling rate", value: audioTrack?.SamplingRate ?? "-" },
              { key: "Channels", value: audioTrack?.Channels ?? "-" },
              { key: "Bitrate", value: audioTrack?.BitRate ?? "-" },
            ],
          },
        ],
      }}
    />
  );
};

export default logRender(SummariseMediaInfo);
