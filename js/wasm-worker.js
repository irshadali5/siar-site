/**
 * SIAR Dedicated WebWorker WASM Cryptography & Protocol Engine
 * Architecture: Part 04 - WASM Client Architecture (Worker Bridge)
 * Simulates pure-Rust crates: siar-protocol, siar-crypto-mls, siar-dtn
 */

// Postcard Frame Types
const FRAME_TYPES = {
  HANDSHAKE: 0x01,
  ROUTE_DISCOVERY: 0x02,
  DATA_BUNDLE: 0x03,
  ACK: 0x04,
  EMERGENCY_ALERT: 0x0F
};

// OpenMLS Tree Ratchet State
let mlsState = {
  epoch: 1,
  generation: 14,
  treeSize: 3,
  groupContext: "siar-mesh-group-alpha",
  ciphersuite: "MLS_128_DHKEMP256_AES128GCM_SHA256_Ed25519"
};

/**
 * Handle incoming WebWorker commands
 */
self.onmessage = function (e) {
  const { action, payload, id } = e.data;

  try {
    switch (action) {
      case 'GENERATE_IDENTITY': {
        const keyBytes = new Uint8Array(32);
        self.crypto.getRandomValues(keyBytes);
        const hex = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        self.postMessage({
          id,
          success: true,
          result: {
            pubKey: `ed25519:${hex}`,
            keyBytes: Array.from(keyBytes),
            createdMs: Date.now()
          }
        });
        break;
      }

      case 'ADVANCE_MLS_EPOCH': {
        mlsState.epoch += 1;
        mlsState.generation += 1;
        const commitHash = Array.from(self.crypto.getRandomValues(new Uint8Array(16)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        self.postMessage({
          id,
          success: true,
          result: {
            epoch: mlsState.epoch,
            generation: mlsState.generation,
            commitHash: `0x${commitHash}`,
            status: "Post-Compromise Security (PCS) Key Ratchet Complete"
          }
        });
        break;
      }

      case 'ENCODE_POSTCARD_FRAME': {
        const frame = payload || {};
        const encoded = encodePostcardBinary(frame);
        self.postMessage({
          id,
          success: true,
          result: encoded
        });
        break;
      }

      case 'DECODE_POSTCARD_FRAME': {
        const hexInput = payload.hexString || '';
        const decoded = decodePostcardBinary(hexInput);
        self.postMessage({
          id,
          success: true,
          result: decoded
        });
        break;
      }

      default:
        self.postMessage({ id, success: false, error: `Unknown action: ${action}` });
    }
  } catch (err) {
    self.postMessage({ id, success: false, error: err.message });
  }
};

/**
 * Encode frame into Postcard binary buffer and format Hex Dump + AST
 */
function encodePostcardBinary(frame) {
  // Magic: 'S' 'I' 'A' 'R' (0x53, 0x49, 0x41, 0x52)
  const bytes = [0x53, 0x49, 0x41, 0x52];
  
  // Protocol Version (u16 little-endian: 1)
  bytes.push(0x01, 0x00);
  
  // Frame Type
  const frameType = frame.frameType || FRAME_TYPES.DATA_BUNDLE;
  bytes.push(frameType);

  // Flags: Bit 0: Encrypted, Bit 1: DTN Forwardable, Bit 2: SOS
  let flags = 0x01; // Encrypted
  if (frame.isDtn) flags |= 0x02;
  if (frame.isEmergency) flags |= 0x04;
  bytes.push(flags);

  // Source & Destination 32-byte Ed25519 keys
  const srcBytes = (frame.sourceBytes && frame.sourceBytes.length === 32) 
    ? frame.sourceBytes 
    : [0x7a, 0x4f, 0xb9, 0x18, 0xcc, 0x3d, 0xa1, 0x0e, 0xf4, 0x9b, 0x12, 0x77, 0x41, 0xd4, 0x73, 0x5e, 0x3a, 0x26, 0x5e, 0x16, 0xee, 0xe0, 0x3f, 0x59, 0x71, 0x8b, 0x9b, 0x5d, 0x03, 0x01, 0x9c, 0x07];
  
  const dstBytes = (frame.destBytes && frame.destBytes.length === 32)
    ? frame.destBytes
    : [0x9b, 0x12, 0x88, 0xff, 0x12, 0xbc, 0x90, 0x22, 0x10, 0x01, 0x4b, 0x77, 0xd4, 0xdd, 0x1f, 0xc6, 0x1c, 0x6f, 0x88, 0x4f, 0x48, 0x64, 0x1d, 0x02, 0xb4, 0xd1, 0x21, 0xd3, 0xfd, 0x32, 0x8c, 0xb0];

  bytes.push(...srcBytes);
  bytes.push(...dstBytes);

  // Sequence number (u64 little endian)
  const seq = frame.seq || 104;
  for (let i = 0; i < 8; i++) {
    bytes.push((seq >> (i * 8)) & 0xFF);
  }

  // Timestamp (u64)
  const now = Date.now();
  for (let i = 0; i < 8; i++) {
    bytes.push(Math.floor(now / Math.pow(256, i)) & 0xFF);
  }

  // Payload: MLS encrypted envelope
  const epoch = mlsState.epoch;
  bytes.push(epoch & 0xFF);
  bytes.push(mlsState.generation & 0xFF);

  // Auth Tag & Payload bytes
  bytes.push(0xc0, 0x34, 0x1a, 0x88, 0xff, 0x12, 0xbc, 0x90);

  // Generate Hex Lines
  const hexLines = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const hexParts = chunk.map(b => b.toString(16).padStart(2, '0'));
    const asciiParts = chunk.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
    const offsetStr = i.toString(16).padStart(4, '0') + ':';
    hexLines.push({
      offset: offsetStr,
      bytes: hexParts.join(' '),
      ascii: asciiParts
    });
  }

  const rawHex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    rawHex,
    byteLength: bytes.length,
    hexLines,
    ast: {
      frame: "TransportFrame::DataBundle",
      header: {
        magic: "SIAR (0x53 0x49 0x41 0x52)",
        version: 1,
        frame_type: frameType === FRAME_TYPES.EMERGENCY_ALERT ? "EmergencyAlert (0x0F)" : "DataBundle (0x03)",
        flags: {
          encrypted_mls: true,
          dtn_forwardable: !!(flags & 0x02),
          sos_emergency: !!(flags & 0x04)
        },
        source: `ed25519:${srcBytes.slice(0, 8).map(b=>b.toString(16).padStart(2,'0')).join('')}...`,
        destination: `ed25519:${dstBytes.slice(0, 8).map(b=>b.toString(16).padStart(2,'0')).join('')}...`,
        sequence: seq,
        timestamp_ms: now,
        hop_count: frame.hops || 1,
        max_hops: 8
      },
      payload: {
        encryption: "ChaCha20-Poly1305 (OpenMLS RFC 9420)",
        mls_epoch: epoch,
        mls_generation: mlsState.generation,
        auth_tag: "0xc0341a88ff12bc90"
      }
    }
  };
}

/**
 * Decode Postcard Hex Stream to AST
 */
function decodePostcardBinary(hexString) {
  const cleanHex = hexString.replace(/\s+/g, '');
  if (cleanHex.length < 8) {
    throw new Error("Invalid Postcard stream: buffer too short");
  }

  const magic = cleanHex.slice(0, 8);
  if (magic.toUpperCase() !== "53494152") {
    throw new Error("Invalid Postcard magic: expected 0x53494152 (SIAR)");
  }

  return {
    validated: true,
    magic: "SIAR (Validated)",
    protocolVersion: 1,
    sizeBytes: cleanHex.length / 2
  };
}
