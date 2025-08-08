import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化 OpenAI 客戶端，這段程式碼只在伺服器端運行，所以可以安全地存取環境變數
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST: 處理 GPT 文本生成請求
export async function POST(request) {
  // 從請求主體取得所有輸入
  const { prompt, characterCard, worldInfo } = await request.json();

  // 檢查是否至少有一個輸入
  if (!prompt && !characterCard && !worldInfo) {
    return NextResponse.json({ error: '需要至少一個輸入 (prompt / characterCard / worldInfo)' }, { status: 400 });
  }

  // 🧠 組裝 Prompt
  let systemPrompt = '你是一個幻想小說作家助手，幫助使用者補完劇情或靈感。';
  let userPrompt = '';

  if (characterCard) {
    userPrompt += `角色資料：\n${characterCard.name}\n外觀：${characterCard.appearance}\n能力：${characterCard.abilities}\n背景：${characterCard.background}\n\n`;
  }

  if (worldInfo) {
    userPrompt += `世界觀設定：\n${worldInfo}\n\n`;
  }

  if (prompt) {
    userPrompt += `使用者想要：${prompt}`;
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const gptReply = chatCompletion.choices[0].message.content;
    return NextResponse.json({ result: gptReply }, { status: 200 });
  } catch (err) {
    console.error('GPT Error:', err);
    // 處理不同類型的錯誤，確保回傳有意義的訊息
    return NextResponse.json({ error: 'GPT 生成失敗', detail: err.message }, { status: 500 });
  }
}