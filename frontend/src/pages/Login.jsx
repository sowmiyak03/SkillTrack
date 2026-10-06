import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Open dashboard
        onLogin();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Cannot connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-left">

          <div className="auth-brand">
            Skill<span>Track</span>
          </div>

          <h2>
            Build Skills.
            <br />
            Track Progress.
            <br />
            Achieve More.
          </h2>

          <p>
            Manage your learning journey in one place.
            Track your skills, courses, projects and
            certificates with SkillTrack.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <strong>Skills</strong>
              <span>Track growth</span>
            </div>

            <div className="auth-feature">
              <strong>Courses</strong>
              <span>Learn & improve</span>
            </div>

            <div className="auth-feature">
              <strong>Projects</strong>
              <span>Build portfolio</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">

          <div className="auth-card">

            <div className="auth-logo">
              S
            </div>

            <h1>Welcome Back</h1>

            <p className="auth-subtitle">
              Login to continue to your SkillTrack dashboard
            </p>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="switch-text">
              Don't have an account?

              <button
                type="button"
                onClick={onRegister}
              >
                Create Account
              </button>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;