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
import { setUserProfile } from "@/redux/slices/userSlice";
import { getMenuItems } from "@/utils/MenuItem";
import { registerSocketUser, socket } from "@/socket/socket";

const MainLayout = ({
  children,
  title = "Dashboard",
  loading = false,
  status = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isVerified } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const verifyJWT = async () => {
    try {
      const res = await verifyToken(getAuthToken());
      if (res?.success) {
        dispatch(setVerified(true));
        dispatch(setUserProfile(res.data.user))
      } else {
        toast.error(res.data?.message || "❌ Session expired. Please log in again.");
        removeToken(router)
      }
    } catch (err) {
      redirectToLogin(router);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!checkTokens()) {
      redirectToLogin(router);
      return;
    }
    if (!isVerified) {
      verifyJWT();
      return;
    }
    if (!user?.role) return;
    const path = router.pathname;
    const menu = getMenuItems(user.role);
    const isAllowed = menu.some((item) =>
      item.activeLink.includes(path)
    );

    if (!isAllowed) {
      toast.error("⛔ Unauthorized access");
      router.replace("/dashboard");
    }
  }, [router.isReady, isVerified, router.pathname]);








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
          <DashboardLayout title={title} role={user.role}>
            {children}
            <Toaster />
          </DashboardLayout>
        </LoaderWrapper>
      </main>
    </>
  );
};

export default MainLayout;
