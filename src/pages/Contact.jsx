import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import ContactCard from "../components/ContactCard.jsx";

const Contact = () => {
  const { contacts, agendas, selectedAgenda, createAgenda, error, fetchAgendas, fetchContacts } = useContext(AppContext);
  const [newAgendaSlug, setNewAgendaSlug] = useState("");
  const [showCreateAgendaForm, setShowCreateAgendaForm] = useState(false);

  // Fetch agendas and contacts when component mounts
  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleCreateAgenda = async (e) => {
    e.preventDefault();
    if (!newAgendaSlug.trim()) return;

    try {
      await createAgenda(newAgendaSlug);
      setNewAgendaSlug("");
      setShowCreateAgendaForm(false);
    } catch (error) {
      console.error("Failed to create agenda:", error);
    }
  };

  return (
    <div className="container">
      <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0">My Contacts</h1>
            <p className="text-muted mb-0">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''} {selectedAgenda ? `in ${selectedAgenda} agenda` : ''}
            </p>
          </div>
          <div className="d-flex gap-2">
            {showCreateAgendaForm ? (
              <form onSubmit={handleCreateAgenda} className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Agenda name"
                  value={newAgendaSlug}
                  onChange={(e) => setNewAgendaSlug(e.target.value)}
                />
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-check me-1"></i> Save
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCreateAgendaForm(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </form>
            ) : (
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowCreateAgendaForm(true)}
              >
                <i className="fas fa-folder-plus me-1"></i> New Agenda
              </button>
            )}
            <Link to="/add-contact" className="btn btn-primary">
              <i className="fas fa-user-plus me-1"></i> Add Contact
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i> {error}
        </div>
      )}

      {agendas.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <p className="mb-2">No agendas found. Create one to start adding contacts.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateAgendaForm(true)}
          >
            <i className="fas fa-folder-plus me-1"></i> Create Agenda
          </button>
        </div>
      ) : selectedAgenda && contacts.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <p className="mb-2">No contacts in this agenda. Add your first contact!</p>
          <Link to="/add-contact" className="btn btn-primary">
            <i className="fas fa-user-plus me-1"></i> Add Contact
          </Link>
        </div>
      ) : (
        <div className="row">
          {contacts.map((contact) => (
            <div key={contact.id} className="col-md-6 col-lg-4 mb-3">
              <ContactCard contact={contact} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contact;