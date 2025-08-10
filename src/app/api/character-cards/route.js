import { NextResponse } from "next/server"
import { createClient } from '@/lib/supabaseServer';
import { openai } from "@/lib/openai";

// GET 請求：處理取得角色卡
export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get('user_id')

  // 檢查 user_id 是否存在
  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('character_cards')
    .select('*')
    .eq('user_id', user_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}


// POST 請求：處理新增角色卡
export async function POST(request) {
  const supabase = await createClient();
  
  const { user_id, name, appearance, abilities, background, tags, notes } = await request.json()

  // emedding
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: `${name} ${appearance} ${abilities} ${background} ${notes}`
  })

  const vector = embedding.data[0].embedding

  const { data, error } = await supabase
    .from('character_cards')
    .insert({
        user_id,
        name,
        appearance,
        abilities,
        background,
        tags,
        notes,
        vector
      })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

