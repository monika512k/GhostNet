import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CreateTodo from './components/CreateTodo';
import { TodoProvider } from './components/TodoContext';
import TodoList from './components/TodoList';

export default async function Home() {
  const session = await auth();

  if (!session?.user) return redirect('/api/auth/signin');

  const userId = session.user.id;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="flex items-center gap-3">
          <span>{session.user.name}</span>
          <Link
            href="/api/auth/signout"
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Sign Out
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href={`/reminder/${userId}`} 
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">View Reminders</h2>
          <p className="text-gray-600">Check your existing reminders</p>
        </Link>

        <Link 
          href={`/reminder/${userId}/create`} 
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Create Reminder</h2>
          <p className="text-gray-600">Set up a new reminder</p>
        </Link>
      </div>

      <TodoProvider>
        <div className="mb-6 border rounded-lg p-4 shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Add a New Todo</h2>
          <CreateTodo userId={userId} />
        </div>
        <div className="border rounded-lg p-4 shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
          <TodoList userId={userId} />
        </div>
      </TodoProvider>
    </div>
  );
}
