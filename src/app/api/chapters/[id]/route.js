// app/api/chapters/[id]/route.js

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';


// GET 請求：取得單一章節
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = params;

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // 找不到資料時，回傳 404
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT 請求：更新單一章節
export async function PUT(request, { params }) {
      const supabase = await createClient();

  const { id } = params;
  const { title, content, notes } = await request.json();

  const { data, error } = await supabase
    .from('chapters')
    .update({ title, content, notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE 請求：刪除單一章節
export async function DELETE(request, { params }) {
      const supabase = await createClient();

  const { id } = params;

  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 成功刪除，回傳 204 並結束回應
  return new NextResponse(null, { status: 204 });
}