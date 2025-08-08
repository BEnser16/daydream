import { NextResponse } from "next/server"
import { createClient } from '@/lib/supabaseServer';


// GET 請求：處理取得章節列表
export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get('user_id')

  // 檢查 user_id 是否存在
  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}

// POST 請求：處理新增章節
export async function POST(request) {
  const supabase = await createClient();
  const { user_id, title, content, notes } = await request.json()

  const { data, error } = await supabase
    .from('chapters')
    .insert({ user_id, title, content, notes })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}