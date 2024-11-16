// app/page.tsx
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CreateTodo from './components/CreateTodo';
import { TodoProvider } from './components/TodoContext';
import TodoList from './components/TodoList';

export default async function Home() {
  const session = await auth();

  if (!session?.user) redirect('/api/auth/signin');

  const userId = session.user.id;

  return (
    <main className="max-w-2xl mx-auto p-6">
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
    </main>
  );
}