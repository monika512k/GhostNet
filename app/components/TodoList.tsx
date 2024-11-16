"use client";

import { useEffect, useState } from "react";
import { useTodos } from './TodoContext';

// Define the Todo type
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
  }, [userId]);

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
  }, [userId]);

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
    return <div className="text-center text-gray-500">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">Your Todos</h2>
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center">No todos found.</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`p-3 border rounded-md flex justify-between items-center ${
                todo.completed ? "bg-green-50" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <div className="flex-1">
                {editingTodoId === todo.id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full border px-2 py-1 rounded focus:outline-none"
                  />
                ) : (
                  <span
                    className={`text-gray-800 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {editingTodoId === todo.id ? (
                  <button
                    className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                    onClick={() => handleUpdate(todo.id)}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="text-sm px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    onClick={() => handleEdit(todo.id, todo.title)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={`text-sm px-3 py-1 rounded ${
                    todo.completed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => toggleCompletion(todo.id, todo.completed)}
                  disabled={todo.completed}
                >
                  {todo.completed ? "Completed" : "Mark Complete"}
                </button>
                <button
                  className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
