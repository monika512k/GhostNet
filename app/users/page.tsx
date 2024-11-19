import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Mail, MessageSquare, UserIcon, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getUsers(currentUserId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        // Exclude current user from the results
        NOT: {
          id: currentUserId
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        _count: {
          select: {
            todos: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export default async function UsersPage() {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')
  
  // Get all users except the current user
  const users = await getUsers(session.user.id)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/hexagon-pattern.svg')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-40"></div>
      <main className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col">
            <h1 className="text-4xl font-['Orbitron'] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center transform -skew-x-6">
              <Users className="w-10 h-10 mr-3 text-cyan-400" />
              <span>OPERATIVE NETWORK</span>
            </h1>
            <p className="text-cyan-300 font-['Rajdhani'] mt-2 ml-14">
              Active Agent: {session.user.name || 'UNKNOWN OPERATIVE'}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-900/30 rounded-full hover:bg-blue-800/50 transition-all duration-300 ease-in-out text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-['Rajdhani'] text-lg">Return to Base</span>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 ease-in-out overflow-hidden border border-gray-700/50 group hover:border-cyan-500/50"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'Operative'}
                      width={80}
                      height={80}
                      className="rounded-2xl border-2 border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border-2 border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300">
                      <UserIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-['Orbitron'] font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
                      {user.name || 'Unnamed Operative'}
                    </h2>
                    <p className="text-gray-400 flex items-center mt-1 font-['Rajdhani']">
                      <Mail className="w-4 h-4 mr-1 text-purple-400" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 font-['Rajdhani']">
                  <span className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1 text-blue-400" />
                    ID: {user.id.slice(0, 8)}...
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1 text-green-400" />
                    Missions: {user._count.todos}
                  </span>
                </div>
                <Link 
                  href={`/chat/${user.id}`}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-['Rajdhani'] text-lg font-bold uppercase tracking-wider"
                >
                  <span className="flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Initiate Comms
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center text-gray-400 mt-16 p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50">
            <Users className="w-20 h-20 mx-auto text-cyan-500 mb-4" />
            <p className="text-2xl font-['Orbitron']">No other operatives found in the system.</p>
          </div>
        )}
      </main>
    </div>
  )
}