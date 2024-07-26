/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithFirebase } from "../../app/firebase/login";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    setLoading(true);
    try {
      const response = await loginWithFirebase(data.email, data.password);
      if (response instanceof Error) {
        toast(response.message);
        return;
      } else {
        toast.success("Login Successful");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sm:h-screen w-screen"
      style={{
        background: `radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)`,
      }}
    >
      <div className="w-full h-full sm:h-full flex justify-center items-center backdrop-blur-lg">
        <div
          className="flex flex-col items-center sm:justify-center w-full bg-white h-full sm:h-fit sm:rounded-lg p-3"
          style={{
            width: "min(100%,650px)",
          }}
        >
          <h1
            className="font-semibold"
            style={{ fontSize: "clamp(1rem,10vw,2rem)" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-gray-700"
            style={{ fontSize: "clamp(0.5rem,10vw,1.5rem)" }}
          >
            Nice to see you again
          </p>
          <form
          aria-disabled={loading}
            onSubmit={loginUser}
            className="w-full flex flex-col gap-3 px-7"
          >
            <label className="flex flex-col" htmlFor="email">
              <span>Email</span>
              <input
                className="outline-none border-none rounded-md p-2 bg-gray-200"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required
              />
            </label>
            <label className="flex flex-col" htmlFor="password">
              <span>Password</span>
              <input
                className="outline-none border-none rounded-md p-2 bg-gray-200"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
              />
            </label>
            <div className="controls flex justify-between">
              <label htmlFor="remember-me" className="flex gap-2">
                <input type="checkbox" name="rememberMe" id="remember-me" />
                <span>Remember Me</span>
              </label>
              <button type="button" className="text-right text-blue-600">
                Forget Password?
              </button>
            </div>
            <label htmlFor="submit">
              <input type="submit" id="submit" className="sr-only" />
              <button className="bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:shadow-md transition-all rounded-md p-2 w-full">
                {loading ? <ClipLoader size={20} /> : "Login"}
              </button>
            </label>
          </form>

          <div className="goto-register flex py-3 gap-2">
            <p>Don't have an account?</p>
            <button
              onClick={() => {
                navigate("/register", { replace: true }); // Use navigate to programmatically navigate
              }}
              className="text-blue-700 font-semibold hover:text-blue-900"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

