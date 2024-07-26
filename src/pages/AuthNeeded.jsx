import { useNavigate } from "react-router-dom"; // Make sure you're using react-router-dom for navigation

function AuthNeeded() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Registration Required
        </h1>
        <p className="text-gray-600 mb-6">
          You must be registered to see this page. Please sign up to gain
          access.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register Now
        </button>
      </div>
    </div>
  );
}

export default AuthNeeded;

