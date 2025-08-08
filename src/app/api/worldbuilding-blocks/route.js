import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

// GET: Fetch a list of worldbuilding blocks
export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  // Check if user_id is provided
  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('worldbuilding_blocks')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false }); // Added ordering for good practice

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// POST: Create a new worldbuilding block
export async function POST(request) {
  const supabase = await createClient();
  const { user_id, title, content, category, tags } = await request.json();

  const { data, error } = await supabase
    .from('worldbuilding_blocks')
    .insert({ user_id, title, content, category, tags })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}