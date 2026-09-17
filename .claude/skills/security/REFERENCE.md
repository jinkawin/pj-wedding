# Encryption — `@kx2024/cryptography`

## Installation

```bash
yarn add @kx2024/cryptography
```

## Setup

```ts
import { CryptoLib } from '@kx2024/cryptography';

const cryptoLib = new CryptoLib();
const AES = cryptoLib.AES;   // AES-256-GCM encryption
const ECDH = cryptoLib.ECDH; // Curve25519 key exchange + encryption
const RSA = cryptoLib.RSA;   // RSA encryption
```

## AES API

| Method | Signature | Description |
|--------|-----------|-------------|
| `generateAES256Key` | `() => Promise<string>` | Returns a Base64-encoded 256-bit key |
| `encrypt` | `(buffer: BufferSource, base64Key: string) => Promise<Uint8Array>` | Encrypts data with AES-256-GCM (IV prepended) |
| `decrypt` | `(encryptedData: Uint8Array, base64Key: string) => Promise<BufferSource>` | Decrypts AES-256-GCM ciphertext |

## ECDH API

| Method | Signature | Description |
|--------|-----------|-------------|
| `generateKeyPair` | `() => KeyPair` | Returns `{ publicKey, privateKey }` in Base64 |
| `encrypt` | `(message, publicKey, privateKey) => { ciphertext, nonce }` | Encrypts a string with ECDH shared secret |
| `decrypt` | `(ciphertext, nonce, publicKey, privateKey) => string` | Decrypts ciphertext back to plaintext |
| `composeSharedSecret` | `(privateKey, publicKey) => string` | Computes shared secret (Base64) |

## Example: React Hook (Frontend — ECDH key exchange)

```ts
// hooks/useEncryptedChannel.ts
'use client';

import { useRef, useCallback } from 'react';
import { CryptoLib } from '@kx2024/cryptography';

const cryptoLib = new CryptoLib();

export function useEncryptedChannel() {
  const keyPairRef = useRef(cryptoLib.ECDH.generateKeyPair());

  const encrypt = useCallback((message: string, serverPublicKey: string) => {
    const { publicKey, privateKey } = keyPairRef.current;
    return {
      ...cryptoLib.ECDH.encrypt(message, serverPublicKey, privateKey),
      clientPublicKey: publicKey,
    };
  }, []);

  const decrypt = useCallback((ciphertext: string, nonce: string, serverPublicKey: string) => {
    const { privateKey } = keyPairRef.current;
    return cryptoLib.ECDH.decrypt(ciphertext, nonce, serverPublicKey, privateKey);
  }, []);

  return {
    publicKey: keyPairRef.current.publicKey,
    encrypt,
    decrypt,
  };
}
```

## Example: Next.js Server (API Route — AES encryption)

```ts
// app/api/encrypt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CryptoLib } from '@kx2024/cryptography';

const cryptoLib = new CryptoLib();

export async function POST(request: NextRequest) {
  const { payload } = await request.json();

  // Use a server-managed key stored in environment variable
  const base64Key = process.env.AES_ENCRYPTION_KEY!;

  const encoder = new TextEncoder();
  const buffer = encoder.encode(JSON.stringify(payload));

  const encrypted = await cryptoLib.AES.encrypt(buffer, base64Key);

  // Return as Base64 for safe transport
  const base64Encrypted = Buffer.from(encrypted).toString('base64');

  return NextResponse.json({ data: base64Encrypted });
}
```

```ts
// app/api/decrypt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CryptoLib } from '@kx2024/cryptography';

const cryptoLib = new CryptoLib();

export async function POST(request: NextRequest) {
  const { encryptedData } = await request.json();

  const base64Key = process.env.AES_ENCRYPTION_KEY!;

  const binaryData = Uint8Array.from(Buffer.from(encryptedData, 'base64'));
  const decrypted = await cryptoLib.AES.decrypt(binaryData, base64Key);

  const decoder = new TextDecoder();
  const plaintext = decoder.decode(decrypted);

  return NextResponse.json({ data: JSON.parse(plaintext) });
}
```

> **Important**: Never expose `AES_ENCRYPTION_KEY` to the client. Keep it in server-only env vars (no `NEXT_PUBLIC_` prefix). Generate keys using `cryptoLib.AES.generateAES256Key()` and store securely.
