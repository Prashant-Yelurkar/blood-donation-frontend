import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../Dashboard/Sidebar";
import Topbar from "../Dashboard/Topbar";
import styles from "../Dashboard/dashboardlayout.module.css";
import { getMenuItems } from "@/utils/MenuItem";


const DashboardLayout = ({ children , title, role }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <Sidebar menuItems={getMenuItems(role)} title={title} />

      {/* Mobile Topbar */}
      <Topbar  onMenuClick={() => setMenuOpen(true)} />

      {/* Mobile Slide Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        <Sidebar isMobile onClose={() => setMenuOpen(false)} menuItems={getMenuItems(role)} title={title} />
      </div>

      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
