import { useNavigate } from "react-router-dom";
import { registerNewUser } from "../../app/firebase/createUserWithEmailAndPassword";
import { useState } from "react";
import { toast } from "react-toastify";
function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setLoading(true);
    try {
      const result = await registerNewUser(data.email, data.password,data);
      if (result instanceof Error) {
        // Handle error here
        toast(result.message);
        console.log(result.message);
        console.error("Registration error:" + result.message);
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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
      <div className="w-full h-full sm:h-full  flex justify-center  items-center  backdrop-blur-lg">
        <div
          className="flex flex-col  items-center sm:justify-center w-full bg-white h-full sm:h-fit  sm:rounded-lg p-3 "
          style={{
            width: "min(100%,650px)",
          }}
        >
          <h1
            className=" font-semibold"
            style={{ fontSize: "clamp(1rem,10vw,2rem)" }}
          >
            Create New Account
          </h1>
          <p
            className="text-gray-700"
            style={{ fontSize: "clamp(0.5rem,10vw,1.5rem)" }}
          >
            Your Journey Starts Here
          </p>
          <form onSubmit={login} className="w-full flex flex-col gap-3 px-7">
            <label className="flex flex-col" htmlFor="name">
              <span>Name</span>
              <input
                className="outline-none border-none rounded-md p-2 bg-gray-200"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                required
              />
            </label>
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
            <label className="flex flex-col" htmlFor="mobile">
              <span>Mobile No</span>
              <input
                className="outline-none border-none rounded-md p-2 bg-gray-200"
                type="tel"
                name="mobile"
                id="mobile"
                placeholder="Mobile"
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
            <input
              type="submit"
              disabled={loading}
              value={loading ? "Loading" : "Create Account"}
              className="bg-blue-500 text-white rounded-md p-2"
            />
          </form>

          <div className="goto-register flex py-3 gap-2">
            <p>Already a member?</p>
            <button
              onClick={() => {
                navigate("/login", { replace: true });
              }}
              className="text-blue-700 font-semibold hover:text-blue-900"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

