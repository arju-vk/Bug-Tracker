import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTickets } from "../context/TicketContext";

const Dashboard = () => {
  const { projects, fetchProjects, createProject, deleteProject, loading } =
    useTickets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    key: "",
  });
  const [ticketStats, setTicketStats] = useState({ status: [], priority: [] });
  const [projectTickets, setProjectTickets] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchAllTickets = async () => {
      const stats = { status: [], priority: [] };
      const ticketData = {};

      for (const project of projects) {
        try {
          const { ticketsAPI } = await import("../services/api");
          const res = await ticketsAPI.getByProject(project._id);
          ticketData[project._id] = res.data;

          res.data.forEach((ticket) => {
            const statusIdx = stats.status.findIndex(
              (s) => s.name === ticket.status,
            );
            if (statusIdx >= 0) {
              stats.status[statusIdx].value++;
            } else {
              stats.status.push({ name: ticket.status, value: 1 });
            }

            const priorityIdx = stats.priority.findIndex(
              (p) => p.name === ticket.priority,
            );
            if (priorityIdx >= 0) {
              stats.priority[priorityIdx].value++;
            } else {
              stats.priority.push({ name: ticket.priority, value: 1 });
            }
          });
        } catch (err) {
          console.error("Failed to fetch tickets for project:", project._id);
        }
      }

      setTicketStats(stats);
      setProjectTickets(ticketData);
    };

    if (projects.length > 0) {
      fetchAllTickets();
    }
  }, [projects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const project = await createProject(newProject);
      navigate(`/project/${project._id}`);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const COLORS = [
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#ec4899",
  ];

  const getProjectTicketCount = (projectId) => {
    return projectTickets[projectId]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-dark-100">Projects</h1>
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
              Create Project
            </button>
          </div>

          {/* Charts Section */}
          {(ticketStats.status.length > 0 ||
            ticketStats.priority.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {ticketStats.status.length > 0 && (
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-dark-100 mb-4">
                    Ticket Status Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={ticketStats.status}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {ticketStats.status.map((entry, index) => (
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {ticketStats.priority.length > 0 && (
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-dark-100 mb-4">
                    Ticket Priority Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={ticketStats.priority}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {ticketStats.priority.map((entry, index) => (
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {loading && projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-dark-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-dark-400 mb-4">
                No projects yet. Create your first project!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-accent-violet to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-accent-violet/25"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-dark-800 border border-dark-700 p-6 rounded-xl hover:border-accent-violet hover:shadow-lg hover:shadow-accent-violet/10 transition-all relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono bg-dark-700 text-dark-300 px-2 py-1 rounded">
                      {project.key}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteConfirm(project._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-accent-rose/20 text-accent-rose hover:bg-accent-rose/30 transition-all"
                        title="Delete Project"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                  <Link to={`/project/${project._id}`}>
                    <h3 className="text-lg font-semibold text-dark-100 mb-2 hover:text-accent-violet transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-dark-400 text-sm">
                      {project.description || "No description"}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-dark-500">
                      <span>{project.members?.length || 1} member(s)</span>
                      <span className="bg-accent-violet/20 text-accent-violet px-2 py-0.5 rounded text-xs">
                        {getProjectTicketCount(project._id)} tickets
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-xl max-w-md w-full mx-4 border border-dark-700">
            <h2 className="text-xl font-bold mb-4 text-dark-100">
              Create New Project
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Project Key
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="e.g. PROJ"
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 uppercase focus:outline-none focus:ring-2 focus:ring-accent-violet"
                    value={newProject.key}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        key: e.target.value.toUpperCase(),
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
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                  />
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
              Delete Project?
            </h3>
            <p className="text-dark-400 text-center mb-6">
              This action cannot be undone. All tickets in this project will
              also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirm)}
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

export default Dashboard;
