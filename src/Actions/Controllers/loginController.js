import { toast } from "sonner";
import { myrouter } from "../AxiosInitializer";
import { setAuthToken } from "./TokenController";
import { redirectToHome } from "../Controllers/redirectController";

const handelLogin = async(data) => myrouter.post('/auth/login', data)

// const handleGoogleLogin = async (token , router) => {
//   try {
    
//     const res = await myrouter.post('/auth/login/google', {
//       token: token,
//     });
    
//     if(res.status === 200) {
//       const data = res.data;
//       setAuthToken(data.jwt)
//       toast.success(data.message|| `✅ Login successful `);
//       redirectToHome(router)
//     }
//     else{
//       toast.error(res.data.message||'❌ Login failed. Please try again.');
//     }
  
//   } catch (err) {
//     console.error('❌ Login failed:', err);
//     throw err;
//   }
// };
export {   handelLogin };
