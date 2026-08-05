import { parseLatLong } from "@blaahaj/geometry/parse";
import * as j from "@blaahaj/json";
import { type GPSLatNLongE } from "dropbox-hacking-photo-manager-shared";
import * as GeoJSON from "geojson";

const isGeoJSONPoint = (t: unknown): t is GeoJSON.Feature<GeoJSON.Point> =>
  typeof t === "object" &&
  t !== null &&
  "type" in t &&
  t.type === "Feature" &&
  "geometry" in t &&
  typeof t.geometry === "object" &&
  t.geometry !== null &&
  "type" in t.geometry &&
  t.geometry.type === "Point";

export const parseLatLong2 = (t: string): GPSLatNLongE | undefined => {
  t = t.trim();
  if (t === "" || t === "none") return undefined;

  const latLong = parseLatLong(t);
  if (latLong) return latLong;

  try {
    const data = j.protoSafeParse(t);
    if (isGeoJSONPoint(data))
      return {
        lat: data.geometry.coordinates[1],
        long: data.geometry.coordinates[0],
      };
  } catch {
    //
  }

  // https://www.google.com/maps/@48.0456984,16.2767616,3a,75y,338.45h,115.63t/data=!3m7!1e1!3m5!1sl56WBTP0NO7Kh_LNoGXf9w!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-25.625717715230806%26panoid%3Dl56WBTP0NO7Kh_LNoGXf9w%26yaw%3D338.44996179759255!7i16384!8i8192?hl=en&entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D
  const m0 = t.match(
    /^https:\/\/www\.google\.com\/maps\/@(?<N>.*?),(?<E>.*?),/,
  );
  if (m0?.groups) {
    return { lat: Number(m0.groups.N), long: Number(m0.groups.E) };
  }

  // https://www.openstreetmap.org/#map=12/55.6740/12.5666
  const m1 = t.match(
    /^https:\/\/www\.openstreetmap\.org\/#map=[0-9]+\/(?<N>.*?)\/(?<E>.*?)$/,
  );
  if (m1?.groups) {
    return { lat: Number(m1.groups.N), long: Number(m1.groups.E) };
  }

  return undefined;
};
