'use client'
import { useState } from 'react'

export default function CharacterCardForm() {
  const userId = '70ad7f30-ca8f-4156-b4c0-de27164d6095'

  const [formData, setFormData] = useState({
    name: '',
    appearance: '',
    abilities: '',
    background: '',
    // ⚠️ tags 這裡使用空字串，因為它會對應到輸入框
    tags: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // ✅ 核心改動：在發送前將 tags 字串轉換成陣列
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '') // 過濾掉空字串，確保不會有 malformed array literal 錯誤

    const payload = {
      user_id: userId,
      name: formData.name,
      appearance: formData.appearance,
      abilities: formData.abilities,
      background: formData.background,
      tags: tagsArray, // 使用轉換後的陣列
      notes: formData.notes,
    }

    const res = await fetch('/api/character-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('角色建立成功！')
      // 重設表單時，tags 也改回空字串
      setFormData({
        name: '',
        appearance: '',
        abilities: '',
        background: '',
        tags: '',
        notes: '',
      })
    } else {
      setMessage(`建立失敗：${result.error}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">新增角色卡</h2>

      <input name="name" value={formData.name} onChange={handleChange} placeholder="角色名稱" className="input" required />

      <textarea name="appearance" value={formData.appearance} onChange={handleChange} placeholder="外貌描述" className="textarea" />

      <textarea name="abilities" value={formData.abilities} onChange={handleChange} placeholder="能力說明" className="textarea" />

      <textarea name="background" value={formData.background} onChange={handleChange} placeholder="背景故事" className="textarea" />

      <input name="tags" value={formData.tags} onChange={handleChange} placeholder="標籤（逗號分隔）" className="input" />

      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="備註" className="textarea" />

      <button type="submit" disabled={loading} className="btn">
        {loading ? '提交中...' : '新增角色'}
      </button>

      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
  )
}