import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import PropTypes from "prop-types";

const ContactCard = ({ contact }) => {
  const { deleteContact } = useContext(AppContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteContact(contact.id);
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <div className="card mb-3 shadow-sm border-0 h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <div className="bg-light rounded-circle p-3 me-3 text-center" style={{ width: "60px", height: "60px" }}>
                <span className="fs-4">{contact.name?.charAt(0).toUpperCase() || "?"}</span>
              </div>
              <h5 className="card-title mb-0">{contact.name}</h5>
            </div>
            <div>
              <Link
                to={`/edit-contact/${contact.id}`}
                className="btn btn-sm btn-outline-primary me-2"
              >
                <i className="fas fa-edit"></i> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-outline-danger"
              >
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </div>
          <div className="card-text ps-2 border-start border-3 border-primary">
            {contact.address && (
              <p className="mb-2 text-muted">
                <i className="fas fa-map-marker-alt me-2"></i>
                {contact.address}
              </p>
            )}
            {contact.phone && (
              <p className="mb-2 text-muted">
                <i className="fas fa-phone me-2"></i>
                {contact.phone}
              </p>
            )}
            {contact.email && (
              <p className="mb-2 text-muted">
                <i className="fas fa-envelope me-2"></i>
                {contact.email}
              </p>
            )}
            {!contact.address && !contact.phone && !contact.email && (
              <p className="mb-2 text-muted fst-italic">No additional information</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isDeleting}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the contact{" "}
                  <strong>{contact.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ContactCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string
  }).isRequired
};

export default ContactCard;