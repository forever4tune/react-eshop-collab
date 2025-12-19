import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import styles from "./auth.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!emailRe.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to continue";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // on successful validation show toast then navigate
    setOpenSuccess(true);
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="container mt-5" style={{ paddingBottom: "6px" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h3 className="mb-3">Register</h3>
            <div className={styles.imageContainer}>
              <div className="mb-3">
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() =>
                    setErrors((p) => ({
                      ...p,
                      name: !name ? "Name is required" : undefined,
                    }))
                  }
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    const emailRe = /^\S+@\S+\.\S+$/;
                    setErrors((p) => ({
                      ...p,
                      email: !email
                        ? "Email is required"
                        : !emailRe.test(email)
                        ? "Enter a valid email"
                        : undefined,
                    }));
                  }}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
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
                  onBlur={() =>
                    setErrors((p) => ({
                      ...p,
                      password: !password
                        ? "Password is required"
                        : password.length < 6
                        ? "Password must be at least 6 characters"
                        : undefined,
                    }))
                  }
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    setErrors((p) => ({
                      ...p,
                      confirmPassword: !confirmPassword
                        ? "Please confirm your password"
                        : confirmPassword !== password
                        ? "Passwords do not match"
                        : undefined,
                    }))
                  }
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
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
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                  }
                  label="I agree to the Terms of Service and Privacy Policy"
                />
                {errors.agreeTerms && (
                  <div className={styles.errorText}>{errors.agreeTerms}</div>
                )}
              </div>
              <button
                className={styles.gradientButton}
                onClick={handleRegister}
              >
                Sign up
              </button>
              <div className={`mb-3 ${styles["hr-wrapper"]}`}>
                <hr className="col-md-4" />
                <div className="col-md-4">Or continue with</div>
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
              <Snackbar
                open={openSuccess}
                autoHideDuration={3000}
                onClose={() => setOpenSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setOpenSuccess(false)}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Registration successful
                </Alert>
              </Snackbar>
              <div className="mt-3 text-center">
                <hr />
                <small>
                  Already have an account? <Link to="/login">Login here</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
