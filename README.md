# 白日夢小說生成器

一個專門生成小說用來自爽的生成器。

支援角色卡、世界觀設定、章節儲存，以及 GPT 助手。

## 功能特色

* 📇 **角色卡**：快速建立角色資料，含外觀、性格、背景。
* 🌍 **世界觀模塊**：設定國家、地圖、文化、歷史背景。
* 📖 **章節編輯器**：支援 Markdown 與即時預覽。
* 🤖 **GPT 助手**：整合 OpenAI API，提供靈感生成與文本潤飾。
* ☁️ **雲端儲存**：使用 Supabase 保存資料（角色、世界觀、章節）。
* 🔑 **API Key 模式**：支援使用者自行輸入 OpenAI API Key 

## 技術棧

* **前端**：Next.js 15 + React + Tailwind CSS
* **後端**：Next.js API Routes + Supabase (PostgreSQL, Auth, Storage)
* **AI**：OpenAI Node.js SDK

## 開發指南

1. **Clone 專案**


2. **安裝依賴**

   ```bash
   npm install
   ```

3. **環境變數設定**
   建立 `.env.local`：

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **啟動開發模式**

   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**

   ```
   http://localhost:3000
   ```


