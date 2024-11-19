"use client";

import {
  Check,
  Database,
  Edit2,
  Loader2,
  RefreshCw,
  Shield,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTodos } from "./TodoContext";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoListProps {
  userId: string;
}

export default function TodoList({ userId }: TodoListProps) {
  const { todos, setTodos, refreshTodos } = useTodos();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true);
        await refreshTodos(userId);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, [userId, refreshTodos]);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(`/api/todos?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, [userId, setTodos]);

  const toggleCompletion = async (todoId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !currentStatus } : todo
        )
      );
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = (todoId: string, currentTitle: string) => {
    setEditingTodoId(todoId);
    setEditedTitle(currentTitle);
  };

  const handleUpdate = async (todoId: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo title");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, title: editedTitle } : todo
        )
      );

      setEditingTodoId(null);
      setEditedTitle("");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-900/30 border border-red-500/50 rounded-lg backdrop-blur-xl">
        <h2 className="text-lg font-['Orbitron'] text-red-400 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          SYSTEM FAILURE
        </h2>
        <p className="text-red-300 font-['Rajdhani']">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Header Section */}
      <div className="backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-cyan-500/20 mb-8">
        <div className="flex justify-between items-center flex-col">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-['Orbitron'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              MISSION OBJECTIVES
            </h2>
          </div>
          <button
            onClick={() => refreshTodos(userId)}
            className="group flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-lg hover:bg-blue-800/40 transition duration-300 border border-cyan-500/30"
          >
            <RefreshCw className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-['Rajdhani'] text-cyan-300">SYNC</span>
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="backdrop-blur-xl bg-black/40 rounded-3xl shadow-2xl border border-cyan-500/20 overflow-hidden">
        <div className="p-6">
          {todos.length === 0 ? (
            <div className="text-cyan-300 text-center py-8 font-['Rajdhani']">
              NO ACTIVE OBJECTIVES FOUND
            </div>
          ) : (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    todo.completed
                      ? "bg-green-900/20 border border-green-500/30"
                      : "bg-blue-900/20 border border-cyan-500/30"
                  } hover:border-cyan-400/50 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      {editingTodoId === todo.id ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full px-4 py-2 bg-black/50 text-cyan-300 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 font-['Rajdhani']"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleUpdate(todo.id)
                          }
                        />
                      ) : (
                        <span
                          className={`font-['Rajdhani'] text-lg ${
                            todo.completed
                              ? "line-through text-green-400"
                              : "text-cyan-300"
                          }`}
                        >
                          {todo.title}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      {editingTodoId === todo.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(todo.id)}
                            className="text-green-400 hover:text-green-300 transition-colors duration-200"
                            aria-label="Save changes"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingTodoId(null)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            aria-label="Cancel editing"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(todo.id, todo.title)}
                            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                            aria-label="Edit objective"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              toggleCompletion(todo.id, todo.completed)
                            }
                            className={`transition-colors duration-200 ${
                              todo.completed
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-green-400 hover:text-green-300"
                            }`}
                            disabled={todo.completed}
                            aria-label={
                              todo.completed
                                ? "Objective completed"
                                : "Mark as complete"
                            }
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            aria-label="Delete objective"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
