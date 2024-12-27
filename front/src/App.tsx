import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";

const API_URL = "http://localhost:3000";

type Task = {
  id: number;
  title: string;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const App = () => {
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const { data: tasks, error } = useSWR<Task[]>(`${API_URL}/tasks`, fetcher);

  const addTask = async (title: string) => {
    if (!title.trim()) return;
    await axios.post(`${API_URL}/tasks`, { title });
    mutate(`${API_URL}/tasks`);
    setNewTask("");
  };

  const editTask = async (id: number, title: string) => {
    if (!title.trim()) return;
    await axios.put(`${API_URL}/tasks/${id}`, { title });
    mutate(`${API_URL}/tasks`);
    setEditingTask(null);
  };

  const deleteTask = async (id: number) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    mutate(`${API_URL}/tasks`);
  };

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#d32f2f" }}>
        Error loading tasks
      </div>
    );
  if (!tasks)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
    );

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "30px",
          textAlign: "center",
          color: "#333",
        }}
      >
        Task Manager
      </h1>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 20px 0",
        }}
      >
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              padding: "12px 0",
              fontSize: "16px",
            }}
          >
            {editingTask?.id === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginRight: "10px",
                  }}
                />
                <button
                  onClick={() => editTask(task.id, editingTask.title)}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#43a047")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#4caf50")
                  }
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#757575",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#616161")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#757575")
                  }
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, marginRight: "10px", color: "#333" }}>
                  {task.title}
                </span>
                <button
                  onClick={() =>
                    setEditingTask({ id: task.id, title: task.title })
                  }
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#2196f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e88e5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2196f3")
                  }
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e53935")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f44336")
                  }
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => addTask(newTask)}
          style={{
            padding: "10px 16px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#43a047")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4caf50")
          }
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default App;
