import { useState } from "react";

function Register({ onBackToLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Check passwords
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Registration successful! Please login.");

        onBackToLogin();

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error(error);

      alert("Cannot connect to the server.");

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
            Start Your
            <br />
            Learning
            <br />
            Journey.
          </h2>

          <p>
            Create your SkillTrack account and organize
            your skills, courses, projects and certificates
            in one professional learning platform.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <strong>Learn</strong>
              <span>Build knowledge</span>
            </div>

            <div className="auth-feature">
              <strong>Build</strong>
              <span>Create projects</span>
            </div>

            <div className="auth-feature">
              <strong>Grow</strong>
              <span>Track progress</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">

          <div className="auth-card">

            <div className="auth-logo">
              S
            </div>

            <h1>Create Account</h1>

            <p className="auth-subtitle">
              Start your journey with SkillTrack
            </p>

            <form onSubmit={handleSubmit}>

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="auth-button"
              >
                Create Account
              </button>

            </form>

            <p className="switch-text">
              Already have an account?

              <button onClick={onBackToLogin}>
                Login
              </button>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;