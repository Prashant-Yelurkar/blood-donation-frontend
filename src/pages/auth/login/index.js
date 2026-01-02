// pages/login.jsx
import { useState } from "react";
import styles from "./login.module.css";
import { handelLogin } from "@/Actions/Controllers/loginController";
import { toast, Toaster } from "sonner";
import { setAuthToken } from "@/Actions/Controllers/TokenController";
import { redirectToHome } from "@/Actions/Controllers/redirectController";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setVerified } from "@/redux/slices/authSlice";
import { setUserProfile } from "@/redux/slices/userSlice";
import LoaderWrapper from "@/components/Loaders/LoderWrapper";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await handelLogin(form);
      setStatus(res.status);
      if (res.success) {
        setAuthToken(res.data.jwt);        
        toast.success(res.data.message || `✅ Login successful`);
        dispatch(setVerified(res.success));
        dispatch(setUserProfile(res.data.user));
        redirectToHome(router);
      } else {
        toast.error(res.data.message || "❌ Login failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "server error");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <LoaderWrapper loading={loading} >
      <div className={styles.container}>
        <Toaster />
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Please login to your account</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifier"
              placeholder="Email / Contact"
              value={form.identifier}
              onChange={handleChange}
              className={styles.input}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <div className={styles.options}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>

              <a href="#" className={styles.forgot}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    </LoaderWrapper>
  );
}
