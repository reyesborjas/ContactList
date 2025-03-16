import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const AddContact = () => {
  const { createContact, updateContact, contacts, selectedAgenda } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const contactToEdit = contacts.find(c => c.id === parseInt(id));
      if (contactToEdit) {
        setContact({
          name: contactToEdit.name || "",
          email: contactToEdit.email || "",
          phone: contactToEdit.phone || "",
          address: contactToEdit.address || ""
        });
      } else {
        setError("Contact not found");
      }
    }
  }, [isEditing, id, contacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prevContact => ({
      ...prevContact,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!contact.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!selectedAgenda) {
      setError("Please select an agenda first");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateContact(parseInt(id), contact);
      } else {
        await createContact(contact);
      }
      navigate("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white py-3">
              <h1 className="card-title fs-4 mb-0">{isEditing ? "Edit Contact" : "Add New Contact"}</h1>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {!selectedAgenda ? (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <p className="mb-0">Please select an agenda first to add contacts</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-bold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={contact.name}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-bold">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={contact.email}
                        onChange={handleChange}
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label fw-bold">
                      Phone
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={contact.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="address" className="form-label fw-bold">
                      Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        value={contact.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Address"
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/")}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {isEditing ? "Saving..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          {isEditing ? "Save Changes" : "Save Contact"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;