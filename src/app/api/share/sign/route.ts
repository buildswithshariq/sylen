import { NextResponse } from 'next/server';

// Fallback secret for development if environment variable is not set
const JWT_SECRET = process.env.SHARE_SECRET || 'sylen_super_secret_fallback_key_2026';

// Helper to encode string to Uint8Array
const encoder = new TextEncoder();

async function importKey(secret: string) {
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signData(data: string, secret: string) {
  const key = await importKey(secret);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return signatureHex;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Convert payload to string
    const payloadStr = JSON.stringify(body);
    // Base64 encode the payload safely for URLs
    const base64Payload = Buffer.from(payloadStr).toString('base64url');
    
    // Generate signature
    const signature = await signData(base64Payload, JWT_SECRET);
    
    // The final token is payload.signature
    const token = `${base64Payload}.${signature}`;

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Share signing error:', error);
    return NextResponse.json({ error: 'Failed to sign report' }, { status: 500 });
  }
}
