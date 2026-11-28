import kloakdækslerData from "./kloakdækslerData.json" with { type: "json" };
import kloakdækslerMap from "./map.json" with { type: "json" };

export const contentHashes = () =>
  Object.keys(kloakdækslerMap.dbx2kl).toSorted();

export type ShapeData = {
  centerXRatio?: number;
  centerYRatio?: number;
  radiusRatio?: number;
  rotateDegrees?: number;
  text?: string;
  tags?: string[];
};

// type More = Exclude<ReturnType<typeof lookup>["geometry"], CircleData>

export const lookup = (contentHash: string) => {
  const imageHash = (kloakdækslerMap.dbx2kl as Record<string, string>)[
    contentHash
  ];

  const shapeData: ShapeData | undefined =
    kloakdækslerData[imageHash as keyof typeof kloakdækslerData];
  if (shapeData === undefined) return undefined;

  return {
    imageHash,
    shapeData,
  };
};
