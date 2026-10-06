import { useEffect, useState } from "react";

function Projects({ onDashboard }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [githubLink, setGithubLink] = useState("");

  const [editingProject, setEditingProject] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch projects
  const fetchProjects = async () => {
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
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Clear form
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setTechnologies("");
    setStatus("Not Started");
    setGithubLink("");
    setEditingProject(null);
  };

  // Add project
  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            technologies,
            status,
            githubLink,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Project added successfully");
        clearForm();
        fetchProjects();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Unable to add project");
    }
  };

  // Start editing
  const handleEdit = (project) => {
    setEditingProject(project);

    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies);
    setStatus(project.status);
    setGithubLink(project.githubLink || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update project
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${editingProject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            technologies,
            status,
            githubLink,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Project updated successfully");
        clearForm();
        fetchProjects();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Unable to update project");
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Project deleted successfully");
        fetchProjects();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Unable to delete project");
    }
  };

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

          <a href="#">
            Skills
          </a>

          <a href="#">
            Courses
          </a>

          <a className="active">
            Projects
          </a>

          <a href="#">
            Certificates
          </a>

          <a href="#">
            Progress
          </a>

        </nav>

      </aside>


      {/* Main Content */}
      <main className="skilltrack-main">

        <header className="skilltrack-header">

          <div>
            <h1>
              Projects
            </h1>

            <p>
              Manage your projects and showcase your technical work.
            </p>
          </div>

        </header>


        {/* Add / Edit Form */}
        <div className="skill-form-card">

          <h2>
            {editingProject
              ? "Edit Project"
              : "Add New Project"}
          </h2>

          <form
            onSubmit={
              editingProject
                ? handleUpdateProject
                : handleAddProject
            }
          >

            {/* Project Title */}
            <div className="form-group">

              <label>
                Project Title
              </label>

              <input
                type="text"
                placeholder="Enter project title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>


            {/* Description */}
            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                placeholder="Describe your project"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows="4"
                required
              ></textarea>

            </div>


            {/* Technologies */}
            <div className="form-group">

              <label>
                Technologies
              </label>

              <input
                type="text"
                placeholder="Example: React, Java, MongoDB"
                value={technologies}
                onChange={(e) =>
                  setTechnologies(e.target.value)
                }
                required
              />

            </div>


            {/* Status */}
            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >

                <option value="Not Started">
                  Not Started
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>


            {/* GitHub Link */}
            <div className="form-group">

              <label>
                GitHub Link
              </label>

              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubLink}
                onChange={(e) =>
                  setGithubLink(e.target.value)
                }
              />

            </div>


            {/* Buttons */}
            <div className="edit-actions">

              <button
                type="submit"
                className="update-skill-button"
              >
                {editingProject
                  ? "Update Project"
                  : "Add Project"}
              </button>

              {editingProject && (
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>


        {/* Project List */}
        <div className="skill-list-card">

          <div className="card-header">

            <div>

              <h2>
                My Projects
              </h2>

              <p>
                {projects.length} project
                {projects.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>


          {loading && (
            <p>
              Loading projects...
            </p>
          )}


          {!loading &&
            projects.length === 0 && (
              <p>
                No projects added yet.
              </p>
            )}


          {!loading &&
            projects.map((project) => (

              <div
                className="professional-skill"
                key={project._id}
              >

                <div>

                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.description}
                  </p>

                  <strong>
                    Technologies:
                  </strong>

                  <span>
                    {" "}
                    {project.technologies}
                  </span>

                  <div>
                    <strong>
                      Status:
                    </strong>

                    <span>
                      {" "}
                      {project.status}
                    </span>
                  </div>

                  {project.githubLink && (
                    <div>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View GitHub
                      </a>
                    </div>
                  )}

                </div>


                <div className="skill-actions">

                  <button
                    className="edit-skill-button"
                    onClick={() =>
                      handleEdit(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-skill-button"
                    onClick={() =>
                      handleDelete(project._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

        </div>

      </main>

    </div>
  );
}

export default Projects;