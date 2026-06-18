import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.SHARE_SECRET || 'sylen_super_secret_fallback_key_2026';
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

async function verifyData(data: string, signatureHex: string, secret: string) {
  const key = await importKey(secret);
  // Convert hex signature back to Uint8Array
  const signatureBytes = new Uint8Array(Math.ceil(signatureHex.length / 2));
  for (let i = 0; i < signatureBytes.length; i++) {
    signatureBytes[i] = parseInt(signatureHex.substring(i * 2, i * 2 + 2), 16);
  }
  
  return await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(data));
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
      return NextResponse.json({ error: 'Malformed token' }, { status: 400 });
    }

    const [base64Payload, signature] = parts;

    // Verify HMAC
    const isValid = await verifyData(base64Payload, signature, JWT_SECRET);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Tampered or invalid signature' }, { status: 401 });
    }

    // Decode payload
    const payloadStr = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const data = JSON.parse(payloadStr);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Share verification error:', error);
    return NextResponse.json({ error: 'Failed to verify report' }, { status: 500 });
  }
}
