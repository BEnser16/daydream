'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [chapters, setChapters] = useState([])
  const userId = '70ad7f30-ca8f-4156-b4c0-de27164d6095'

  useEffect(() => {
    const fetchChapters = async () => {
      const res = await fetch(`/api/chapters?user_id=${userId}`)
      const data = await res.json()
      setChapters(data.slice(0, 3))
    }

    fetchChapters()
  }, [])

  return (
    <>
      {/* Main content */}
      <main className="p-6">
        <p className="text-gray-600 mb-8">歡迎來到你的自爽創作空間，開始搞事吧 💥</p>

        <div className="mb-8 flex gap-4">
          <Link
            href="/chapters/new"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ 開始寫一章
          </Link>

          <Link
            href="/chapters"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            📚 章節清單
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-4">📖 最近寫的章節</h2>
        {chapters.length === 0 ? (
          <p className="text-gray-500">你還沒有章節喔～快去寫一篇吧 📝</p>
        ) : (
          <ul className="space-y-4">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="border p-4 rounded shadow hover:bg-gray-50">
                <Link href={`/chapters/${chapter.id}`} className="text-xl font-semibold hover:underline">
                  {chapter.title || '（無標題章節）'}
                </Link>
                <p className="text-sm text-gray-500">{new Date(chapter.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
