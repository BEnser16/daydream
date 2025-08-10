import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { openai } from '@/lib/openai';

// GET: Fetch a single character card
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { id } = params;

  const { data, error } = await supabase
    .from('character_cards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// PUT: Update a single character card
export async function PUT(request, { params }) {
 
  const {id} = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  
  const supabase = await createClient();
  const { name, appearance, abilities, background, tags, notes } = await request.json();
  // emedding
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: `${name} ${appearance} ${abilities} ${background} ${notes}`
  })

  const vector = embedding.data[0].embedding

  const { data, error } = await supabase
    .from('character_cards')
    .update({
      name,
      appearance,
      abilities,
      background,
      tags,
      notes,
      updated_at: new Date().toISOString(),
      embedding: vector
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE: Delete a single character card
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { error } = await supabase
    .from('character_cards')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}