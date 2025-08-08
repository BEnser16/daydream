'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WorldbuildingPage() {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ❗ 根據你的 user_id 修改
  const userId = '70ad7f30-ca8f-4156-b4c0-de27164d6095'

  useEffect(() => {
    const fetchBlocks = async () => {
      const res = await fetch(`/api/worldbuilding-blocks?user_id=${userId}`)
      const data = await res.json()
      setBlocks(data)
    }
    fetchBlocks()
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    const res = await fetch('/api/worldbuilding-blocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '新世界觀區塊',
        content: '',
        category: '未分類',
        tags: [],
        user_id: userId,
      }),
    })
    const newBlock = await res.json()
    router.push(`/worldbuilding/${newBlock.id}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🗺️ 世界觀設定</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? '新增中...' : '➕ 新增設定'}
      </button>

      <div className="mt-6 space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            onClick={() => router.push(`/worldbuilding/${block.id}`)}
            className="cursor-pointer p-4 border border-gray-300 rounded hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{block.title || '(無標題)'}</h2>
            <p className="text-sm text-gray-500">分類：{block.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}