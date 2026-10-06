import { useEffect, useState } from "react";
import "../App.css";

function Skills({ onDashboard }) {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [editingSkill, setEditingSkill] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Get logged-in user
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };

  const user = getUser();

  // ==============================
  // FETCH SKILLS
  // ==============================
  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/skills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSkills(data);
      } else {
        setMessage(
          data.message || "Failed to load skills"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Fetch skills error:", error);

      setMessage("Cannot connect to the server.");
      setMessageType("error");
    }
  };

  // Load skills when page opens
  useEffect(() => {
    fetchSkills();
  }, []);

  // ==============================
  // ADD SKILL
  // ==============================
  const handleAddSkill = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!name.trim() || level === "") {
      setMessage(
        "Please enter both skill name and proficiency level."
      );
      setMessageType("error");
      return;
    }

    if (Number(level) < 0 || Number(level) > 100) {
      setMessage(
        "Proficiency level must be between 0 and 100."
      );
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/skills",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            level: Number(level),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Skill added successfully.");
        setMessageType("success");

        setName("");
        setLevel("");

        fetchSkills();
      } else {
        setMessage(
          data.message || "Failed to add skill"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Add skill error:", error);

      setMessage("Cannot connect to the server.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // START EDIT
  // ==============================
  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setEditName(skill.name);
    setEditLevel(skill.level);

    setMessage("");
  };

  // ==============================
  // UPDATE SKILL
  // ==============================
  const handleUpdateSkill = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!editName.trim() || editLevel === "") {
      setMessage(
        "Please enter skill name and proficiency level."
      );
      setMessageType("error");
      return;
    }

    if (
      Number(editLevel) < 0 ||
      Number(editLevel) > 100
    ) {
      setMessage(
        "Proficiency level must be between 0 and 100."
      );
      setMessageType("error");
      return;
    }

    setEditLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${editingSkill._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: editName.trim(),
            level: Number(editLevel),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Skill updated successfully.");
        setMessageType("success");

        setEditingSkill(null);
        setEditName("");
        setEditLevel("");

        fetchSkills();
      } else {
        setMessage(
          data.message || "Failed to update skill"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Update skill error:", error);

      setMessage("Cannot connect to the server.");
      setMessageType("error");
    } finally {
      setEditLoading(false);
    }
  };

  // ==============================
  // CANCEL EDIT
  // ==============================
  const handleCancelEdit = () => {
    setEditingSkill(null);
    setEditName("");
    setEditLevel("");
    setMessage("");
  };

  // ==============================
  // DELETE SKILL
  // ==============================
  const handleDeleteSkill = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Skill deleted successfully.");
        setMessageType("success");

        fetchSkills();
      } else {
        setMessage(
          data.message || "Failed to delete skill"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Delete skill error:", error);

      setMessage("Cannot connect to the server.");
      setMessageType("error");
    }
  };

  // ==============================
  // LEVEL TEXT
  // ==============================
  const getLevelText = (level) => {
    if (level >= 80) return "Advanced";
    if (level >= 60) return "Intermediate";
    if (level >= 40) return "Developing";

    return "Beginner";
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div className="skilltrack-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="skilltrack-sidebar">

        <div className="skilltrack-logo">

          <div className="skilltrack-logo-icon">
            S
          </div>

          <div>
            <strong>SkillTrack</strong>
            <span>Learning Platform</span>
          </div>

        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="skilltrack-nav">

          <a 
  href="#" 
  onClick={(e) => {
    e.preventDefault();
    onDashboard();
  }}
>
  <span>▦</span>
  Dashboard
</a>

          <a
            href="#"
            className="selected"
            onClick={(e) => e.preventDefault()}
          >
            <span>◆</span>
            Skills
          </a>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span>▣</span>
            Courses
          </a>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span>◈</span>
            Projects
          </a>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span>◇</span>
            Certificates
          </a>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span>◷</span>
            Progress
          </a>

        </nav>

        <div className="sidebar-section-title bottom-title">
          ACCOUNT
        </div>

        <nav className="skilltrack-nav">

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span>⚙</span>
            Settings
          </a>

          <a
            href="#"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </a>

        </nav>

        <div className="sidebar-footer">

          <div className="sidebar-footer-avatar">
            {user.name
              ? user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "SK"}
          </div>

          <div>

            <strong>
              {user.name || "Student"}
            </strong>

            <span>
              {user.email ||
                "student@skilltrack.com"}
            </span>

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="skilltrack-main">

        {/* HEADER */}

        <header className="skilltrack-header">

          <div>

            <div className="breadcrumb">
              Dashboard / <span>Skills</span>
            </div>

            <h1>My Skills</h1>

            <p>
              Build, track and improve your
              technical capabilities.
            </p>

          </div>

          <div className="header-profile">

            <div className="header-avatar">

              {user.name
                ? user.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "SK"}

            </div>

            <div>

              <strong>
                {user.name || "Student"}
              </strong>

              <span>Student</span>

            </div>

          </div>

        </header>

        {/* ================= SUMMARY CARDS ================= */}

        <section className="skill-summary">

          <div className="summary-card">

            <div className="summary-icon">
              ◆
            </div>

            <div>

              <span>
                Total Skills
              </span>

              <strong>
                {skills.length}
              </strong>

            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              %
            </div>

            <div>

              <span>
                Average Proficiency
              </span>

              <strong>

                {skills.length
                  ? Math.round(
                      skills.reduce(
                        (total, skill) =>
                          total + skill.level,
                        0
                      ) / skills.length
                    )
                  : 0}

                %

              </strong>

            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              ★
            </div>

            <div>

              <span>
                Advanced Skills
              </span>

              <strong>

                {
                  skills.filter(
                    (skill) =>
                      skill.level >= 80
                  ).length
                }

              </strong>

            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              ↑
            </div>

            <div>

              <span>
                Skills Tracked
              </span>

              <strong>
                {skills.length}
              </strong>

            </div>

          </div>

        </section>

        {/* ================= SKILLS AREA ================= */}

        <section className="skills-layout">

          {/* ================= ADD SKILL ================= */}

          <div className="skill-form-card">

            <div className="section-heading">

              <div>

                <h2>
                  Add New Skill
                </h2>

                <p>
                  Record a skill and your
                  current proficiency level.
                </p>

              </div>

            </div>

            <form onSubmit={handleAddSkill}>

              <label>
                Skill Name
              </label>

              <input
                type="text"
                placeholder="e.g. Java, React, SQL"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <label>
                Proficiency Level
              </label>

              <div className="level-input">

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={level}
                  onChange={(e) =>
                    setLevel(e.target.value)
                  }
                />

                <span>%</span>

              </div>

              <button
                type="submit"
                className="add-skill-button"
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : "+ Add Skill"}
              </button>

              {message && !editingSkill && (
                <div
                  className={`skill-message ${
                    messageType === "success"
                      ? "success"
                      : "error"
                  }`}
                >
                  {message}
                </div>
              )}

            </form>

          </div>

          {/* ================= EDIT SKILL ================= */}

          {editingSkill && (

            <div className="edit-skill-card">

              <div className="section-heading">

                <div>

                  <h2>
                    Edit Skill
                  </h2>

                  <p>
                    Update your skill name
                    and proficiency level.
                  </p>

                </div>

              </div>

              <form onSubmit={handleUpdateSkill}>

                <label>
                  Skill Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                />

                <label>
                  Proficiency Level
                </label>

                <div className="level-input">

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editLevel}
                    onChange={(e) =>
                      setEditLevel(e.target.value)
                    }
                  />

                  <span>%</span>

                </div>

                <div className="edit-actions">

                  <button
                    type="submit"
                    className="update-skill-button"
                    disabled={editLoading}
                  >
                    {editLoading
                      ? "Updating..."
                      : "Update Skill"}
                  </button>

                  <button
                    type="button"
                    className="cancel-edit-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>

                </div>

                {message && (
                  <div
                    className={`skill-message ${
                      messageType === "success"
                        ? "success"
                        : "error"
                    }`}
                  >
                    {message}
                  </div>
                )}

              </form>

            </div>

          )}

          {/* ================= SKILL LIST ================= */}

          <div className="skill-list-card">

            <div className="section-heading skill-list-heading">

              <div>

                <h2>
                  Your Technical Skills
                </h2>

                <p>

                  {skills.length
                    ? `${skills.length} skill${
                        skills.length > 1
                          ? "s"
                          : ""
                      } currently tracked`
                    : "No skills added yet"}

                </p>

              </div>

              <span className="skill-count">
                {skills.length}
              </span>

            </div>

            {skills.length === 0 ? (

              <div className="empty-skills">

                <div className="empty-icon">
                  ◆
                </div>

                <h3>
                  No skills added yet
                </h3>

                <p>
                  Add your first technical skill
                  to start tracking your progress.
                </p>

              </div>

            ) : (

              <div className="skills-list">

                {skills.map((skill) => (

                  <div
                    className="professional-skill"
                    key={skill._id}
                  >

                    <div className="skill-top">

                      <div className="skill-name-area">

                        <div className="skill-letter">

                          {skill.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {skill.name}
                          </strong>

                          <span>
                            {getLevelText(
                              skill.level
                            )}
                          </span>

                        </div>

                      </div>

                      <div className="skill-actions">

                        <strong className="skill-percentage">
                          {skill.level}%
                        </strong>

                        <button
                          type="button"
                          className="edit-skill-button"
                          onClick={() =>
                            handleEditSkill(skill)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-skill-button"
                          onClick={() =>
                            handleDeleteSkill(
                              skill._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                    <div className="professional-progress">

                      <div
                        className="professional-progress-fill"
                        style={{
                          width: `${skill.level}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Skills;