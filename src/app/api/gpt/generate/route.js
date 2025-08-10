import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabaseServer";

// 初始化 OpenAI 客戶端，這段程式碼只在伺服器端運行，所以可以安全地存取環境變數
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST: 處理 GPT 文本生成請求
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { prompt } = await request.json();

    // 檢查是否至少有一個輸入
    if (!prompt) {
      return NextResponse.json(
        { error: "需要至少一個輸入 (prompt)" },
        { status: 400 }
      );
    }

    // prompt emedding
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt,
    });
    // console.log("Prompt embedding:", embeddingRes.data[0].embedding);
    const userEmbeddingPrompt = embeddingRes.data[0].embedding;

    // search character card using supabase
    const { data: matchedCards, error } = await supabase.rpc(
      "match_character_cards",
      {
        query_embedding: userEmbeddingPrompt,
        match_count: 3,
      }
    );

    // search worldinfo using supabase
    const { data: matchedWorldInfo, matchWorldError } = await supabase.rpc(
      "match_worldbuilding_blocks",
      {
        query_embedding: userEmbeddingPrompt,
        match_count: 3,
      }
    );

    // ✅ 新增：查詢世界觀總覽檔案
    const { data: worldOverview, error: overviewError } = await supabase
      .from("worldbuilding_blocks")
      .select("content") // 只選擇 content 欄位，以節省 token
      .eq("is_overview", true);

    if (error || matchWorldError || overviewError) {
      // 檢查所有可能出錯的查詢
      const errorMessage =
        error?.message || matchWorldError?.message || overviewError?.message;
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // matchedCards prompt
    const contextStr = matchedCards
      .map(
        (card) => `
          角色名：${card.name}
          外觀：${card.appearance}
          能力：${card.abilities}
          背景：${card.background}
        `
      )
      .join("\n");

    // ✅ 將世界觀總覽也加入 prompt
    let worldinfoStr = "";
    if (worldOverview && worldOverview.length > 0) {
      worldinfoStr += `世界觀總覽：${worldOverview[0].content}\n\n`;
    }

    // matchedCards prompt
    worldinfoStr += matchedWorldInfo
      .map(
        (worldinfo) => `
          名稱：${worldinfo.title}
          描述：${worldinfo.content}
        `
      )
      .join("\n");

    // 組裝 Prompt
    let systemPrompt = "你是一個幻想小說作家助手，幫助使用者補完劇情或靈感。";
    let userPrompt = "";

    if (worldinfoStr) {
      userPrompt += `世界觀設定：\n${worldinfoStr}\n\n`;
    }

    if (contextStr) {
      userPrompt += `角色資料：${contextStr}\n`;
    }

    if (prompt) {
      userPrompt += `使用者想要：${prompt}`;
    }
    console.log("準備送出組裝的 Prompt:", userPrompt);
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const gptReply = chatCompletion.choices[0].message.content;
    return NextResponse.json({ result: gptReply }, { status: 200 });
  } catch (err) {
    console.error("GPT Error:", err);
    console.error("Error Stack:", err.stack); // 增加堆疊追蹤日誌
    // 處理不同類型的錯誤，確保回傳有意義的訊息
    return NextResponse.json(
      { error: "GPT 生成失敗", detail: err.message },
      { status: 500 }
    );
  }
}
