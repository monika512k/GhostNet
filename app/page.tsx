import { auth } from "@/auth"
import { CheckSquare, LogOut, Users, Zap } from 'lucide-react'
import Link from "next/link"
import { redirect } from "next/navigation"
import CreateTodo from "./components/CreateTodo"
import { TodoProvider } from "./components/TodoContext"
import TodoList from "./components/TodoList"

export default async function Home() {
  const session = await auth()

  if (!session?.user) redirect("/api/auth/signin")

  const userId = session.user.id

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50"></div>
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
            <h1 className="text-5xl font-['Orbitron'] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transform -skew-x-6">
            GhostNet
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-['Rajdhani'] text-xl text-cyan-300">{session.user.name}</span>
              <Link
                href="/users"
                className="flex items-center gap-2 px-6 py-3 bg-blue-900/50 text-cyan-300 rounded-full hover:bg-blue-800/50 transition duration-300 ease-in-out transform hover:scale-105 border border-cyan-500/50"
              >
                <Users size={18} />
                <span className="hidden sm:inline font-['Rajdhani']">Operatives</span>
              </Link>
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 px-6 py-3 bg-red-900/50 text-red-300 rounded-full hover:bg-red-800/50 transition duration-300 ease-in-out transform hover:scale-105 border border-red-500/50"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline font-['Rajdhani']">Disconnect</span>
              </Link>
            </div>
          </div>

          <TodoProvider>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-6 shadow-lg transform transition duration-500 hover:scale-105 border border-cyan-500/30">
                <h2 className="text-3xl font-['Orbitron'] font-bold mb-6 flex items-center gap-3 text-cyan-300">
                  <Zap size={28} className="text-yellow-400" />
                  New Mission
                </h2>
                <CreateTodo userId={userId} />
              </div>
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 shadow-lg transform transition duration-500 hover:scale-105 border border-purple-500/30">
                <h2 className="text-3xl font-['Orbitron'] font-bold mb-6 flex items-center gap-3 text-purple-300">
                  <CheckSquare size={28} className="text-green-400" />
                  Active Missions
                </h2>
                <TodoList userId={userId} />
              </div>
            </div>
          </TodoProvider>
        </div>
      </div>
    </main>
  )
}