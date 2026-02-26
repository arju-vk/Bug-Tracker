import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTickets } from "../context/TicketContext";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const {
    tickets,
    fetchTickets,
    createTicket,
    updateTicketStatus,
    deleteTicket,
    updateTicket,
    loading,
  } = useTickets();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
    type: "Bug",
    assignee: "",
  });
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
    search: "",
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { projectsAPI } = await import("../services/api");
        const res = await projectsAPI.getById(id);
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };
    fetchProjectDetails();
    fetchTickets(id);
    fetchUsers();
  }, [id]);

  const fetchUsers = async () => {
    try {
      const res = await authAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const ticketId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await updateTicketStatus(ticketId, newStatus);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await createTicket({
        ...newTicket,
        project: id,
        assignee: newTicket.assignee || null,
      });
      setShowCreateModal(false);
      setNewTicket({
        title: "",
        description: "",
        priority: "Medium",
        type: "Bug",
        assignee: "",
      });
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  const handleEditTicket = async (e) => {
    e.preventDefault();
    try {
      await updateTicket(editingTicket._id, {
        title: editingTicket.title,
        description: editingTicket.description,
        priority: editingTicket.priority,
        type: editingTicket.type,
        assignee: editingTicket.assignee || null,
      });
      setShowEditModal(false);
      setEditingTicket(null);
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete ticket:", err);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (
      filters.assignee &&
      (ticket.assignee?._id || ticket.assignee) !== filters.assignee
    )
      return false;
    if (
      filters.search &&
      !ticket.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const columns = ["To Do", "In Progress", "Done"];

  // Chart data
  const statusData = columns.map((col) => ({
    name: col,
    value: tickets.filter((t) => t.status === col).length,
  }));

  const priorityData = ["Critical", "High", "Medium", "Low"].map(
    (priority) => ({
      name: priority,
      value: tickets.filter((t) => t.priority === priority).length,
    }),
  );

  const assigneeData = users
    .map((u) => ({
      name: u.name,
      value: tickets.filter(
        (t) => t.assignee?._id === u._id || t.assignee === u._id,
      ).length,
    }))
    .filter((d) => d.value > 0);

  const typeData = ["Bug", "Feature", "Task", "Improvement"].map((type) => ({
    name: type,
    value: tickets.filter((t) => t.type === type).length,
  }));

  const COLORS = [
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#ec4899",
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-accent-rose/20 text-accent-rose border-accent-rose/30";
      case "High":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Medium":
        return "bg-accent-amber/20 text-accent-amber border-accent-amber/30";
      case "Low":
        return "bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30";
      default:
        return "bg-dark-600 text-dark-300 border-dark-500";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Bug":
        return "🐛";
      case "Feature":
        return "✨";
      case "Task":
        return "📋";
      case "Improvement":
        return "⬆️";
      default:
        return "📌";
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-dark-400">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-dark-400 hover:text-dark-200 transition-colors"
              >
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-dark-100">
                {project.name}
              </h1>
              <span className="text-sm font-mono bg-dark-700 text-dark-300 px-2 py-1 rounded">
                {project.key}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCharts(!showCharts)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  showCharts
                    ? "bg-accent-violet text-white"
                    : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                {showCharts ? "Hide Charts" : "View Charts"}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-accent-violet to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-accent-violet/25 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {showCharts && tickets.length > 0 && (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status Pie Chart */}
            <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-dark-100 mb-3">
                Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {statusData.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-1 text-xs"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-dark-400">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Pie Chart */}
            <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-dark-100 mb-3">
                Priority Distribution
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {priorityData.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-1 text-xs"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-dark-400">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Bar Chart */}
            <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-dark-100 mb-3">
                Type Distribution
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Assignee Bar Chart */}
            <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-dark-100 mb-3">
                Tickets by Assignee
              </h3>
              {assigneeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={assigneeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#9ca3af"
                      fontSize={10}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#e5e7eb" }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-dark-500 text-sm">
                  No assignee data
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2.5 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 pr-10 text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent cursor-pointer min-w-[140px]"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 pr-10 text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent cursor-pointer min-w-[140px]"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Assignee Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 pr-10 text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent cursor-pointer min-w-[140px]"
              value={filters.assignee}
              onChange={(e) =>
                setFilters({ ...filters, assignee: e.target.value })
              }
            >
              <option value="">All Assignees</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((column) => (
              <div
                key={column}
                className="bg-dark-800 rounded-xl p-4 border border-dark-700"
              >
                <h3 className="font-semibold text-dark-200 mb-4 flex items-center justify-between">
                  {column}
                  <span className="bg-dark-700 px-2 py-1 rounded-full text-sm text-dark-400">
                    {filteredTickets.filter((t) => t.status === column).length}
                  </span>
                </h3>
                <Droppable droppableId={column}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 min-h-[200px]"
                    >
                      {filteredTickets
                        .filter((ticket) => ticket.status === column)
                        .map((ticket, index) => (
                          <Draggable
                            key={ticket._id}
                            draggableId={ticket._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-dark-700/50 p-4 rounded-lg border border-dark-600 hover:border-accent-violet/50 hover:shadow-lg hover:shadow-accent-violet/5 transition-all group"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span className="text-xs font-mono text-dark-500">
                                    {ticket.ticketKey}
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTicket(ticket);
                                        setShowEditModal(true);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded bg-dark-600 text-dark-300 hover:bg-dark-500 transition-all"
                                      title="Edit Ticket"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm(ticket._id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded bg-accent-rose/20 text-accent-rose hover:bg-accent-rose/30 transition-all"
                                      title="Delete Ticket"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">
                                    {getTypeIcon(ticket.type)}
                                  </span>
                                  <h4 className="font-medium text-dark-100 flex-1">
                                    {ticket.title}
                                  </h4>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs px-2 py-1 rounded border ${getPriorityColor(ticket.priority)}`}
                                  >
                                    {ticket.priority}
                                  </span>
                                  {ticket.assignee && (
                                    <div className="w-6 h-6 bg-accent-violet rounded-full flex items-center justify-center text-xs text-white font-semibold">
                                      {ticket.assignee.name?.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-xl max-w-md w-full mx-4 border border-dark-700">
            <h2 className="text-xl font-bold mb-4 text-dark-100">
              Create New Ticket
            </h2>
            <form onSubmit={handleCreateTicket}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    value={newTicket.title}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    rows={3}
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                      value={newTicket.type}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, type: e.target.value })
                      }
                    >
                      <option value="Bug">Bug</option>
                      <option value="Feature">Feature</option>
                      <option value="Task">Task</option>
                      <option value="Improvement">Improvement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                      value={newTicket.priority}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Assignee
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    value={newTicket.assignee}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, assignee: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-accent-violet text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-xl max-w-md w-full mx-4 border border-dark-700">
            <h2 className="text-xl font-bold mb-4 text-dark-100">
              Edit Ticket
            </h2>
            <form onSubmit={handleEditTicket}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    value={editingTicket.title}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    rows={3}
                    value={editingTicket.description}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                      value={editingTicket.type}
                      onChange={(e) =>
                        setEditingTicket({
                          ...editingTicket,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="Bug">Bug</option>
                      <option value="Feature">Feature</option>
                      <option value="Task">Task</option>
                      <option value="Improvement">Improvement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                      value={editingTicket.priority}
                      onChange={(e) =>
                        setEditingTicket({
                          ...editingTicket,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Assignee
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    value={
                      editingTicket.assignee?._id ||
                      editingTicket.assignee ||
                      ""
                    }
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        assignee: e.target.value,
                      })
                    }
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTicket(null);
                  }}
                  className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-accent-violet text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-xl max-w-sm w-full mx-4 border border-dark-700">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-accent-rose/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-accent-rose"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-dark-100 text-center mb-2">
              Delete Ticket?
            </h3>
            <p className="text-dark-400 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTicket(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-accent-rose text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
