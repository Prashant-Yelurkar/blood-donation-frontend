import React, { useEffect } from "react";
import Head from "next/head";
import { toast, Toaster } from "sonner";
import styles from "./mainLayout.module.css";
import {
  checkTokens,
  getAuthToken,
  removeToken,
} from "@/Actions/Controllers/TokenController";
import { useRouter } from "next/router";
import LoaderWrapper from "../Loaders/LoderWrapper";
import { redirectToLogin } from "@/Actions/Controllers/redirectController";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Loaders/Spinner";
import { verifyToken } from "@/Actions/Controllers/verifyController";
import { setVerified } from "@/redux/slices/authSlice";
import DashboardLayout from "./DashboardLayout";

const MainLayout = ({
  children,
  title = "Dashboard",
  loading = false,
  status = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!router.isReady) return;

    if (!checkTokens()) {
      redirectToLogin(router);
      return;
    }

    const verifyJWT = async () => {
      try {
        const res = await verifyToken(getAuthToken());
        if (res?.success) {
          dispatch(setVerified(true));
        } else {
            toast.error(res?.message || "❌ Session expired. Please log in again.");
          removeToken(router)
        }
      } catch (err) {
        redirectToLogin(router);
      }
    };

    if (!isVerified) {
      verifyJWT();
    }
  }, [router.isReady]);


  if (!isVerified) {
    return (
      <main className={styles.loder}>
        <Spinner size={45} />
        <br />
        <div className={styles.verticalLine}>
          Please wait while we verify your account.
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{`Blood Camp | ${title}`}</title>
      </Head>

      <main className={styles.main}>
        <LoaderWrapper loading={loading} router={router} status={status}>
          <DashboardLayout title={title}>
          {children}
          <Toaster />
          </DashboardLayout>
        </LoaderWrapper>
      </main>
    </>
  );
};

export default MainLayout;
