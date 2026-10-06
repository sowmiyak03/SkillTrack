
import { useEffect, useState } from "react";

function Courses({ onDashboard }) {
  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Not Started");

  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch courses
  const fetchCourses = async () => {
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
        setMessage(data.message || "Failed to load courses");
      }

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCourses();
  }, []);


  // Automatically update status
  const updateStatusFromProgress = (value) => {
    if (value === 0) {
      setStatus("Not Started");
    } else if (value === 100) {
      setStatus("Completed");
    } else {
      setStatus("In Progress");
    }
  };


  // Add course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!title || !platform) {
      setMessage("Please enter course title and platform");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/courses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            platform,
            progress: Number(progress),
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage("Course added successfully");

        clearForm();

        fetchCourses();

      } else {

        setMessage(
          data.message || "Failed to add course"
        );

      }

    } catch (error) {

      console.error(error);

      setMessage("Unable to connect to server");
    }
  };


  // Start editing
  const handleEditCourse = (course) => {

    setEditingCourse(course);

    setTitle(course.title);
    setPlatform(course.platform);
    setProgress(course.progress);
    setStatus(course.status);

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // Update course
  const handleUpdateCourse = async (e) => {

    e.preventDefault();

    if (!title || !platform) {
      setMessage(
        "Please enter course title and platform"
      );
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:5000/api/courses/${editingCourse._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            platform,
            progress: Number(progress),
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage(
          "Course updated successfully"
        );

        clearForm();

        fetchCourses();

      } else {

        setMessage(
          data.message || "Failed to update course"
        );

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to connect to server"
      );
    }
  };


  // Delete course
  const handleDeleteCourse = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage(
          "Course deleted successfully"
        );

        fetchCourses();

      } else {

        setMessage(
          data.message || "Failed to delete course"
        );

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to connect to server"
      );
    }
  };


  // Clear form
  const clearForm = () => {

    setTitle("");
    setPlatform("");
    setProgress(0);
    setStatus("Not Started");
    setEditingCourse(null);
  };


  // Cancel editing
  const handleCancelEdit = () => {

    clearForm();

    setMessage("");
  };


  return (
    <div className="skilltrack-page">

      {/* Sidebar */}
      <aside className="skilltrack-sidebar">

        <div className="skilltrack-logo">

          <div className="logo-icon">
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

          <a className="active">
            Courses
          </a>

          <a href="#">
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


      {/* Main */}
      <main className="skilltrack-main">

        {/* Header */}
        <header className="skilltrack-header">

          <div>

            <h1>
              Courses
            </h1>

            <p>
              Track your learning and course progress.
            </p>

          </div>

        </header>


        {/* Course Form */}
        <section className="skill-form-card">

          <div className="card-header">

            <div>

              <h3>
                {editingCourse
                  ? "Edit Course"
                  : "Add New Course"}
              </h3>

              <p>
                {editingCourse
                  ? "Update your course information."
                  : "Add a course you are currently learning."}
              </p>

            </div>

          </div>


          <form
            onSubmit={
              editingCourse
                ? handleUpdateCourse
                : handleAddCourse
            }
          >

            {/* Title */}
            <div className="form-group">

              <label>
                Course Title
              </label>

              <input
                type="text"
                placeholder="Example: Java Full Stack"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

            </div>


            {/* Platform */}
            <div className="form-group">

              <label>
                Platform
              </label>

              <input
                type="text"
                placeholder="Example: Udemy / Coursera / NPTEL"
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value)
                }
              />

            </div>


            {/* Progress */}
            <div className="form-group">

              <label>
                Progress: {progress}%
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => {

                  const value =
                    Number(e.target.value);

                  setProgress(value);

                  updateStatusFromProgress(
                    value
                  );
                }}
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


            {/* Buttons */}
            <div className="edit-actions">

              <button
                type="submit"
                className="add-skill-button"
              >
                {editingCourse
                  ? "Update Course"
                  : "+ Add Course"}
              </button>


              {editingCourse && (

                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>


          {message && (

            <p className="skill-message">
              {message}
            </p>

          )}

        </section>


        {/* Course List */}
        <section className="skill-list-card">

          <div className="card-header">

            <div>

              <h3>
                My Courses
              </h3>

              <p>
                Your current learning courses.
              </p>

            </div>

            <span>
              {courses.length} Courses
            </span>

          </div>


          {loading ? (

            <p>
              Loading courses...
            </p>

          ) : courses.length === 0 ? (

            <p>
              No courses added yet.
            </p>

          ) : (

            <div>

              {courses.map((course) => (

                <div
                  className="professional-skill"
                  key={course._id}
                >

                  {/* Course Info */}
                  <div className="skill-info">

                    <div>

                      <strong>
                        {course.title}
                      </strong>

                      <small>
                        {course.platform}
                      </small>

                    </div>

                    <strong>
                      {course.progress}%
                    </strong>

                  </div>


                  {/* Progress */}
                  <div className="professional-progress">

                    <div
                      style={{
                        width:
                          `${course.progress}%`,
                      }}
                    ></div>

                  </div>


                  {/* Status + Actions */}
                  <div className="skill-actions">

                    <span>
                      {course.status}
                    </span>


                    <div>

                      <button
                        className="edit-skill-button"
                        onClick={() =>
                          handleEditCourse(course)
                        }
                      >
                        Edit
                      </button>


                      <button
                        className="delete-skill-button"
                        onClick={() =>
                          handleDeleteCourse(
                            course._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Courses;
