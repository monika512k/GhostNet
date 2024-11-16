// app/components/CreateTodo.tsx
'use client';

import { useState } from 'react';
import { useTodos } from './TodoContext';

export default function CreateTodo({ userId }: { userId: string }) {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { refreshTodos } = useTodos();

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return;

    try {
      setIsCreating(true);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId }),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      
      setTitle('');
      await refreshTodos(userId);
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new Todo"
        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        disabled={isCreating}
      />
      <button
        onClick={handleCreate}
        disabled={isCreating}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isCreating ? 'Creating...' : 'Create'}
      </button>
    </div>
  );
}
