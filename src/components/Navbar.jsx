import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

export const Navbar = () => {
    const { agendas, selectedAgenda, changeAgenda } = useContext(AppContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 shadow-sm">
            <div className="container">
                <Link to="/" className="navbar-brand mb-0 h1">
                    <i className="fas fa-address-book text-primary me-2"></i>
                    Contact List
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="fas fa-list me-1"></i> Contacts
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add-contact">
                                <i className="fas fa-user-plus me-1"></i> Add Contact
                            </Link>
                        </li>
                    </ul>
                    {agendas && agendas.length > 0 && (
                        <div className="d-flex">
                            <select
                                className="form-select"
                                value={selectedAgenda || ""}
                                onChange={(e) => changeAgenda(e.target.value)}
                                aria-label="Select agenda"
                            >
                                <option value="" disabled>Select agenda</option>
                                {agendas.map((agenda) => (
                                    <option key={agenda.id} value={agenda.slug}>
                                        {agenda.slug}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};