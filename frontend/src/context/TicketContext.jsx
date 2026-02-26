import { createContext, useContext, useState } from "react";
import { ticketsAPI, projectsAPI } from "../services/api";

const TicketContext = createContext(null);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getAll();
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const createProject = async (data) => {
    try {
      setLoading(true);
      const res = await projectsAPI.create(data);
      setProjects([...projects, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets by project
  const fetchTickets = async (projectId, filters = {}) => {
    try {
      setLoading(true);
      const res = await ticketsAPI.getByProject(projectId, filters);
      setTickets(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  // Create ticket
  const createTicket = async (data) => {
    try {
      setLoading(true);
      const res = await ticketsAPI.create(data);
      setTickets([...tickets, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update ticket
  const updateTicket = async (id, data) => {
    try {
      setLoading(true);
      const res = await ticketsAPI.update(id, data);
      setTickets(tickets.map((t) => (t._id === id ? res.data : t)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status (for Kanban)
  const updateTicketStatus = async (id, status) => {
    try {
      const res = await ticketsAPI.updateStatus(id, status);
      setTickets(tickets.map((t) => (t._id === id ? res.data : t)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket status");
      throw err;
    }
  };

  // Delete ticket
  const deleteTicket = async (id) => {
    try {
      setLoading(true);
      await ticketsAPI.delete(id);
      setTickets(tickets.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete ticket");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      setLoading(true);
      await projectsAPI.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tickets,
    projects,
    currentProject,
    loading,
    error,
    setCurrentProject,
    fetchProjects,
    fetchTickets,
    createTicket,
    updateTicket,
    updateTicketStatus,
    deleteTicket,
    deleteProject,
    createProject,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};
