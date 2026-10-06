import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Skills from "./pages/Skills";
import Courses from "./pages/Courses";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import Progress from "./pages/Progress";
import "./App.css";

function Dashboard({ onSkills, onCourses ,onProjects,onCertificates,onProgress}) {
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [certificates, setCertificates] = useState([]);
const [certificatesLoading, setCertificatesLoading] = useState(true);


  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };

  const user = getUser();

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setSkillsLoading(false);
        return;
      }

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
          console.log(
            "Failed to fetch skills:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Error fetching skills:",
          error
        );
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setCoursesLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          console.log(
            "Failed to fetch courses:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);
     
  // Fetch projects
useEffect(() => {
  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProjectsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        console.log(
          "Failed to fetch projects:",
          data.message
        );
      }
    } catch (error) {
      console.error(
        "Error fetching projects:",
        error
      );
    } finally {
      setProjectsLoading(false);
    }
  };

  fetchProjects();
}, []);
  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setCertificatesLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/certificates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setCertificates(data);
        } else {
          console.log(
            "Failed to fetch certificates:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Error fetching certificates:",
          error
        );
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">S</div>
          <span>SkillTrack</span>
        </div>

        <nav>

          <a className="active">
            Dashboard
          </a>

          <a onClick={onSkills}>
            Skills
          </a>

          <a onClick={onCourses}>
            Courses
          </a>

          <a onClick={onProjects}>
            Projects
          </a>

          <a onClick={onCertificates}>
            Certificates
          </a>

          <a onClick={onProgress}>
            Progress
          </a>

        </nav>

        <div className="sidebar-bottom">

          <a>
            Settings
          </a>

          <a onClick={handleLogout}>
            Logout
          </a>

        </div>

      </aside>


      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="header">

          <div>

            <h1>
              Welcome back, {user.name || "Student"}!
            </h1>

            <p>
              Track your skills, learning and achievements.
            </p>

          </div>


          <div className="profile">

            <div className="avatar">

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

              <small>
                {user.role || "Student"}
              </small>

            </div>

          </div>

        </header>


        {/* Statistics */}
        <section className="stats">

          {/* Total Skills */}
          <div className="stat-card">

            <div className="stat-icon purple">
              S
            </div>

            <div>

              <span>
                Total Skills
              </span>

              <h2>
                {skillsLoading
                  ? "..."
                  : skills.length}
              </h2>

            </div>

          </div>


          {/* Courses */}
          <div className="stat-card">

            <div className="stat-icon blue">
              C
            </div>

            <div>

              <span>
                Courses
              </span>

              <h2>
                {coursesLoading
                  ? "..."
                  : courses.length}
              </h2>

            </div>

          </div>


          {/* Projects */}
          <div className="stat-card">

            <div className="stat-icon orange">
              P
            </div>

            <div>

              <span>
                Projects
              </span>

              <h2>
                {projectsLoading ? "..." : projects.length}
              </h2>

            </div>

          </div>


          {/* Certificates */}
          <div className="stat-card">

            <div className="stat-icon green">
              C
            </div>

            <div>

              <span>
                Certificates
              </span>

              <h2>
                {certificatesLoading
  ? "..."
  : certificates.length}
              </h2>

            </div>

          </div>

        </section>


        {/* Dashboard Grid */}
        <section className="dashboard-grid">

          {/* Skills */}
          <div className="card skills-card">

            <div className="card-header">

              <div>

                <h3>
                  Skill Progress
                </h3>

                <p>
                  Your current technical skills
                </p>

              </div>

              <button onClick={onSkills}>
                + Add Skill
              </button>

            </div>


            {skillsLoading && (
              <p>
                Loading skills...
              </p>
            )}


            {!skillsLoading &&
              skills.length === 0 && (
                <p>
                  No skills added yet.
                </p>
              )}


            {!skillsLoading &&
              skills.slice(0, 4).map((skill) => (

                <div
                  className="skill"
                  key={skill._id}
                >

                  <div className="skill-info">

                    <span>
                      {skill.name}
                    </span>

                    <strong>
                      {skill.level}%
                    </strong>

                  </div>


                  <div className="progress">

                    <div
                      className="progress-bar"
                      style={{
                        width: `${skill.level}%`,
                      }}
                    ></div>

                  </div>

                </div>

              ))}

          </div>


          {/* Learning Activity */}
          <div className="card activity-card">

            <div className="card-header">

              <div>

                <h3>
                  Learning Activity
                </h3>

                <p>
                  Your learning this week
                </p>

              </div>

            </div>


            <div className="activity-chart">

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "45%" }}
                ></div>
                <span>Mon</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "70%" }}
                ></div>
                <span>Tue</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "55%" }}
                ></div>
                <span>Wed</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "90%" }}
                ></div>
                <span>Thu</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "65%" }}
                ></div>
                <span>Fri</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "80%" }}
                ></div>
                <span>Sat</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: "35%" }}
                ></div>
                <span>Sun</span>
              </div>

            </div>

          </div>

        </section>


        {/* Bottom Grid */}
        <section className="bottom-grid">


          {/* Recent Projects */}
        <div className="card">

  <div className="card-header">

    <div>

      <h3>
        Recent Projects
      </h3>

      <p>
        Your latest work
      </p>

    </div>

    <button onClick={onProjects}>
      View All
    </button>

  </div>


  {projectsLoading && (
    <p>
      Loading projects...
    </p>
  )}


  {!projectsLoading &&
    projects.length === 0 && (
      <p>
        No projects added yet.
      </p>
    )}


  {!projectsLoading &&
    projects.slice(0, 3).map((project) => (

      <div
        className="project"
        key={project._id}
      >

        <div className="project-icon">
          P
        </div>

        <div>

          <strong>
            {project.title}
          </strong>

          <p>
            {project.technologies}
          </p>

        </div>

        <span
          className={
            project.status === "Completed"
              ? "completed"
              : "progress-status"
          }
        >
          {project.status}
        </span>

      </div>

    ))}

</div>    

       {/* Recent Certificates */}
<div className="card">

  <div className="card-header">

    <div>

      <h3>
        Recent Certificates
      </h3>

      <p>
        Your latest achievements
      </p>

    </div>

    <button onClick={onCertificates}>
      View All
    </button>

  </div>


  {certificatesLoading && (
    <p>
      Loading certificates...
    </p>
  )}


  {!certificatesLoading &&
    certificates.length === 0 && (
      <p>
        No certificates added yet.
      </p>
    )}


  {!certificatesLoading &&
    certificates.slice(0, 3).map((certificate) => (

      <div
        className="certificate"
        key={certificate._id}
      >

        <div className="certificate-icon">
          C
        </div>

        <div>

          <strong>
            {certificate.title}
          </strong>

          <p>
            {certificate.organization} • {certificate.year}
          </p>

        </div>

        <span className="completed">
          Certificate
        </span>

      </div>

    ))}

</div>   

        </section>

      </main>

    </div>
  );
}


// Main App
function App() {

  const [page, setPage] = useState(() => {
    return localStorage.getItem("token")
      ? "dashboard"
      : "login";
  });


  const handleLogin = () => {
    setPage("dashboard");
  };


  const handleRegister = () => {
    setPage("register");
  };


  const handleBackToLogin = () => {
    setPage("login");
  };


  const handleSkills = () => {
    setPage("skills");
  };
  const handleDashboard = () => {
  setPage("dashboard");
};

  const handleCourses = () => {
    setPage("courses");
  };
  const handleProjects = () => {
  setPage("projects");
};

 const handleCertificates = () => {
  setPage("certificates");
};
 const handleProgress = () => {
  setPage("progress");
};

  if (page === "login") {

    return (
      <Login
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );

  }


  if (page === "register") {

    return (
      <Register
        onBackToLogin={handleBackToLogin}
      />
    );

  }


  if (page === "skills") {

    return <Skills  onDashboard={handleDashboard}/>;

  }


  if (page === "courses") {

     return <Courses onDashboard={handleDashboard} />;

  }
  
  if (page === "projects") {
  return <Projects onDashboard={handleDashboard} />;
}
 if (page === "certificates") {
  return <Certificates onDashboard={handleDashboard} />;
}

if (page === "progress") {
  return (
    <Progress
      onDashboard={() => setPage("dashboard")}
      onSkills={() => setPage("skills")}
       onCourses={handleCourses}
       onProjects={handleProjects}
       onCertificates={handleCertificates}
    />
  );
}

  return (
    <Dashboard
      onSkills={handleSkills}
      onCourses={handleCourses}
      onProjects={handleProjects}
       onCertificates={handleCertificates}
       onProgress={handleProgress}
    />
  );
}


export default App;