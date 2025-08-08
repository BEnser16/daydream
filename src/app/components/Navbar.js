'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">🧠 白日夢產生器</Link>
      <div className="space-x-4">
        <Link href="/chapters" className="text-gray-700 hover:text-blue-600">📚 章節清單</Link>
        <Link href="/characters" className="text-gray-700 hover:text-blue-600">🧑‍🎨 角色卡</Link>
        <Link href="/worldbuilding" className="text-gray-700 hover:text-blue-600">🌍 世界觀</Link>
        <Link href="/plot" className="text-gray-700 hover:text-blue-600">🎭 劇情生成</Link>
      </div>
    </nav>
  )
}
