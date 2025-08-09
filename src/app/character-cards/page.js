'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CharacterCardsPage() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ❗ 根據你的 user_id 修改
  const userId = '70ad7f30-ca8f-4156-b4c0-de27164d6095'

  useEffect(() => {
    const fetchCards = async () => {
      const res = await fetch(`/api/character-cards?user_id=${userId}`)
      const data = await res.json()
      setCards(data)
    }
    fetchCards()
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    const res = await fetch('/api/character-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        name: '新角色',
        appearance: '',
        abilities: '',
        background: '',
        tags: [],
        notes: ''
      }),
    })
    const newCard = await res.json()
    router.push(`/character-cards/${newCard.id}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎭 角色卡總覽</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? '新增中...' : '➕ 新增角色'}
      </button>

      <div className="mt-6 space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => router.push(`/character-cards/${card.id}`)}
            className="cursor-pointer p-4 border border-gray-300 rounded hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{card.name || '(無標題)'}</h2>
            <p className="text-sm text-gray-500">{card.tags.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}