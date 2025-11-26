// Axios is a JavaScript library used in frontend apps (like React) to make HTTP API calls to your backend.

// import { useState } from "react";
// import axios from "axios";

// axios.defaults.baseURL = "http://127.0.0.1:8000";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {
//     console.log("Login request started");

//     try {
//       const res = await axios.post("/login", { email, password });
//       console.log("Login response:", res.data);

//       if (res.data.success) {
//         setMessage(res.data.message);
//       } else {
//         setMessage("Invalid credentials");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setMessage("Something went wrong");
//     }
//   };

//   return (
//     <div style={{ width: 300, margin: "100px auto", textAlign: "center" }}>
//       <h2>Login</h2>
      
//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         style={{ width: "100%", padding: 10, marginTop: 10 }}
//       />

//       <input
//         placeholder="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         style={{ width: "100%", padding: 10, marginTop: 10 }}
//       />

//       <button 
//         onClick={handleLogin}
//         style={{ width: "100%", padding: 10, marginTop: 20 }}
//       >
//         Login
//       </button>

//       <p style={{ marginTop: 20 }}>{message}</p>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Login request started");

      const res = await axios.post("/login", { email, password });
      console.log("Login response:", res.data);

      if (res.data.success) {
        setMessage(res.data.message);
        
        // Store user role in localStorage for authentication
        localStorage.setItem('userRole', res.data.role);

        if (res.data.role === "citizen") {
          navigate("/citizen");
        } else if (res.data.role === "hospital") {
          navigate("/hospital");
        }
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ width: 300, margin: "100px auto", textAlign: "center" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button 
        onClick={handleLogin}
        style={{ width: "100%", padding: 10, marginTop: 20 }}
      >
        Login
      </button>

      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}
