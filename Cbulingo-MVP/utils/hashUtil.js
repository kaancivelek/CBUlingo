// Password hashing utility using SHA-256
export async function hashPassword(password) {
  // Convert password string to byte array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate SHA-256 hash
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  
  // Convert hash buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}