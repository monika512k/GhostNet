'use client'

import { Loader, PlusCircle, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useTodos } from './TodoContext'

export default function CreateTodo({ userId }: { userId: string }) {
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { refreshTodos } = useTodos()

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return

    try {
      setIsCreating(true)
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId }),
      })

      if (!response.ok) throw new Error('Failed to create todo')
      
      setTitle('')
      await refreshTodos(userId)
    } catch (error) {
      console.error('Error creating todo:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Terminal Icon */}
        <Terminal 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 transition-colors duration-300 group-hover:text-cyan-300" 
        />
        
        {/* Input Field */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Initialize new mission directive..."
          className="w-full pl-12 pr-12 py-4 bg-black/50 border border-cyan-500/30 rounded-xl 
                   text-cyan-300 placeholder-cyan-700 font-['Rajdhani'] text-lg
                   focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 
                   transition-all duration-300 ease-in-out backdrop-blur-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          disabled={isCreating}
        />

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30
                     text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/30 
                     focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 ease-in-out group-hover:scale-105"
          aria-label={isCreating ? 'Initializing mission...' : 'Initialize mission'}
        >
          {isCreating ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
        </button>

        {/* Decorative Elements */}
        <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 rounded-xl 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>

      {/* Loading State */}
      {isCreating && (
        <div className="mt-3 text-center">
          <p className="font-['Rajdhani'] text-cyan-400 text-sm animate-pulse">
            (// INITIALIZING MISSION PARAMETERS...)
          </p>
        </div>
      )}

      {/* Decorative Lines */}
      <div className="absolute left-0 right-0 -bottom-4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      <div className="absolute left-0 right-0 -bottom-6 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
    </div>
  )
}