import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client for webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const merchant_id = formData.get('merchant_id') as string
    const order_id = formData.get('order_id') as string
    const payhere_amount = formData.get('payhere_amount') as string
    const payhere_currency = formData.get('payhere_currency') as string
    const status_code = formData.get('status_code') as string
    const md5sig = formData.get('md5sig') as string

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET

    if (!merchant_secret) {
      return NextResponse.json({ error: 'Secret missing' }, { status: 500 })
    }

    // Verify the signature from PayHere
    const secretHash = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase()

    const localSig = crypto
      .createHash('md5')
      .update(
        merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        secretHash
      )
      .digest('hex')
      .toUpperCase()

    if (localSig !== md5sig) {
      console.error('PayHere signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Status codes: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = charged back
    if (status_code === '2') {
      // Payment successful — update order status
      await supabase
        .from('orders')
        .update({ status: 'Processing', payment_status: 'paid', payment_method: 'payhere' })
        .eq('order_id', order_id)

      console.log(`✅ PayHere payment successful for order ${order_id}`)
    } else if (status_code === '0') {
      // Pending
      await supabase
        .from('orders')
        .update({ payment_status: 'pending', payment_method: 'payhere' })
        .eq('order_id', order_id)
    } else {
      // Failed / Canceled
      await supabase
        .from('orders')
        .update({ payment_status: 'failed', payment_method: 'payhere' })
        .eq('order_id', order_id)

      console.log(`❌ PayHere payment failed for order ${order_id}, status: ${status_code}`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('PayHere notify error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
