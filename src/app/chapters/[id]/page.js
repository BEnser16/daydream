'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ChapterEditorPage() {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchChapter = async () => {
      const res = await fetch(`/api/chapters/${id}`)
      const data = await res.json()
      setChapter(data)
    }
    fetchChapter()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/chapters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: chapter.title,
        content: chapter.content,
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
    const confirm = window.confirm('確定要刪除這個章節？這個動作無法復原。')
    if (!confirm) return

    const res = await fetch(`/api/chapters/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      window.location.href = '/chapters' // 回作品列表
    } else {
      alert('刪除失敗！')
    }
  }


  if (!chapter) return <div className="p-6">載入中...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">✍️ 編輯章節</h1>

      <input
        type="text"
        value={chapter.title}
        onChange={(e) => setChapter({ ...chapter, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        placeholder="章節標題"
      />

      <textarea
        value={chapter.content}
        onChange={(e) => setChapter({ ...chapter, content: e.target.value })}
        className="w-full p-4 h-64 border rounded"
        placeholder="章節內容..."
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
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
        >
          🗑️ 刪除章節
        </button>
        <span className="text-sm text-gray-600">{status}</span>

      </div>
    </div>
  )
}
