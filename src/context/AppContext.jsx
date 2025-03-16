import React, { createContext, useState, useEffect } from "react";

// API base URL
const API_URL = "https://playground.4geeks.com/contact";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [agendas, setAgendas] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all agendas
  const fetchAgendas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/agendas`);
      if (!response.ok) {
        throw new Error("Failed to fetch agendas");
      }
      const data = await response.json();
      setAgendas(data.agendas);
      
      // If we have agendas but none selected, select the first one
      if (data.agendas.length > 0 && !selectedAgenda) {
        setSelectedAgenda(data.agendas[0].slug);
        fetchContacts(data.agendas[0].slug);
      }
      
      // If we have no agendas, attempt to create a default one
      if (data.agendas.length === 0) {
        try {
          await createAgenda("default");
        } catch (error) {
          console.error("Error creating default agenda:", error);
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching agendas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts for a specific agenda
  const fetchContacts = async (agendaSlug) => {
    if (!agendaSlug) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/agendas/${agendaSlug}/contacts`);
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new agenda
  const createAgenda = async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/agendas/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to create agenda");
      }
      const data = await response.json();
      setAgendas([...agendas, data]);
      setSelectedAgenda(data.slug);
      fetchContacts(data.slug);
      return data;
    } catch (error) {
      setError(error.message);
      console.error("Error creating agenda:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete an agenda
  const deleteAgenda = async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/agendas/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete agenda");
      }
      // Remove the deleted agenda from state
      setAgendas(agendas.filter(agenda => agenda.slug !== slug));
      // If the deleted agenda was selected, select another one
      if (selectedAgenda === slug) {
        if (agendas.length > 0) {
          const newSelectedAgenda = agendas.find(agenda => agenda.slug !== slug)?.slug;
          setSelectedAgenda(newSelectedAgenda);
          if (newSelectedAgenda) fetchContacts(newSelectedAgenda);
        } else {
          setSelectedAgenda(null);
          setContacts([]);
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new contact
  const createContact = async (contact) => {
    if (!selectedAgenda) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/agendas/${selectedAgenda}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });
      if (!response.ok) {
        throw new Error("Failed to create contact");
      }
      const data = await response.json();
      setContacts([...contacts, data]);
      return data;
    } catch (error) {
      setError(error.message);
      console.error("Error creating contact:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing contact
  const updateContact = async (contactId, updatedContact) => {
    if (!selectedAgenda) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/agendas/${selectedAgenda}/contacts/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedContact),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update contact");
      }
      const data = await response.json();
      // Update the contacts state with the updated contact
      setContacts(
        contacts.map((contact) => (contact.id === contactId ? data : contact))
      );
      return data;
    } catch (error) {
      setError(error.message);
      console.error("Error updating contact:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact
  const deleteContact = async (contactId) => {
    if (!selectedAgenda) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/agendas/${selectedAgenda}/contacts/${contactId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      // Remove the deleted contact from the state
      setContacts(contacts.filter((contact) => contact.id !== contactId));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting contact:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change the selected agenda
  const changeAgenda = (slug) => {
    setSelectedAgenda(slug);
    fetchContacts(slug);
  };

  // When selected agenda changes, fetch its contacts
  useEffect(() => {
    if (selectedAgenda) {
      fetchContacts(selectedAgenda);
    }
  }, [selectedAgenda]);

  const store = {
    agendas,
    contacts,
    selectedAgenda,
    loading,
    error,
    fetchAgendas,
    fetchContacts,
    createAgenda,
    deleteAgenda,
    createContact,
    updateContact,
    deleteContact,
    changeAgenda,
  };

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
};