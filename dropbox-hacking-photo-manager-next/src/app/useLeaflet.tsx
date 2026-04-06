import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type L = typeof import("leaflet");

export const context = createContext<L | undefined>(undefined);
// export const context = createContext<unknown>(null);

export const DefaultLeafletProvider = ({ children }: PropsWithChildren) => {
  const [leaflet, setLeaflet] = useState<L | undefined>(undefined);
  // const [loaded, setLoaded] = useState<unknown>();
  // const scriptRef = useRef<HTMLScriptElement>(null);

  const loadListener = (e: Event) => {
    console.dir({ loadListener: e });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setLeaflet((window as any).leaflet);
  };
  const errorListener = (e: ErrorEvent) => {
    setLeaflet(undefined);
    console.dir({ errorListener: e });
  };

  // const [script, setScript] = useState<HTMLScriptElement | null>(null);

  useEffect(() => {
    // if (scriptRef.current) {
    //   const script = scriptRef.current;
    //   script.addEventListener("load", loadListener);
    //   script.addEventListener("error", errorListener);

    //   return () => {
    //     script.removeEventListener("load", loadListener);
    //     script.removeEventListener("error", errorListener);
    //   };
    // }

    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    );
    script.setAttribute(
      "integrity",
      "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
    );
    script.setAttribute("crossorigin", "");
    script.setAttribute("async", "async");

    script.addEventListener("load", loadListener);
    script.addEventListener("error", errorListener);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  console.dir({ leaflet });

  return (
    <>
      {/* <script
        ref={scriptRef}
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        async
        onLoad={(loadEvent) => {
          console.dir({
            loadEvent,
          });
        }}
        onError={(errorEvent) => {
          console.dir({
            errorEvent,
          });
        }}
      ></script> */}
      <context.Provider value={leaflet}>{children}</context.Provider>
    </>
  );
};

export const useLeaflet = () => useContext(context);
