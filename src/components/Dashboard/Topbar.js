import React from "react";
import styles from "./dashboardlayout.module.css";

const Topbar = ({ onMenuClick  }) => {
  return (
    <header className={styles.topbar}>
      <h3>Blood Donation</h3>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        ☰
      </button>
    </header>
  );
};

export default Topbar;
