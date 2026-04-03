import styles from "./page.module.css";

import { Cormorant_Garamond } from "next/font/google";

const typeface = Cormorant_Garamond({
  variable: "--font-teefs",
  subsets: ["latin"],
  weight: "300",
});

export default function Home() {
  return (
    <main className={styles.main}
      style={{
        background: "url(/pexels-freestockpro-12932247.jpg)",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <div className={`${styles.letters} ${typeface.className}`}>
        <div>t</div>
        <div>e</div>
        <div>e</div>
        <div>f</div>
        <div>s</div>
      </div>
    </main>
  );
}
