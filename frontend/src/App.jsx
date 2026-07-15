import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Configurable backend API target
  const [backendInput, setBackendInput] = useState(
    localStorage.getItem('backendUrl') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  );
  const [backendUrl, setBackendUrl] = useState(backendInput);

  // Application data & status state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [latency, setLatency] = useState(null);
  const [env, setEnv] = useState('unknown');

  // New task form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Trigger re-fetch on API URL changes
  useEffect(() => {
    checkHealth();
    fetchTasks();
  }, [backendUrl]);

  const checkHealth = async () => {
    setBackendStatus('Checking...');
    const startTime = performance.now();
    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const endTime = performance.now();

      if (response.ok) {
        const data = await response.json();
        setBackendStatus('Running');
        setEnv(data.environment || 'production');
        setLatency(Math.round(endTime - startTime));
      } else {
        setBackendStatus('Stopped');
        setLatency(null);
      }
    } catch (err) {
      setBackendStatus('Stopped');
      setLatency(null);
      setEnv('unknown');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/items`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to retrieve tasks.');
      }
    } catch (err) {
      console.error('Failed to connect to backend api:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('backendUrl', backendInput);
    setBackendUrl(backendInput);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, description, completed })
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setName('');
        setDescription('');
        setCompleted(false);
      }
    } catch (err) {
      alert('Error creating task. Make sure the backend server is reachable.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/items/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (err) {
      alert('Error deleting task.');
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <h1>Automated GitOps CRUD Dashboard</h1>
          <p>S3/CloudFront Static Frontend connected to FastAPI Docker Backend on EC2</p>
        </div>
      </header>

      {/* Config Control Panel */}
      <div className="config-panel" style={{ marginBottom: '2.5rem' }}>
        <label htmlFor="backend-url-input">Backend URL:</label>
        <form onSubmit={handleSaveConfig} className="config-input-wrapper">
          <input
            id="backend-url-input"
            type="text"
            className="config-input"
            value={backendInput}
            onChange={(e) => setBackendInput(e.target.value)}
            placeholder="http://localhost:8000"
          />
          <button type="submit" className="btn-save">
            Save
          </button>
        </form>
      </div>

      {/* Stats Section */}
      <section className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Backend Status</span>
            <div className={`stat-icon status ${backendStatus === 'Running' ? 'running' : backendStatus === 'Stopped' ? 'stopped' : 'checking'}`}>
              ●
            </div>
          </div>
          <div>
            <div className="stat-value">{backendStatus}</div>
            <div className="stat-desc">Ping test to /health</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Environment</span>
            <div className="stat-icon env">
              ☁
            </div>
          </div>
          <div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>
              {env}
            </div>
            <div className="stat-desc">FastAPI settings context</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">API Response Latency</span>
            <div className="stat-icon latency">
              ⚡
            </div>
          </div>
          <div>
            <div className="stat-value">
              {latency !== null ? `${latency} ms` : 'N/A'}
            </div>
            <div className="stat-desc">HTTP request roundtrip time</div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Create Task Form */}
        <div className="panel-card">
          <h2 className="panel-title">Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label htmlFor="task-name">Task Name</label>
              <input
                id="task-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter task name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <span>Mark as Completed</span>
              </label>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="panel-card">
          <h2 className="panel-title">Tasks List</h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              No tasks found. Create a new task to get started!
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <div className="task-title-row">
                      <span className={`task-name ${task.completed ? 'completed' : ''}`}>
                        {task.name}
                      </span>
                      <span className={`badge ${task.completed ? 'done' : 'pending'}`}>
                        {task.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                    {task.description && <p className="task-desc">{task.description}</p>}
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
