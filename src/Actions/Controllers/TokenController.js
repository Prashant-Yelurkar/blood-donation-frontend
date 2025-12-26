import { useRouter } from "next/router";
import { redirectToLogin } from "./redirectController";

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    if (checkTokens()) {
      return `${localStorage.getItem("_at")}.${localStorage.getItem(
        "_bt"
      )}.${localStorage.getItem("_ct")}`;
    }
  }
};

export const checkTokens = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("_at") != null &&
      localStorage.getItem("_bt") != null &&
      localStorage.getItem("_ct") != null
      ? true
      : false;
  }
};

export const setAuthToken = (token) => {  
  if (typeof window !== "undefined") {
    if (token) {
      const [at, bt, ct] = token.split(".");
      localStorage.setItem("_at", at);
      localStorage.setItem("_bt", bt);
      localStorage.setItem("_ct", ct);
      return true;
    }
  }
};

export const removeToken = (router) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("_at");
    localStorage.removeItem("_bt");
    localStorage.removeItem("_ct");
  }
  redirectToLogin(router)
};