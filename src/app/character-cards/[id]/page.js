'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function CharacterCardEditorPage() {
  const { id } = useParams()
  const [card, setCard] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchCard = async () => {
      const res = await fetch(`/api/character-cards/${id}`)
      const data = await res.json()
      setCard(data)
    }
    fetchCard()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/character-cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: card.name,
        appearance: card.appearance,
        abilities: card.abilities,
        background: card.background,
        tags: card.tags,
        notes: card.notes,
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
    const confirm = window.confirm('確定要刪除這個角色卡？')
    if (!confirm) return

    const res = await fetch(`/api/character-cards/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      window.location.href = '/character-card' // 回到角色卡列表
    } else {
      alert('刪除失敗！')
    }
  }

  if (!card) return <div className="p-6">載入中...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">✍️ 編輯角色卡</h1>

      <input
        type="text"
        value={card.name}
        onChange={(e) => setCard({ ...card, name: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        placeholder="角色名稱"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={card.appearance}
          onChange={(e) => setCard({ ...card, appearance: e.target.value })}
          className="w-full p-4 h-40 border rounded"
          placeholder="外貌描述..."
        />
        <textarea
          value={card.abilities}
          onChange={(e) => setCard({ ...card, abilities: e.target.value })}
          className="w-full p-4 h-40 border rounded"
          placeholder="能力與技能..."
        />
      </div>

      <textarea
        value={card.background}
        onChange={(e) => setCard({ ...card, background: e.target.value })}
        className="w-full p-4 h-40 border rounded mt-4"
        placeholder="背景故事..."
      />

      <input
        type="text"
        value={Array.isArray(card.tags) ? card.tags.join(', ') : ''}
        onChange={(e) => setCard({ ...card, tags: e.target.value.split(',').map(tag => tag.trim()) })}
        className="w-full p-2 mb-4 border rounded mt-4"
        placeholder="標籤 (以逗號分隔)"
      />

      <textarea
        value={card.notes}
        onChange={(e) => setCard({ ...card, notes: e.target.value })}
        className="w-full p-4 h-40 border rounded"
        placeholder="備註..."
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
          🗑️ 刪除角色卡
        </button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </div>
  )
}