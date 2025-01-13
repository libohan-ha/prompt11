import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = req.headers.get('x-client-id')
    const { id } = params
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Missing client ID' },
        { status: 400 }
      )
    }

    console.log('Fetching prompt:', { id, clientId })
    
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        versions (
          id,
          content,
          version_number,
          feedback,
          created_at
        )
      `)
      .eq('id', id)
      .eq('client_id', clientId)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch prompt', details: error },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    console.log('Successfully fetched prompt:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
} 