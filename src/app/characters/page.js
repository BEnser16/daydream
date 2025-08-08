'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CharacterListPage() {
  const [characters, setCharacters] = useState([])
  const userId = '70ad7f30-ca8f-4156-b4c0-de27164d6095'


  useEffect(() => {
    fetch(`/api/character-cards?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setCharacters(data))
      .catch(err => console.error('Fetch characters failed', err))
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">角色清單</h1>
        <Link
          href="/characters/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ 新增角色
        </Link>
      </div>

      {characters.length === 0 ? (
        <p className="text-gray-500">目前沒有角色卡。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {characters.map((char) => (
            <Link key={char.id} href={`/characters/${char.id}`}>
              <div className="p-4 border rounded shadow hover:shadow-md transition">
                <h2 className="text-lg font-semibold">{char.name}</h2>
                <p className="text-sm text-gray-600">{char.race} / {char.role}</p>
                <p className="text-sm text-blue-500">屬性：{char.affinity}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
