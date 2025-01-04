import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const now = new Date().toISOString()
    
    // Get active draws that haven't ended yet
    const { data, error } = await supabase
      .from('prize_draws')
      .select('*')
      .eq('status', 'active')
      .gt('end_date', now)
      .order('end_date')
    
    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error getting prize draws:', error)
    return NextResponse.json(
      { error: 'Failed to get prize draws' },
      { status: 500 }
    )
  }
} 