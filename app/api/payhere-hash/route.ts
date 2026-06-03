import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { merchant_id, order_id, amount, currency } = await req.json()
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET

    if (!merchant_secret) {
      return NextResponse.json({ error: 'PayHere merchant secret not configured' }, { status: 500 })
    }

    // 1. MD5 hash of the merchant secret, uppercased
    const secretHash = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase()

    // 2. Format amount to 2 decimal places
    const formattedAmount = Number(amount).toFixed(2)

    // 3. Build input string: merchant_id + order_id + amount + currency + hashedSecret
    const inputString = merchant_id + order_id + formattedAmount + currency + secretHash

    // 4. Final MD5 hash, uppercased
    const hash = crypto
      .createHash('md5')
      .update(inputString)
      .digest('hex')
      .toUpperCase()

    return NextResponse.json({ hash })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Hash generation failed' }, { status: 500 })
  }
}
