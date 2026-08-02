import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {

        // Save JWT Token
        localStorage.setItem("token", data.token);

        // Save Username
        localStorage.setItem("username", data.name);

        alert(data.message);

        navigate("/dashboard");

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Cannot connect to FastAPI Server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-96">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          AI Resume Analyzer
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        <form onSubmit={loginUser}>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border rounded-lg p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-5">

          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold"
            >
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;