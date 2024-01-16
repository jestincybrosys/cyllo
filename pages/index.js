// pages/index.js

import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.cyllo_home}>
      <nav
        className={styles.hone_nave}
        style={{ display: "flex", justifyContent: "end" }}
      >
        <Link href="/blog">Blog</Link>
        <Link href="/web-stories">Web Stories</Link>
      </nav>
      <div className={styles.maindiv}>
        <header>
          <h1>Welcome to My Website</h1>
        </header>
      </div>
      <section></section>
    </div>
  );
}
