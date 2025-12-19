import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../redux/features/authSlice";
import type { AppDispatch } from "../redux/store.ts";
import styles from "./auth.module.css";

//import material UI
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = btoa(`${email}:${Date.now()}`);
    dispatch(loginUser({ user: { id: Date.now(), email }, token }));
    navigate("/");
  };

  return (
    <div className={`container mt-5 ${styles["auth-wrapper-height"]}`}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h3 className="mb-3">Login</h3>
            <div className={styles.imageContainer}>
              <div className="mb-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Link
                          to="/forgot-password"
                          style={{
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            color: "#007bff",
                          }}
                        >
                          Forgot?
                        </Link>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3" style={{ textAlign: "left" }}>
                <FormControlLabel
                  className={styles.checkboxAlignLeft}
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
              </div>
              <button
                className={styles.gradientButton}
                type="button"
                onClick={handleLogin}
              >
                Sign in
              </button>
              <div className={`mb-3 ${styles["hr-wrapper"]}`}>
                <hr className="col-md-4" />
                <div className="col-md-4">Or sign in with</div>
                <hr className="col-md-4" />
              </div>
              <div className={styles.authButtonGroup}>
                <button className={styles.authButton}>
                  <GoogleIcon style={{ fontSize: "1.5rem" }} />
                  Google
                </button>
                <button className={styles.authButton}>
                  <AppleIcon style={{ fontSize: "1.5rem" }} />
                  Apple
                </button>
              </div>
              <div className="mt-3 text-center">
                <hr className={styles["login-hr"]} />
                <small>
                  Don't have an account?{" "}
                  <Link to="/register">Register here</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
