'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function WorldbuildingEditorPage() {
  const { id } = useParams()
  const [block, setBlock] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchBlock = async () => {
      const res = await fetch(`/api/worldbuilding-blocks/${id}`)
      const data = await res.json()
      setBlock({
        ...data,
        title: data.title || '',
        content: data.content || '',
        category: data.category || '',
        tags: data.tags || [],
      });
    }
    fetchBlock()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/worldbuilding-blocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: block.title,
        content: block.content,
        category: block.category,
        tags: block.tags,
      }),
    })
    if (res.ok) {
      setStatus('✅ 已儲存！')
    } else {
      setStatus('❌ 儲存失敗')
    }
    setSaving(false)
    setTimeout(() => setStatus(''), 3000)
  }

  const handleDelete = async () => {
    const confirm = window.confirm('確定要刪除這個世界觀設定？')
    if (!confirm) return

    const res = await fetch(`/api/worldbuilding-blocks/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      window.location.href = '/worldbuilding' // 回到世界觀列表
    } else {
      alert('刪除失敗！')
    }
  }

  if (!block) return <div className="p-6">載入中...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">✍️ 編輯世界觀設定</h1>

      <input
        type="text"
        value={block.title}
        onChange={(e) => setBlock({ ...block, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        placeholder="標題"
      />
      
      <input
        type="text"
        value={block.category}
        onChange={(e) => setBlock({ ...block, category: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        placeholder="分類（例如：人物、地點、魔法）"
      />

      <textarea
        value={block.content}
        onChange={(e) => setBlock({ ...block, content: e.target.value })}
        className="w-full p-4 h-64 border rounded"
        placeholder="詳細內容..."
      />
      
      {/* 標籤功能可以根據你的需求做更複雜的 UI 處理，這裡先用簡單的文字輸入 */}
      <input
        type="text"
        value={block.tags.join(', ')}
        onChange={(e) => setBlock({ ...block, tags: e.target.value.split(',').map(tag => tag.trim()) })}
        className="w-full p-2 mb-4 border rounded"
        placeholder="標籤 (以逗號分隔)"
      />

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? '儲存中...' : '💾 儲存'}
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🗑️ 刪除設定
        </button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </div>
  )
}