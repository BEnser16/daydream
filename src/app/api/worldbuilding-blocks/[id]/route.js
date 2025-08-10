import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { openai } from '@/lib/openai';

// GET: Fetch a single worldbuilding block
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from('worldbuilding_blocks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT: Update a single worldbuilding block
export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { id } = await params;
  const { title, content, category, tags } = await request.json();

  // emedding
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: `${title} ${content}`
    })
  
    const vector = embedding.data[0].embedding

  const { data, error } = await supabase
    .from('worldbuilding_blocks')
    .update({ title, content, category, tags, updated_at: new Date().toISOString(), embedding: vector })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE: Delete a single worldbuilding block
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { error } = await supabase
    .from('worldbuilding_blocks')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}