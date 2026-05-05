let cachedPublicKeyPem: string | null = null;
let cachedCryptoKey: CryptoKey | null = null;

function normalizePem(value: string): string {
  return value.replace(/\r/g, "").trim();
}

function getConfiguredPublicKeyPem(): string | null {
  const rawValue = import.meta.env.VITE_PUBLIC_KEY_RSA_SERVER_RECEIVE
    ?? import.meta.env.VITE_PUBLIC_KEY_RSA_Server_Receive;

  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    return null;
  }

  const pem = normalizePem(rawValue);
  if (!pem.includes("-----BEGIN PUBLIC KEY-----") || !pem.includes("-----END PUBLIC KEY-----")) {
    return null;
  }

  return pem;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "");

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export async function loadServerPublicKey(url: string): Promise<string> {
  if (cachedPublicKeyPem) return cachedPublicKeyPem;

  const configuredPem = getConfiguredPublicKeyPem();
  if (configuredPem) {
    cachedPublicKeyPem = configuredPem;
    return configuredPem;
  }

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to load server public key file ${url}`);

  const pem = normalizePem(await resp.text());
  cachedPublicKeyPem = pem;
  return pem;
}

async function getServerPublicKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) return cachedCryptoKey;

  const pem = await loadServerPublicKey("/public_key.pem");
  cachedCryptoKey = await crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(pem),
    { name: "RSA-OAEP", hash: "SHA-1" },
    false,
    ["encrypt"],
  );

  return cachedCryptoKey;
}

export async function encryptForClient(text: string): Promise<string> {
  const publicKey = await getServerPublicKey();
  const encodedText = new TextEncoder().encode(text);
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encodedText,
  );

  return arrayBufferToBase64(encrypted);
}
