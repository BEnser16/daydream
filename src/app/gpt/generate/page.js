'use client'

import { useState } from 'react'

export default function GeneratePage() {
  const [messages, setMessages] = useState([
    // 為初始訊息提供一個穩定的字串 key
    { id: 'system-intro', sender: 'system', text: '🎭 劇情生成助手已就緒，隨便問我什麼都行～' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault()
      // 呼叫送出函式
      sendMessage()
    }
  }

  async function sendMessage() {
    if (!inputValue.trim() || isLoading) return

    // 清空輸入框
    const userPrompt = inputValue
    setInputValue('')
    setIsLoading(true)

    // 新增使用者訊息到聊天視窗
    const userMessage = { id: crypto.randomUUID(), sender: 'user', text: inputValue }
    setMessages((prev) => [...prev, userMessage])
    
    // 新增「生成中...」訊息
    const loadingId = crypto.randomUUID()
    setMessages(prev => [...prev, { id: loadingId, sender: 'ai', text: '生成中...' }])

    try {
      // 呼叫 GPT API
      const res = await fetch("/api/gpt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            prompt: userPrompt
          }
        ),
      });

      if (!res.ok) {
        console.error("API 呼叫失敗:", res.statusText);
        throw new Error('API 呼叫失敗')
      }

      const data = await res.json();
      
       // 更新剛剛的生成中訊息成真實回覆
      setMessages(prev =>
        prev.map(msg => (msg.id === loadingId ? { ...msg, text: data.result } : msg))
      )
    } catch (error) {
        console.error("生成失敗:", error)
        const errorMessage = {
          id: crypto.randomUUID(),
          sender: 'system',
          text: `生成失敗：${error.message}`
        }
        setMessages((prev) => [...prev, errorMessage])
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4 font-bold">劇情生成</div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border'
              } ${
                msg.sender === 'system' ? 'bg-gray-300' : '' // 特別為 system 訊息設計樣式
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 w-full p-3 bg-white border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
          type="text"
          placeholder="輸入訊息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          {isLoading ? '生成中...' : '發送'}
        </button>
      </div>
    </div>
  )
}