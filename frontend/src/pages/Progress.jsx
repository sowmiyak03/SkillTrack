
import { useEffect, useState } from "react";

function Progress({
  onDashboard,
  onSkills,
  onCourses,
  onProjects,
  onCertificates,
}) {
  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          skillsResponse,
          coursesResponse,
          projectsResponse,
          certificatesResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/skills", {
            headers,
          }),

          fetch("http://localhost:5000/api/courses", {
            headers,
          }),

          fetch("http://localhost:5000/api/projects", {
            headers,
          }),

          fetch("http://localhost:5000/api/certificates", {
            headers,
          }),
        ]);

        const skillsData = await skillsResponse.json();
        const coursesData = await coursesResponse.json();
        const projectsData = await projectsResponse.json();
        const certificatesData =
          await certificatesResponse.json();

        if (skillsResponse.ok) {
          setSkills(skillsData);
        }

        if (coursesResponse.ok) {
          setCourses(coursesData);
        }

        if (projectsResponse.ok) {
          setProjects(projectsData);
        }

        if (certificatesResponse.ok) {
          setCertificates(certificatesData);
        }
      } catch (error) {
        console.error(
          "Error fetching progress data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Completed courses
  const completedCourses = courses.filter(
    (course) => course.status === "Completed"
  ).length;

  // Completed projects
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  // Average skill percentage
  const averageSkill =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) => total + skill.level,
            0
          ) / skills.length
        )
      : 0;

  // Average course progress
  const averageCourseProgress =
    courses.length > 0
      ? courses.reduce(
          (total, course) => total + course.progress,
          0
        ) / courses.length
      : 0;

  // Project progress
  const projectProgress =
    projects.length > 0
      ? projects.reduce((total, project) => {
          if (project.status === "Completed") {
            return total + 100;
          }

          if (project.status === "In Progress") {
            return total + 50;
          }

          return total;
        }, 0) / projects.length
      : 0;

  // Certificate progress
  const certificateProgress =
    certificates.length > 0 ? 100 : 0;

  // Overall progress
  const overallProgress = Math.round(
    (averageSkill +
      averageCourseProgress +
      projectProgress +
      certificateProgress) /
      4
  );

  if (loading) {
    return (
      <div className="skilltrack-page">
        <main className="skilltrack-main">
          <h1>Loading Progress...</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="skilltrack-page">

      {/* Sidebar */}
      <aside className="skilltrack-sidebar">

        <div className="skilltrack-logo">

          <div className="skilltrack-logo-icon">
            S
          </div>

          <span>
            SkillTrack
          </span>

        </div>

        <nav className="skilltrack-nav">

          <a onClick={onDashboard}>
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

          <a className="active">
            Progress
          </a>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="skilltrack-main">

        {/* Header */}
        <header className="skilltrack-header">

          <div>

            <h1>
              Learning Progress
            </h1>

            <p>
              Monitor your overall skill development.
            </p>

          </div>

        </header>

        {/* Statistics */}
        <div className="stats">

          {/* Average Skill */}
          <div className="stat-card">

            <div className="stat-icon purple">
              S
            </div>

            <div>

              <span>
                Average Skill
              </span>

              <h2>
                {averageSkill}%
              </h2>

            </div>

          </div>

          {/* Completed Courses */}
          <div className="stat-card">

            <div className="stat-icon blue">
              C
            </div>

            <div>

              <span>
                Completed Courses
              </span>

              <h2>
                {completedCourses}
              </h2>

            </div>

          </div>

          {/* Completed Projects */}
          <div className="stat-card">

            <div className="stat-icon orange">
              P
            </div>

            <div>

              <span>
                Completed Projects
              </span>

              <h2>
                {completedProjects}
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
                {certificates.length}
              </h2>

            </div>

          </div>

        </div>

        {/* Overall Learning Progress */}
        <div className="card">

          <div className="card-header">

            <div>

              <h3>
                Overall Learning Progress
              </h3>

              <p>
                Based on your skills, courses,
                projects and certificates.
              </p>

            </div>

            <strong>
              {overallProgress}%
            </strong>

          </div>

          <div className="progress">

            <div
              className="progress-bar"
              style={{
                width: `${overallProgress}%`,
              }}
            ></div>

          </div>

        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">

          {/* Skill Development */}
          <div className="card">

            <div className="card-header">

              <div>

                <h3>
                  Skill Development
                </h3>

                <p>
                  Your current technical skill levels.
                </p>

              </div>

            </div>

            {skills.length === 0 ? (

              <p>
                No skills added yet.
              </p>

            ) : (

              skills.map((skill) => (

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

              ))

            )}

          </div>

          {/* Course Progress */}
          <div className="card">

            <div className="card-header">

              <div>

                <h3>
                  Course Progress
                </h3>

                <p>
                  Your learning progress by course.
                </p>

              </div>

            </div>

            {courses.length === 0 ? (

              <p>
                No courses added yet.
              </p>

            ) : (

              courses.map((course) => (

                <div
                  className="skill"
                  key={course._id}
                >

                  <div className="skill-info">

                    <span>
                      {course.title}
                    </span>

                    <strong>
                      {course.progress}%
                    </strong>

                  </div>

                  <div className="progress">

                    <div
                      className="progress-bar"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    ></div>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* Project Progress */}
          <div className="card">

            <div className="card-header">

              <div>

                <h3>
                  Project Progress
                </h3>

                <p>
                  Track the status of your projects.
                </p>

              </div>

            </div>

            {projects.length === 0 ? (

              <p>
                No projects added yet.
              </p>

            ) : (

              projects.map((project) => (

                <div
                  className="skill"
                  key={project._id}
                >

                  <div className="skill-info">

                    <span>
                      {project.title}
                    </span>

                    <strong>
                      {project.status}
                    </strong>

                  </div>

                  <div className="progress">

                    <div
                      className="progress-bar"
                      style={{
                        width:
                          project.status === "Completed"
                            ? "100%"
                            : project.status === "In Progress"
                            ? "50%"
                            : "0%",
                      }}
                    ></div>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* Recent Activity */}
          <div className="card">

            <div className="card-header">

              <div>

                <h3>
                  Recent Activity
                </h3>

                <p>
                  Your latest learning activities.
                </p>

              </div>

            </div>

            {skills.length === 0 &&
            courses.length === 0 &&
            projects.length === 0 &&
            certificates.length === 0 ? (

              <p>
                No recent activity available.
              </p>

            ) : (

              <div className="activity-list">

                {/* Skills */}
                {skills.slice(0, 3).map((skill) => (

                  <div
                    className="activity-item"
                    key={`skill-${skill._id}`}
                  >

                    <div className="activity-icon">
                      S
                    </div>

                    <div>

                      <strong>
                        Skill Added
                      </strong>

                      <p>
                        {skill.name} — {skill.level}%
                      </p>

                    </div>

                  </div>

                ))}

                {/* Courses */}
                {courses.slice(0, 3).map((course) => (

                  <div
                    className="activity-item"
                    key={`course-${course._id}`}
                  >

                    <div className="activity-icon">
                      C
                    </div>

                    <div>

                      <strong>
                        Course Updated
                      </strong>

                      <p>
                        {course.title} — {course.progress}%
                      </p>

                    </div>

                  </div>

                ))}

                {/* Projects */}
                {projects.slice(0, 3).map((project) => (

                  <div
                    className="activity-item"
                    key={`project-${project._id}`}
                  >

                    <div className="activity-icon">
                      P
                    </div>

                    <div>

                      <strong>
                        Project Updated
                      </strong>

                      <p>
                        {project.title} — {project.status}
                      </p>

                    </div>

                  </div>

                ))}

                {/* Certificates */}
                {certificates.slice(0, 3).map((certificate) => (

                  <div
                    className="activity-item"
                    key={`certificate-${certificate._id}`}
                  >

                    <div className="activity-icon">
                      C
                    </div>

                    <div>

                      <strong>
                        Certificate Added
                      </strong>

                      <p>
                        {certificate.title} — {certificate.organization}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Progress;

