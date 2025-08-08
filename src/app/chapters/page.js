'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChaptersPage() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // TODO: 根據你的 user_id 修改
  const userId = '70ad7f30-ca8f-4156-b4c0-de27164d6095'

  useEffect(() => {
    const fetchChapters = async () => {
      const res = await fetch(`/api/chapters?user_id=${userId}`)
      const data = await res.json()
      setChapters(data)
    }
    fetchChapters()
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    const res = await fetch('/api/chapters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '新章節', content: '', user_id: userId }),
    })
    const newChapter = await res.json()
    router.push(`/chapters/${newChapter.id}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📚 章節總覽</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? '新增中...' : '➕ 新增章節'}
      </button>

      <div className="mt-6 space-y-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            onClick={() => router.push(`/chapters/${chapter.id}`)}
            className="cursor-pointer p-4 border border-gray-300 rounded hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{chapter.title || '(無標題章節)'}</h2>
            <p className="text-sm text-gray-500">{chapter.id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
