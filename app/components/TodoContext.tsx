// app/components/TodoContext.tsx
"use client";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface TodoContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  refreshTodos: (userId: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const refreshTodos = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/todos?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error refreshing todos:', error);
    }
  }, []); // Empty dependency array since it doesn't depend on any external values

  return (
    <TodoContext.Provider value={{ todos, setTodos, refreshTodos }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};