import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

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
  const supabase = await createClient();
  const { id } = params;
  const { name, appearance, abilities, background, tags, notes } = await request.json();

  const { data, error } = await supabase
    .from('character_cards')
    .update({
      name,
      appearance,
      abilities,
      background,
      tags,
      notes,
      updated_at: new Date().toISOString()
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
  const { id } = params;

  const { error } = await supabase
    .from('character_cards')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}