import { useEffect, useState } from "react";

function Certificates({ onDashboard }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [year, setYear] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);

  const [editingCertificate, setEditingCertificate] =
    useState(null);

  const token = localStorage.getItem("token");

  // Fetch certificates
  const fetchCertificates = async () => {
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
        console.log(data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching certificates:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Clear form
  const clearForm = () => {
    setTitle("");
    setOrganization("");
    setYear("");
    setCredentialId("");
    setCertificateLink("");
    setCertificateFile(null);
    setEditingCertificate(null);
  };

  // Add certificate
  const handleAddCertificate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("organization", organization);
      formData.append("year", year);
      formData.append("credentialId", credentialId);
      formData.append("certificateLink", certificateLink);

      if (certificateFile) {
        formData.append(
          "certificateFile",
          certificateFile
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/certificates",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Certificate added successfully");
        clearForm();
        fetchCertificates();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(
        "Error adding certificate:",
        error
      );

      alert("Unable to add certificate");
    }
  };

  // Edit certificate
  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);

    setTitle(certificate.title);
    setOrganization(certificate.organization);
    setYear(certificate.year);
    setCredentialId(
      certificate.credentialId || ""
    );
    setCertificateLink(
      certificate.certificateLink || ""
    );

    setCertificateFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update certificate
  const handleUpdateCertificate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("organization", organization);
      formData.append("year", year);
      formData.append("credentialId", credentialId);
      formData.append("certificateLink", certificateLink);

      if (certificateFile) {
        formData.append(
          "certificateFile",
          certificateFile
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/certificates/${editingCertificate._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Certificate updated successfully");
        clearForm();
        fetchCertificates();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(
        "Error updating certificate:",
        error
      );

      alert("Unable to update certificate");
    }
  };

  // Delete certificate
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/certificates/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Certificate deleted successfully");
        fetchCertificates();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(
        "Error deleting certificate:",
        error
      );

      alert("Unable to delete certificate");
    }
  };

  return (
    <div className="skilltrack-page">
      <aside className="skilltrack-sidebar">
        <div className="skilltrack-logo">
          <div className="skilltrack-logo-icon">
            S
          </div>

          <span>SkillTrack</span>
        </div>

        <nav className="skilltrack-nav">
         <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    onDashboard();
  }}
>
  Dashboard
</a>
          <a href="#">Skills</a>
          <a href="#">Courses</a>
          <a href="#">Projects</a>

          <a className="active">
            Certificates
          </a>

          <a href="#">Progress</a>
        </nav>
      </aside>

      <main className="skilltrack-main">
        <header className="skilltrack-header">
          <div>
            <h1>Certificates</h1>

            <p>
              Manage your certifications and
              achievements.
            </p>
          </div>
        </header>

        {/* Certificate Form */}

        <div className="skill-form-card">
          <h2>
            {editingCertificate
              ? "Edit Certificate"
              : "Add New Certificate"}
          </h2>

          <form
            onSubmit={
              editingCertificate
                ? handleUpdateCertificate
                : handleAddCertificate
            }
          >
            {/* Certificate Title */}

            <div className="form-group">
              <label>
                Certificate Title
              </label>

              <input
                type="text"
                placeholder="Example: Java Programming"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />
            </div>

            {/* Organization */}

            <div className="form-group">
              <label>
                Organization
              </label>

              <input
                type="text"
                placeholder="Example: NPTEL"
                value={organization}
                onChange={(e) =>
                  setOrganization(
                    e.target.value
                  )
                }
                required
              />
            </div>

            {/* Year */}

            <div className="form-group">
              <label>Year</label>

              <input
                type="number"
                placeholder="Example: 2026"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                min="2000"
                max="2100"
                required
              />
            </div>

            {/* Credential ID */}

            <div className="form-group">
              <label>
                Credential ID
              </label>

              <input
                type="text"
                placeholder="Enter credential ID"
                value={credentialId}
                onChange={(e) =>
                  setCredentialId(
                    e.target.value
                  )
                }
              />
            </div>

            {/* Certificate Link */}

            <div className="form-group">
              <label>
                Certificate Link
              </label>

              <input
                type="url"
                placeholder="https://example.com/certificate"
                value={certificateLink}
                onChange={(e) =>
                  setCertificateLink(
                    e.target.value
                  )
                }
              />
            </div>

            {/* Upload Certificate */}

            <div className="form-group">
              <label>
                Upload Certificate
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setCertificateFile(
                    e.target.files[0]
                  )
                }
              />

              {certificateFile && (
                <p>
                  Selected file:{" "}
                  {certificateFile.name}
                </p>
              )}
            </div>

            {/* Buttons */}

            <div className="edit-actions">
              <button
                type="submit"
                className="update-skill-button"
              >
                {editingCertificate
                  ? "Update Certificate"
                  : "Add Certificate"}
              </button>

              {editingCertificate && (
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

        {/* Certificate List */}

        <div className="skill-list-card">
          <div className="card-header">
            <div>
              <h2>
                My Certificates
              </h2>

              <p>
                {certificates.length}{" "}
                certificate
                {certificates.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>

          {loading && (
            <p>
              Loading certificates...
            </p>
          )}

          {!loading &&
            certificates.length === 0 && (
              <p>
                No certificates added yet.
              </p>
            )}

          {!loading &&
            certificates.map(
              (certificate) => (
                <div
                  className="professional-skill"
                  key={certificate._id}
                >
                  <div>
                    <h3>
                      {certificate.title}
                    </h3>

                    <p>
                      Organization:{" "}
                      {
                        certificate.organization
                      }
                    </p>

                    <p>
                      Year:{" "}
                      {certificate.year}
                    </p>

                    {certificate.credentialId && (
                      <p>
                        <strong>
                          Credential ID:
                        </strong>{" "}
                        {
                          certificate.credentialId
                        }
                      </p>
                    )}

                    {/* Uploaded File */}

                    {certificate.certificateFile && (
                      <div>
                        <a
                          href={`http://localhost:5000${certificate.certificateFile}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Uploaded Certificate
                        </a>
                      </div>
                    )}

                    {/* Certificate Link */}

                    {certificate.certificateLink && (
                      <div>
                        <a
                          href={
                            certificate.certificateLink
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Certificate Link
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="skill-actions">
                    <button
                      className="edit-skill-button"
                      onClick={() =>
                        handleEdit(
                          certificate
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-skill-button"
                      onClick={() =>
                        handleDelete(
                          certificate._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
        </div>
      </main>
    </div>
  );
}

export default Certificates;