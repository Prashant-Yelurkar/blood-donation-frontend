import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./dashboardlayout.module.css";
import { removeToken } from "@/Actions/Controllers/TokenController";



const Sidebar = ({ isMobile = false, onClose, menuItems = [] }) => {
  const router = useRouter();

  return (
    <aside className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ""}`}>
      <h2 className={styles.logo}>Blood Donation</h2>

      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.menuItem} ${item.activeLink?.includes(router.pathname) ? styles.active : ""
              }`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <Link
          key={"logout"}
          href={'#'}
          className={`${styles.menuItem}`}
          onClick={() => removeToken(router)}
        >
          LOGOUT
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
