import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../redux/features/authSlice";
import type { AppDispatch } from "../redux/store.ts";
import styles from "./login.module.css";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = btoa(`${email}:${Date.now()}`);
    dispatch(
      loginUser({ user: { id: Date.now(), name: username, email }, token })
    );
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h3 className="mb-3">Login</h3>
            <div className={styles.imageContainer}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                type="button"
                onClick={handleLogin}
              >
                Sign in
              </button>
            </div>
            <div className="mt-3 text-center">
              <small>
                Don't have an account? <Link to="/register">Register here</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
