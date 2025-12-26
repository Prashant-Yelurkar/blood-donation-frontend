import React from 'react';
import Head from 'next/head';
import { Toaster } from "sonner";
import styles from './mainLayout.module.css'; 
const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>NodeTalk | {title}</title>
      </Head>
      <main className={styles.main}>
        {children}
        <Toaster />
      </main>
    </>
  );
};

export default Layout;
