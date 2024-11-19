import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Crosshair, Network, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ChatComponent from './ChatComponent'

export default async function ChatPage({ params }: { params: Promise<{ receiverId: string }> }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  // Destructure receiverId properly
  const { receiverId } = await params

  const sender = session.user
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  })

  if (!receiver) {
    redirect('/users')
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Navigation */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-3 px-6 py-3 bg-blue-900/30 rounded-xl hover:bg-blue-800/40 transition duration-300 ease-in-out transform hover:scale-105 border border-cyan-500/30"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-['Rajdhani'] text-cyan-300">Return to Command Center</span>
            </Link>

            <div className="flex items-center gap-4">
              <Network className="w-6 h-6 text-purple-400 animate-pulse" />
              <h1 className="text-4xl font-['Orbitron'] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                SECURE LINK
              </h1>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mb-8 backdrop-blur-xl bg-black/30 rounded-2xl p-4 border border-cyan-500/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="font-['Rajdhani'] text-lg text-cyan-300">
                  Operative: {sender.name || 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Crosshair className="w-5 h-5 text-purple-400" />
                <span className="font-['Rajdhani'] text-lg text-purple-300">
                  Target: {receiver.name || 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="font-['Rajdhani'] text-lg text-yellow-300">
                  Connection: ENCRYPTED
                </span>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="backdrop-blur-xl bg-black/40 rounded-3xl shadow-2xl border border-cyan-500/20 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-purple-900 border-b border-cyan-500/20">
              <h2 className="text-2xl font-['Orbitron'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                TRANSMISSION ACTIVE
              </h2>
            </div>

            <ChatComponent
              senderId={sender.id}
              receiverId={receiverId}
              senderName={sender.name || 'UNKNOWN'}
              receiverName={receiver.name || 'UNKNOWN'}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
