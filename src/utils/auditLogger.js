export async function generateBlock(previousHash, data) {
  const message = JSON.stringify({ previousHash, data, timestamp: Date.now() });
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(message));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { id: Date.now(), hash: hashHex, data, previousHash, timestamp: Date.now(), verified: true };
}
