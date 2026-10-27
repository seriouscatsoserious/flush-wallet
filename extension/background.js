var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/bitcoinjs-lib/src/esm/networks.js
var bitcoin;
var init_networks = __esm({
  "node_modules/bitcoinjs-lib/src/esm/networks.js"() {
    bitcoin = {
      /**
       * The message prefix used for signing Bitcoin messages.
       */
      messagePrefix: "Bitcoin Signed Message:\n",
      /**
       * The Bech32 prefix used for Bitcoin addresses.
       */
      bech32: "bc",
      /**
       * The BIP32 key prefixes for Bitcoin.
       */
      bip32: {
        /**
         * The public key prefix for BIP32 extended public keys.
         */
        public: 76067358,
        /**
         * The private key prefix for BIP32 extended private keys.
         */
        private: 76066276
      },
      /**
       * The prefix for Bitcoin public key hashes.
       */
      pubKeyHash: 0,
      /**
       * The prefix for Bitcoin script hashes.
       */
      scriptHash: 5,
      /**
       * The prefix for Bitcoin Wallet Import Format (WIF) private keys.
       */
      wif: 128
    };
  }
});

// node_modules/bitcoinjs-lib/src/esm/bip66.js
function check(buffer) {
  if (buffer.length < 8) return false;
  if (buffer.length > 72) return false;
  if (buffer[0] !== 48) return false;
  if (buffer[1] !== buffer.length - 2) return false;
  if (buffer[2] !== 2) return false;
  const lenR = buffer[3];
  if (lenR === 0) return false;
  if (5 + lenR >= buffer.length) return false;
  if (buffer[4 + lenR] !== 2) return false;
  const lenS = buffer[5 + lenR];
  if (lenS === 0) return false;
  if (6 + lenR + lenS !== buffer.length) return false;
  if (buffer[4] & 128) return false;
  if (lenR > 1 && buffer[4] === 0 && !(buffer[5] & 128)) return false;
  if (buffer[lenR + 6] & 128) return false;
  if (lenS > 1 && buffer[lenR + 6] === 0 && !(buffer[lenR + 7] & 128))
    return false;
  return true;
}
function decode(buffer) {
  if (buffer.length < 8) throw new Error("DER sequence length is too short");
  if (buffer.length > 72) throw new Error("DER sequence length is too long");
  if (buffer[0] !== 48) throw new Error("Expected DER sequence");
  if (buffer[1] !== buffer.length - 2)
    throw new Error("DER sequence length is invalid");
  if (buffer[2] !== 2) throw new Error("Expected DER integer");
  const lenR = buffer[3];
  if (lenR === 0) throw new Error("R length is zero");
  if (5 + lenR >= buffer.length) throw new Error("R length is too long");
  if (buffer[4 + lenR] !== 2) throw new Error("Expected DER integer (2)");
  const lenS = buffer[5 + lenR];
  if (lenS === 0) throw new Error("S length is zero");
  if (6 + lenR + lenS !== buffer.length) throw new Error("S length is invalid");
  if (buffer[4] & 128) throw new Error("R value is negative");
  if (lenR > 1 && buffer[4] === 0 && !(buffer[5] & 128))
    throw new Error("R value excessively padded");
  if (buffer[lenR + 6] & 128) throw new Error("S value is negative");
  if (lenS > 1 && buffer[lenR + 6] === 0 && !(buffer[lenR + 7] & 128))
    throw new Error("S value excessively padded");
  return {
    r: buffer.slice(4, 4 + lenR),
    s: buffer.slice(6 + lenR)
  };
}
function encode(r, s) {
  const lenR = r.length;
  const lenS = s.length;
  if (lenR === 0) throw new Error("R length is zero");
  if (lenS === 0) throw new Error("S length is zero");
  if (lenR > 33) throw new Error("R length is too long");
  if (lenS > 33) throw new Error("S length is too long");
  if (r[0] & 128) throw new Error("R value is negative");
  if (s[0] & 128) throw new Error("S value is negative");
  if (lenR > 1 && r[0] === 0 && !(r[1] & 128))
    throw new Error("R value excessively padded");
  if (lenS > 1 && s[0] === 0 && !(s[1] & 128))
    throw new Error("S value excessively padded");
  const signature2 = new Uint8Array(6 + lenR + lenS);
  signature2[0] = 48;
  signature2[1] = signature2.length - 2;
  signature2[2] = 2;
  signature2[3] = r.length;
  signature2.set(r, 4);
  signature2[4 + lenR] = 2;
  signature2[5 + lenR] = s.length;
  signature2.set(s, 6 + lenR);
  return signature2;
}
var init_bip66 = __esm({
  "node_modules/bitcoinjs-lib/src/esm/bip66.js"() {
  }
});

// node_modules/bitcoinjs-lib/src/esm/ops.js
var OPS;
var init_ops = __esm({
  "node_modules/bitcoinjs-lib/src/esm/ops.js"() {
    (function(OPS10) {
      OPS10[OPS10["OP_FALSE"] = 0] = "OP_FALSE";
      OPS10[OPS10["OP_0"] = 0] = "OP_0";
      OPS10[OPS10["OP_PUSHDATA1"] = 76] = "OP_PUSHDATA1";
      OPS10[OPS10["OP_PUSHDATA2"] = 77] = "OP_PUSHDATA2";
      OPS10[OPS10["OP_PUSHDATA4"] = 78] = "OP_PUSHDATA4";
      OPS10[OPS10["OP_1NEGATE"] = 79] = "OP_1NEGATE";
      OPS10[OPS10["OP_RESERVED"] = 80] = "OP_RESERVED";
      OPS10[OPS10["OP_TRUE"] = 81] = "OP_TRUE";
      OPS10[OPS10["OP_1"] = 81] = "OP_1";
      OPS10[OPS10["OP_2"] = 82] = "OP_2";
      OPS10[OPS10["OP_3"] = 83] = "OP_3";
      OPS10[OPS10["OP_4"] = 84] = "OP_4";
      OPS10[OPS10["OP_5"] = 85] = "OP_5";
      OPS10[OPS10["OP_6"] = 86] = "OP_6";
      OPS10[OPS10["OP_7"] = 87] = "OP_7";
      OPS10[OPS10["OP_8"] = 88] = "OP_8";
      OPS10[OPS10["OP_9"] = 89] = "OP_9";
      OPS10[OPS10["OP_10"] = 90] = "OP_10";
      OPS10[OPS10["OP_11"] = 91] = "OP_11";
      OPS10[OPS10["OP_12"] = 92] = "OP_12";
      OPS10[OPS10["OP_13"] = 93] = "OP_13";
      OPS10[OPS10["OP_14"] = 94] = "OP_14";
      OPS10[OPS10["OP_15"] = 95] = "OP_15";
      OPS10[OPS10["OP_16"] = 96] = "OP_16";
      OPS10[OPS10["OP_NOP"] = 97] = "OP_NOP";
      OPS10[OPS10["OP_VER"] = 98] = "OP_VER";
      OPS10[OPS10["OP_IF"] = 99] = "OP_IF";
      OPS10[OPS10["OP_NOTIF"] = 100] = "OP_NOTIF";
      OPS10[OPS10["OP_VERIF"] = 101] = "OP_VERIF";
      OPS10[OPS10["OP_VERNOTIF"] = 102] = "OP_VERNOTIF";
      OPS10[OPS10["OP_ELSE"] = 103] = "OP_ELSE";
      OPS10[OPS10["OP_ENDIF"] = 104] = "OP_ENDIF";
      OPS10[OPS10["OP_VERIFY"] = 105] = "OP_VERIFY";
      OPS10[OPS10["OP_RETURN"] = 106] = "OP_RETURN";
      OPS10[OPS10["OP_TOALTSTACK"] = 107] = "OP_TOALTSTACK";
      OPS10[OPS10["OP_FROMALTSTACK"] = 108] = "OP_FROMALTSTACK";
      OPS10[OPS10["OP_2DROP"] = 109] = "OP_2DROP";
      OPS10[OPS10["OP_2DUP"] = 110] = "OP_2DUP";
      OPS10[OPS10["OP_3DUP"] = 111] = "OP_3DUP";
      OPS10[OPS10["OP_2OVER"] = 112] = "OP_2OVER";
      OPS10[OPS10["OP_2ROT"] = 113] = "OP_2ROT";
      OPS10[OPS10["OP_2SWAP"] = 114] = "OP_2SWAP";
      OPS10[OPS10["OP_IFDUP"] = 115] = "OP_IFDUP";
      OPS10[OPS10["OP_DEPTH"] = 116] = "OP_DEPTH";
      OPS10[OPS10["OP_DROP"] = 117] = "OP_DROP";
      OPS10[OPS10["OP_DUP"] = 118] = "OP_DUP";
      OPS10[OPS10["OP_NIP"] = 119] = "OP_NIP";
      OPS10[OPS10["OP_OVER"] = 120] = "OP_OVER";
      OPS10[OPS10["OP_PICK"] = 121] = "OP_PICK";
      OPS10[OPS10["OP_ROLL"] = 122] = "OP_ROLL";
      OPS10[OPS10["OP_ROT"] = 123] = "OP_ROT";
      OPS10[OPS10["OP_SWAP"] = 124] = "OP_SWAP";
      OPS10[OPS10["OP_TUCK"] = 125] = "OP_TUCK";
      OPS10[OPS10["OP_CAT"] = 126] = "OP_CAT";
      OPS10[OPS10["OP_SUBSTR"] = 127] = "OP_SUBSTR";
      OPS10[OPS10["OP_LEFT"] = 128] = "OP_LEFT";
      OPS10[OPS10["OP_RIGHT"] = 129] = "OP_RIGHT";
      OPS10[OPS10["OP_SIZE"] = 130] = "OP_SIZE";
      OPS10[OPS10["OP_INVERT"] = 131] = "OP_INVERT";
      OPS10[OPS10["OP_AND"] = 132] = "OP_AND";
      OPS10[OPS10["OP_OR"] = 133] = "OP_OR";
      OPS10[OPS10["OP_XOR"] = 134] = "OP_XOR";
      OPS10[OPS10["OP_EQUAL"] = 135] = "OP_EQUAL";
      OPS10[OPS10["OP_EQUALVERIFY"] = 136] = "OP_EQUALVERIFY";
      OPS10[OPS10["OP_RESERVED1"] = 137] = "OP_RESERVED1";
      OPS10[OPS10["OP_RESERVED2"] = 138] = "OP_RESERVED2";
      OPS10[OPS10["OP_1ADD"] = 139] = "OP_1ADD";
      OPS10[OPS10["OP_1SUB"] = 140] = "OP_1SUB";
      OPS10[OPS10["OP_2MUL"] = 141] = "OP_2MUL";
      OPS10[OPS10["OP_2DIV"] = 142] = "OP_2DIV";
      OPS10[OPS10["OP_NEGATE"] = 143] = "OP_NEGATE";
      OPS10[OPS10["OP_ABS"] = 144] = "OP_ABS";
      OPS10[OPS10["OP_NOT"] = 145] = "OP_NOT";
      OPS10[OPS10["OP_0NOTEQUAL"] = 146] = "OP_0NOTEQUAL";
      OPS10[OPS10["OP_ADD"] = 147] = "OP_ADD";
      OPS10[OPS10["OP_SUB"] = 148] = "OP_SUB";
      OPS10[OPS10["OP_MUL"] = 149] = "OP_MUL";
      OPS10[OPS10["OP_DIV"] = 150] = "OP_DIV";
      OPS10[OPS10["OP_MOD"] = 151] = "OP_MOD";
      OPS10[OPS10["OP_LSHIFT"] = 152] = "OP_LSHIFT";
      OPS10[OPS10["OP_RSHIFT"] = 153] = "OP_RSHIFT";
      OPS10[OPS10["OP_BOOLAND"] = 154] = "OP_BOOLAND";
      OPS10[OPS10["OP_BOOLOR"] = 155] = "OP_BOOLOR";
      OPS10[OPS10["OP_NUMEQUAL"] = 156] = "OP_NUMEQUAL";
      OPS10[OPS10["OP_NUMEQUALVERIFY"] = 157] = "OP_NUMEQUALVERIFY";
      OPS10[OPS10["OP_NUMNOTEQUAL"] = 158] = "OP_NUMNOTEQUAL";
      OPS10[OPS10["OP_LESSTHAN"] = 159] = "OP_LESSTHAN";
      OPS10[OPS10["OP_GREATERTHAN"] = 160] = "OP_GREATERTHAN";
      OPS10[OPS10["OP_LESSTHANOREQUAL"] = 161] = "OP_LESSTHANOREQUAL";
      OPS10[OPS10["OP_GREATERTHANOREQUAL"] = 162] = "OP_GREATERTHANOREQUAL";
      OPS10[OPS10["OP_MIN"] = 163] = "OP_MIN";
      OPS10[OPS10["OP_MAX"] = 164] = "OP_MAX";
      OPS10[OPS10["OP_WITHIN"] = 165] = "OP_WITHIN";
      OPS10[OPS10["OP_RIPEMD160"] = 166] = "OP_RIPEMD160";
      OPS10[OPS10["OP_SHA1"] = 167] = "OP_SHA1";
      OPS10[OPS10["OP_SHA256"] = 168] = "OP_SHA256";
      OPS10[OPS10["OP_HASH160"] = 169] = "OP_HASH160";
      OPS10[OPS10["OP_HASH256"] = 170] = "OP_HASH256";
      OPS10[OPS10["OP_CODESEPARATOR"] = 171] = "OP_CODESEPARATOR";
      OPS10[OPS10["OP_CHECKSIG"] = 172] = "OP_CHECKSIG";
      OPS10[OPS10["OP_CHECKSIGVERIFY"] = 173] = "OP_CHECKSIGVERIFY";
      OPS10[OPS10["OP_CHECKMULTISIG"] = 174] = "OP_CHECKMULTISIG";
      OPS10[OPS10["OP_CHECKMULTISIGVERIFY"] = 175] = "OP_CHECKMULTISIGVERIFY";
      OPS10[OPS10["OP_NOP1"] = 176] = "OP_NOP1";
      OPS10[OPS10["OP_CHECKLOCKTIMEVERIFY"] = 177] = "OP_CHECKLOCKTIMEVERIFY";
      OPS10[OPS10["OP_NOP2"] = 177] = "OP_NOP2";
      OPS10[OPS10["OP_CHECKSEQUENCEVERIFY"] = 178] = "OP_CHECKSEQUENCEVERIFY";
      OPS10[OPS10["OP_NOP3"] = 178] = "OP_NOP3";
      OPS10[OPS10["OP_NOP4"] = 179] = "OP_NOP4";
      OPS10[OPS10["OP_NOP5"] = 180] = "OP_NOP5";
      OPS10[OPS10["OP_NOP6"] = 181] = "OP_NOP6";
      OPS10[OPS10["OP_NOP7"] = 182] = "OP_NOP7";
      OPS10[OPS10["OP_NOP8"] = 183] = "OP_NOP8";
      OPS10[OPS10["OP_NOP9"] = 184] = "OP_NOP9";
      OPS10[OPS10["OP_NOP10"] = 185] = "OP_NOP10";
      OPS10[OPS10["OP_CHECKSIGADD"] = 186] = "OP_CHECKSIGADD";
      OPS10[OPS10["OP_PUBKEYHASH"] = 253] = "OP_PUBKEYHASH";
      OPS10[OPS10["OP_PUBKEY"] = 254] = "OP_PUBKEY";
      OPS10[OPS10["OP_INVALIDOPCODE"] = 255] = "OP_INVALIDOPCODE";
    })(OPS || (OPS = {}));
  }
});

// node_modules/uint8array-tools/src/mjs/browser.js
function toUtf8(bytes) {
  return DECODER.decode(bytes);
}
function fromUtf8(s) {
  return ENCODER.encode(s);
}
function concat(arrays) {
  const totalLength = arrays.reduce((a, b) => a + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const array2 of arrays) {
    result.set(array2, offset);
    offset += array2.length;
  }
  return result;
}
function toHex(bytes) {
  const b = bytes || new Uint8Array();
  return b.length > 512 ? _toHexLengthPerf(b) : _toHexIterPerf(b);
}
function _toHexIterPerf(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; ++i) {
    s += HEX_STRINGS[HEX_CODEPOINTS[HEX_CODES[bytes[i] >> 4]]];
    s += HEX_STRINGS[HEX_CODEPOINTS[HEX_CODES[bytes[i] & 15]]];
  }
  return s;
}
function _toHexLengthPerf(bytes) {
  const hexBytes = new Uint8Array(bytes.length * 2);
  for (let i = 0; i < bytes.length; ++i) {
    hexBytes[i * 2] = HEX_CODES[bytes[i] >> 4];
    hexBytes[i * 2 + 1] = HEX_CODES[bytes[i] & 15];
  }
  return DECODER.decode(hexBytes);
}
function fromHex(hexString) {
  const hexBytes = ENCODER.encode(hexString || "");
  const resultBytes = new Uint8Array(Math.floor(hexBytes.length / 2));
  let i;
  for (i = 0; i < resultBytes.length; i++) {
    const a = HEX_CODEPOINTS[hexBytes[i * 2]];
    const b = HEX_CODEPOINTS[hexBytes[i * 2 + 1]];
    if (a === void 0 || b === void 0) {
      break;
    }
    resultBytes[i] = a << 4 | b;
  }
  return i === resultBytes.length ? resultBytes : resultBytes.slice(0, i);
}
function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}
function fromBase64(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function compare(v1, v2) {
  const minLength = Math.min(v1.length, v2.length);
  for (let i = 0; i < minLength; ++i) {
    if (v1[i] !== v2[i]) {
      return v1[i] < v2[i] ? -1 : 1;
    }
  }
  return v1.length === v2.length ? 0 : v1.length > v2.length ? 1 : -1;
}
function writeUInt8(buffer, offset, value2) {
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  if (value2 > 255) {
    throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${255}. Received ${value2}`);
  }
  buffer[offset] = value2;
  return offset + 1;
}
function writeUInt16(buffer, offset, value2, littleEndian) {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (value2 > 65535) {
    throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${65535}. Received ${value2}`);
  }
  if (littleEndian === "LE") {
    buffer[offset] = value2 & 255;
    buffer[offset + 1] = value2 >> 8 & 255;
  } else {
    buffer[offset] = value2 >> 8 & 255;
    buffer[offset + 1] = value2 & 255;
  }
  return offset + 2;
}
function writeUInt32(buffer, offset, value2, littleEndian) {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (value2 > 4294967295) {
    throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${4294967295}. Received ${value2}`);
  }
  if (littleEndian === "LE") {
    buffer[offset] = value2 & 255;
    buffer[offset + 1] = value2 >> 8 & 255;
    buffer[offset + 2] = value2 >> 16 & 255;
    buffer[offset + 3] = value2 >> 24 & 255;
  } else {
    buffer[offset] = value2 >> 24 & 255;
    buffer[offset + 1] = value2 >> 16 & 255;
    buffer[offset + 2] = value2 >> 8 & 255;
    buffer[offset + 3] = value2 & 255;
  }
  return offset + 4;
}
function writeUInt64(buffer, offset, value2, littleEndian) {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (value2 > 0xffffffffffffffffn) {
    throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffffffffffn}. Received ${value2}`);
  }
  if (littleEndian === "LE") {
    buffer[offset] = Number(value2 & 0xffn);
    buffer[offset + 1] = Number(value2 >> 8n & 0xffn);
    buffer[offset + 2] = Number(value2 >> 16n & 0xffn);
    buffer[offset + 3] = Number(value2 >> 24n & 0xffn);
    buffer[offset + 4] = Number(value2 >> 32n & 0xffn);
    buffer[offset + 5] = Number(value2 >> 40n & 0xffn);
    buffer[offset + 6] = Number(value2 >> 48n & 0xffn);
    buffer[offset + 7] = Number(value2 >> 56n & 0xffn);
  } else {
    buffer[offset] = Number(value2 >> 56n & 0xffn);
    buffer[offset + 1] = Number(value2 >> 48n & 0xffn);
    buffer[offset + 2] = Number(value2 >> 40n & 0xffn);
    buffer[offset + 3] = Number(value2 >> 32n & 0xffn);
    buffer[offset + 4] = Number(value2 >> 24n & 0xffn);
    buffer[offset + 5] = Number(value2 >> 16n & 0xffn);
    buffer[offset + 6] = Number(value2 >> 8n & 0xffn);
    buffer[offset + 7] = Number(value2 & 0xffn);
  }
  return offset + 8;
}
function readUInt8(buffer, offset) {
  if (offset + 1 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  return buffer[offset];
}
function readUInt16(buffer, offset, littleEndian) {
  if (offset + 2 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (littleEndian === "LE") {
    let num = 0;
    num = (num << 8) + buffer[offset + 1];
    num = (num << 8) + buffer[offset];
    return num;
  } else {
    let num = 0;
    num = (num << 8) + buffer[offset];
    num = (num << 8) + buffer[offset + 1];
    return num;
  }
}
function readUInt32(buffer, offset, littleEndian) {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (littleEndian === "LE") {
    let num = 0;
    num = (num << 8) + buffer[offset + 3] >>> 0;
    num = (num << 8) + buffer[offset + 2] >>> 0;
    num = (num << 8) + buffer[offset + 1] >>> 0;
    num = (num << 8) + buffer[offset] >>> 0;
    return num;
  } else {
    let num = 0;
    num = (num << 8) + buffer[offset] >>> 0;
    num = (num << 8) + buffer[offset + 1] >>> 0;
    num = (num << 8) + buffer[offset + 2] >>> 0;
    num = (num << 8) + buffer[offset + 3] >>> 0;
    return num;
  }
}
function readUInt64(buffer, offset, littleEndian) {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (littleEndian === "LE") {
    let num = 0n;
    num = (num << 8n) + BigInt(buffer[offset + 7]);
    num = (num << 8n) + BigInt(buffer[offset + 6]);
    num = (num << 8n) + BigInt(buffer[offset + 5]);
    num = (num << 8n) + BigInt(buffer[offset + 4]);
    num = (num << 8n) + BigInt(buffer[offset + 3]);
    num = (num << 8n) + BigInt(buffer[offset + 2]);
    num = (num << 8n) + BigInt(buffer[offset + 1]);
    num = (num << 8n) + BigInt(buffer[offset]);
    return num;
  } else {
    let num = 0n;
    num = (num << 8n) + BigInt(buffer[offset]);
    num = (num << 8n) + BigInt(buffer[offset + 1]);
    num = (num << 8n) + BigInt(buffer[offset + 2]);
    num = (num << 8n) + BigInt(buffer[offset + 3]);
    num = (num << 8n) + BigInt(buffer[offset + 4]);
    num = (num << 8n) + BigInt(buffer[offset + 5]);
    num = (num << 8n) + BigInt(buffer[offset + 6]);
    num = (num << 8n) + BigInt(buffer[offset + 7]);
    return num;
  }
}
function writeInt32(buffer, offset, value2, littleEndian) {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  if (value2 > 2147483647 || value2 < -2147483648) {
    throw new Error(`The value of "value" is out of range. It must be >= ${-2147483648} and <= ${2147483647}. Received ${value2}`);
  }
  littleEndian = littleEndian.toUpperCase();
  if (littleEndian === "LE") {
    buffer[offset] = value2 & 255;
    buffer[offset + 1] = value2 >> 8 & 255;
    buffer[offset + 2] = value2 >> 16 & 255;
    buffer[offset + 3] = value2 >> 24 & 255;
  } else {
    buffer[offset] = value2 >> 24 & 255;
    buffer[offset + 1] = value2 >> 16 & 255;
    buffer[offset + 2] = value2 >> 8 & 255;
    buffer[offset + 3] = value2 & 255;
  }
  return offset + 4;
}
function writeInt64(buffer, offset, value2, littleEndian) {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  if (value2 > 0x7fffffffffffffffn || value2 < -0x8000000000000000n) {
    throw new Error(`The value of "value" is out of range. It must be >= ${-0x8000000000000000n} and <= ${0x7fffffffffffffffn}. Received ${value2}`);
  }
  littleEndian = littleEndian.toUpperCase();
  if (littleEndian === "LE") {
    buffer[offset] = Number(value2 & 0xffn);
    buffer[offset + 1] = Number(value2 >> 8n & 0xffn);
    buffer[offset + 2] = Number(value2 >> 16n & 0xffn);
    buffer[offset + 3] = Number(value2 >> 24n & 0xffn);
    buffer[offset + 4] = Number(value2 >> 32n & 0xffn);
    buffer[offset + 5] = Number(value2 >> 40n & 0xffn);
    buffer[offset + 6] = Number(value2 >> 48n & 0xffn);
    buffer[offset + 7] = Number(value2 >> 56n & 0xffn);
  } else {
    buffer[offset] = Number(value2 >> 56n & 0xffn);
    buffer[offset + 1] = Number(value2 >> 48n & 0xffn);
    buffer[offset + 2] = Number(value2 >> 40n & 0xffn);
    buffer[offset + 3] = Number(value2 >> 32n & 0xffn);
    buffer[offset + 4] = Number(value2 >> 24n & 0xffn);
    buffer[offset + 5] = Number(value2 >> 16n & 0xffn);
    buffer[offset + 6] = Number(value2 >> 8n & 0xffn);
    buffer[offset + 7] = Number(value2 & 0xffn);
  }
  return offset + 8;
}
function readInt32(buffer, offset, littleEndian) {
  if (offset + 4 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  if (littleEndian === "LE") {
    const val = buffer[offset] + (buffer[offset + 1] << 8) + (buffer[offset + 2] << 16) + (buffer[offset + 3] << 24 >>> 0);
    return buffer[offset + 3] <= 127 ? val : val - 4294967296;
  } else {
    const val = (buffer[offset] << 24 >>> 0) + (buffer[offset + 1] << 16) + (buffer[offset + 2] << 8) + buffer[offset + 3];
    return buffer[offset] <= 127 ? val : val - 4294967296;
  }
}
function readInt64(buffer, offset, littleEndian) {
  if (offset + 8 > buffer.length) {
    throw new Error("Offset is outside the bounds of Uint8Array");
  }
  littleEndian = littleEndian.toUpperCase();
  let num = 0n;
  if (littleEndian === "LE") {
    num = (num << 8n) + BigInt(buffer[offset + 7]);
    num = (num << 8n) + BigInt(buffer[offset + 6]);
    num = (num << 8n) + BigInt(buffer[offset + 5]);
    num = (num << 8n) + BigInt(buffer[offset + 4]);
    num = (num << 8n) + BigInt(buffer[offset + 3]);
    num = (num << 8n) + BigInt(buffer[offset + 2]);
    num = (num << 8n) + BigInt(buffer[offset + 1]);
    num = (num << 8n) + BigInt(buffer[offset]);
    return buffer[offset + 7] <= 127 ? num : num - 0x10000000000000000n;
  } else {
    let num2 = 0n;
    num2 = (num2 << 8n) + BigInt(buffer[offset]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 1]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 2]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 3]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 4]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 5]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 6]);
    num2 = (num2 << 8n) + BigInt(buffer[offset + 7]);
    return buffer[offset] <= 127 ? num2 : num2 - 0x10000000000000000n;
  }
}
var HEX_STRINGS, HEX_CODES, HEX_CODEPOINTS, ENCODER, DECODER;
var init_browser = __esm({
  "node_modules/uint8array-tools/src/mjs/browser.js"() {
    HEX_STRINGS = "0123456789abcdefABCDEF";
    HEX_CODES = HEX_STRINGS.split("").map((c) => c.codePointAt(0));
    HEX_CODEPOINTS = Array(256).fill(true).map((_, i) => {
      const s = String.fromCodePoint(i);
      const index = HEX_STRINGS.indexOf(s);
      return index < 0 ? void 0 : index < 16 ? index : index - 6;
    });
    ENCODER = new TextEncoder();
    DECODER = new TextDecoder();
  }
});

// node_modules/bitcoinjs-lib/src/esm/push_data.js
function encodingLength(i) {
  return i < OPS.OP_PUSHDATA1 ? 1 : i <= 255 ? 2 : i <= 65535 ? 3 : 5;
}
function encode2(buffer, num, offset) {
  const size = encodingLength(num);
  if (size === 1) {
    writeUInt8(buffer, offset, num);
  } else if (size === 2) {
    writeUInt8(buffer, offset, OPS.OP_PUSHDATA1);
    writeUInt8(buffer, offset + 1, num);
  } else if (size === 3) {
    writeUInt8(buffer, offset, OPS.OP_PUSHDATA2);
    writeUInt16(buffer, offset + 1, num, "LE");
  } else {
    writeUInt8(buffer, offset, OPS.OP_PUSHDATA4);
    writeUInt32(buffer, offset + 1, num, "LE");
  }
  return size;
}
function decode2(buffer, offset) {
  const opcode = readUInt8(buffer, offset);
  let num;
  let size;
  if (opcode < OPS.OP_PUSHDATA1) {
    num = opcode;
    size = 1;
  } else if (opcode === OPS.OP_PUSHDATA1) {
    if (offset + 2 > buffer.length) return null;
    num = readUInt8(buffer, offset + 1);
    size = 2;
  } else if (opcode === OPS.OP_PUSHDATA2) {
    if (offset + 3 > buffer.length) return null;
    num = readUInt16(buffer, offset + 1, "LE");
    size = 3;
  } else {
    if (offset + 5 > buffer.length) return null;
    if (opcode !== OPS.OP_PUSHDATA4) throw new Error("Unexpected opcode");
    num = readUInt32(buffer, offset + 1, "LE");
    size = 5;
  }
  return {
    opcode,
    number: num,
    size
  };
}
var init_push_data = __esm({
  "node_modules/bitcoinjs-lib/src/esm/push_data.js"() {
    init_ops();
    init_browser();
  }
});

// node_modules/bitcoinjs-lib/src/esm/script_number.js
var script_number_exports = {};
__export(script_number_exports, {
  decode: () => decode3,
  encode: () => encode3
});
function decode3(buffer, maxLength, minimal) {
  maxLength = maxLength || 4;
  minimal = minimal === void 0 ? true : minimal;
  const length2 = buffer.length;
  if (length2 === 0) return 0;
  if (length2 > maxLength) throw new TypeError("Script number overflow");
  if (minimal) {
    if ((buffer[length2 - 1] & 127) === 0) {
      if (length2 <= 1 || (buffer[length2 - 2] & 128) === 0)
        throw new Error("Non-minimally encoded script number");
    }
  }
  if (length2 === 5) {
    const a = readUInt32(buffer, 0, "LE");
    const b = readUInt8(buffer, 4);
    if (b & 128) return -((b & ~128) * 4294967296 + a);
    return b * 4294967296 + a;
  }
  let result = 0;
  for (let i = 0; i < length2; ++i) {
    result |= buffer[i] << 8 * i;
  }
  if (buffer[length2 - 1] & 128)
    return -(result & ~(128 << 8 * (length2 - 1)));
  return result;
}
function scriptNumSize(i) {
  return i > 2147483647 ? 5 : i > 8388607 ? 4 : i > 32767 ? 3 : i > 127 ? 2 : i > 0 ? 1 : 0;
}
function encode3(_number) {
  let value2 = Math.abs(_number);
  const size = scriptNumSize(value2);
  const buffer = new Uint8Array(size);
  const negative = _number < 0;
  for (let i = 0; i < size; ++i) {
    writeUInt8(buffer, i, value2 & 255);
    value2 >>= 8;
  }
  if (buffer[size - 1] & 128) {
    writeUInt8(buffer, size - 1, negative ? 128 : 0);
  } else if (negative) {
    buffer[size - 1] |= 128;
  }
  return buffer;
}
var init_script_number = __esm({
  "node_modules/bitcoinjs-lib/src/esm/script_number.js"() {
    init_browser();
  }
});

// node_modules/valibot/dist/index.mjs
// @__NO_SIDE_EFFECTS__
function getGlobalConfig(config$1) {
  if (!config$1 && !store$4) return DEFAULT_CONFIG;
  return {
    lang: config$1?.lang ?? store$4?.lang,
    message: config$1?.message,
    abortEarly: config$1?.abortEarly ?? store$4?.abortEarly,
    abortPipeEarly: config$1?.abortPipeEarly ?? store$4?.abortPipeEarly
  };
}
// @__NO_SIDE_EFFECTS__
function getGlobalMessage(lang) {
  return store$3?.get(lang);
}
// @__NO_SIDE_EFFECTS__
function getSchemaMessage(lang) {
  return store$2?.get(lang);
}
// @__NO_SIDE_EFFECTS__
function getSpecificMessage(reference, lang) {
  return store$1?.get(reference)?.get(lang);
}
// @__NO_SIDE_EFFECTS__
function _stringify(input) {
  const type = typeof input;
  if (type === "string") return `"${input}"`;
  if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
  if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
  return type;
}
function _addIssue(context2, label, dataset, config$1, other) {
  const input = other && "input" in other ? other.input : dataset.value;
  const expected14 = other?.expected ?? context2.expects ?? null;
  const received = other?.received ?? /* @__PURE__ */ _stringify(input);
  const issue = {
    kind: context2.kind,
    type: context2.type,
    input,
    expected: expected14,
    received,
    message: `Invalid ${label}: ${expected14 ? `Expected ${expected14} but r` : "R"}eceived ${received}`,
    requirement: context2.requirement,
    path: other?.path,
    issues: other?.issues,
    lang: config$1.lang,
    abortEarly: config$1.abortEarly,
    abortPipeEarly: config$1.abortPipeEarly
  };
  const isSchema = context2.kind === "schema";
  const message$1 = other?.message ?? context2.message ?? /* @__PURE__ */ getSpecificMessage(context2.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
  if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
  if (isSchema) dataset.typed = false;
  if (dataset.issues) dataset.issues.push(issue);
  else dataset.issues = [issue];
}
// @__NO_SIDE_EFFECTS__
function _joinExpects(values$1, separator) {
  const list = [...new Set(values$1)];
  if (list.length > 1) return `(${list.join(` ${separator} `)})`;
  return list[0] ?? "never";
}
function _standardSchema(schema) {
  schema["~standard"] = {
    version: 1,
    vendor: "valibot",
    validate: (value$1) => schema["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig())
  };
  return schema;
}
// @__NO_SIDE_EFFECTS__
function everyItem(requirement, message$1) {
  return {
    kind: "validation",
    type: "every_item",
    reference: everyItem,
    async: false,
    expects: null,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !dataset.value.every(this.requirement)) _addIssue(this, "item", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function integer(message$1) {
  return {
    kind: "validation",
    type: "integer",
    reference: integer,
    async: false,
    expects: null,
    requirement: Number.isInteger,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "integer", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function length(requirement, message$1) {
  return {
    kind: "validation",
    type: "length",
    reference: length,
    async: false,
    expects: `${requirement}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && dataset.value.length !== this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function maxValue(requirement, message$1) {
  return {
    kind: "validation",
    type: "max_value",
    reference: maxValue,
    async: false,
    expects: `<=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !(dataset.value <= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function minValue(requirement, message$1) {
  return {
    kind: "validation",
    type: "min_value",
    reference: minValue,
    async: false,
    expects: `>=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !(dataset.value >= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function regex(requirement, message$1) {
  return {
    kind: "validation",
    type: "regex",
    reference: regex,
    async: false,
    expects: `${requirement}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "format", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function getFallback(schema, dataset, config$1) {
  return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
// @__NO_SIDE_EFFECTS__
function getDefault(schema, dataset, config$1) {
  return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
// @__NO_SIDE_EFFECTS__
function is(schema, input) {
  return !schema["~run"]({ value: input }, ABORT_EARLY_CONFIG).issues;
}
// @__NO_SIDE_EFFECTS__
function any() {
  return _standardSchema({
    kind: "schema",
    type: "any",
    reference: any,
    expects: "any",
    async: false,
    "~run"(dataset) {
      dataset.typed = true;
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function array(item, message$1) {
  return _standardSchema({
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    async: false,
    item,
    message: message$1,
    "~run"(dataset, config$1) {
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < input.length; key++) {
          const value$1 = input[key];
          const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value$1
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) issue.path.unshift(pathItem);
              else issue.path = [pathItem];
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) dataset.issues = itemDataset.issues;
            if (config$1.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) dataset.typed = false;
          dataset.value.push(itemDataset.value);
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function bigint(message$1) {
  return _standardSchema({
    kind: "schema",
    type: "bigint",
    reference: bigint,
    expects: "bigint",
    async: false,
    message: message$1,
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "bigint") dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function custom(check$1, message$1) {
  return _standardSchema({
    kind: "schema",
    type: "custom",
    reference: custom,
    expects: "unknown",
    async: false,
    check: check$1,
    message: message$1,
    "~run"(dataset, config$1) {
      if (this.check(dataset.value)) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function instance(class_, message$1) {
  return _standardSchema({
    kind: "schema",
    type: "instance",
    reference: instance,
    expects: class_.name,
    async: false,
    class: class_,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.value instanceof this.class) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function nullable(wrapped, default_) {
  return _standardSchema({
    kind: "schema",
    type: "nullable",
    reference: nullable,
    expects: `(${wrapped.expects} | null)`,
    async: false,
    wrapped,
    default: default_,
    "~run"(dataset, config$1) {
      if (dataset.value === null) {
        if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
        if (dataset.value === null) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  });
}
// @__NO_SIDE_EFFECTS__
function nullish(wrapped, default_) {
  return _standardSchema({
    kind: "schema",
    type: "nullish",
    reference: nullish,
    expects: `(${wrapped.expects} | null | undefined)`,
    async: false,
    wrapped,
    default: default_,
    "~run"(dataset, config$1) {
      if (dataset.value === null || dataset.value === void 0) {
        if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
        if (dataset.value === null || dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  });
}
// @__NO_SIDE_EFFECTS__
function number(message$1) {
  return _standardSchema({
    kind: "schema",
    type: "number",
    reference: number,
    expects: "number",
    async: false,
    message: message$1,
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function object(entries$1, message$1) {
  return _standardSchema({
    kind: "schema",
    type: "object",
    reference: object,
    expects: "Object",
    async: false,
    entries: entries$1,
    message: message$1,
    "~run"(dataset, config$1) {
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const key in this.entries) {
          const valueSchema = this.entries[key];
          if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
            const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
            const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key,
                value: value$1
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) dataset.issues = valueDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!valueDataset.typed) dataset.typed = false;
            dataset.value[key] = valueDataset.value;
          } else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
          else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
            _addIssue(this, "key", dataset, config$1, {
              input: void 0,
              expected: `"${key}"`,
              path: [{
                type: "object",
                origin: "key",
                input,
                key,
                value: input[key]
              }]
            });
            if (config$1.abortEarly) break;
          }
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function optional(wrapped, default_) {
  return _standardSchema({
    kind: "schema",
    type: "optional",
    reference: optional,
    expects: `(${wrapped.expects} | undefined)`,
    async: false,
    wrapped,
    default: default_,
    "~run"(dataset, config$1) {
      if (dataset.value === void 0) {
        if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
        if (dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  });
}
// @__NO_SIDE_EFFECTS__
function string(message$1) {
  return _standardSchema({
    kind: "schema",
    type: "string",
    reference: string,
    expects: "string",
    async: false,
    message: message$1,
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "string") dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function tuple(items, message$1) {
  return _standardSchema({
    kind: "schema",
    type: "tuple",
    reference: tuple,
    expects: "Array",
    async: false,
    items,
    message: message$1,
    "~run"(dataset, config$1) {
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < this.items.length; key++) {
          const value$1 = input[key];
          const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value$1
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) issue.path.unshift(pathItem);
              else issue.path = [pathItem];
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) dataset.issues = itemDataset.issues;
            if (config$1.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) dataset.typed = false;
          dataset.value.push(itemDataset.value);
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  });
}
// @__NO_SIDE_EFFECTS__
function _subIssues(datasets) {
  let issues;
  if (datasets) for (const dataset of datasets) if (issues) for (const issue of dataset.issues) issues.push(issue);
  else issues = dataset.issues;
  return issues;
}
// @__NO_SIDE_EFFECTS__
function union(options, message$1) {
  return _standardSchema({
    kind: "schema",
    type: "union",
    reference: union,
    expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
    async: false,
    options,
    message: message$1,
    "~run"(dataset, config$1) {
      let validDataset;
      let typedDatasets;
      let untypedDatasets;
      for (const schema of this.options) {
        const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
        if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
        else typedDatasets = [optionDataset];
        else {
          validDataset = optionDataset;
          break;
        }
        else if (untypedDatasets) untypedDatasets.push(optionDataset);
        else untypedDatasets = [optionDataset];
      }
      if (validDataset) return validDataset;
      if (typedDatasets) {
        if (typedDatasets.length === 1) return typedDatasets[0];
        _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
        dataset.typed = true;
      } else if (untypedDatasets?.length === 1) return untypedDatasets[0];
      else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
      return dataset;
    }
  });
}
function parse(schema, input, config$1) {
  const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
  if (dataset.issues) throw new ValiError(dataset.issues);
  return dataset.value;
}
// @__NO_SIDE_EFFECTS__
function partial(schema, keys) {
  const entries$1 = {};
  for (const key in schema.entries) entries$1[key] = !keys || keys.includes(key) ? /* @__PURE__ */ optional(schema.entries[key]) : schema.entries[key];
  return _standardSchema({
    ...schema,
    entries: entries$1
  });
}
// @__NO_SIDE_EFFECTS__
function pipe(...pipe$1) {
  return _standardSchema({
    ...pipe$1[0],
    pipe: pipe$1,
    "~run"(dataset, config$1) {
      for (const item of pipe$1) if (item.kind !== "metadata") {
        if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
          dataset.typed = false;
          break;
        }
        if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
      }
      return dataset;
    }
  });
}
var store$4, DEFAULT_CONFIG, store$3, store$2, store$1, ValiError, EMOJI_REGEX, ABORT_EARLY_CONFIG;
var init_dist = __esm({
  "node_modules/valibot/dist/index.mjs"() {
    DEFAULT_CONFIG = {
      lang: void 0,
      message: void 0,
      abortEarly: void 0,
      abortPipeEarly: void 0
    };
    ValiError = class extends Error {
      /**
      * Creates a Valibot error with useful information.
      *
      * @param issues The error issues.
      */
      constructor(issues) {
        super(issues[0].message);
        this.name = "ValiError";
        this.issues = issues;
      }
    };
    EMOJI_REGEX = new RegExp("^(?:[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|(?![\\p{Emoji_Modifier_Base}\\u{1F1E6}-\\u{1F1FF}])\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|(?![\\p{Emoji_Modifier_Base}\\u{1F1E6}-\\u{1F1FF}])\\p{Emoji_Presentation}))*)+$", "u");
    ABORT_EARLY_CONFIG = { abortEarly: true };
  }
});

// node_modules/bitcoinjs-lib/src/esm/types.js
function stacksEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((x, i) => {
    return compare(x, b[i]) === 0;
  });
}
function isPoint(p) {
  if (!(p instanceof Uint8Array)) return false;
  if (p.length < 33) return false;
  const t = p[0];
  const x = p.slice(1, 33);
  if (compare(ZERO32, x) === 0) return false;
  if (compare(x, EC_P) >= 0) return false;
  if ((t === 2 || t === 3) && p.length === 33) {
    return true;
  }
  const y = p.slice(33);
  if (compare(ZERO32, y) === 0) return false;
  if (compare(y, EC_P) >= 0) return false;
  if (t === 4 && p.length === 65) return true;
  return false;
}
function isTapleaf(o) {
  if (!o || !("output" in o)) return false;
  if (!(o.output instanceof Uint8Array)) return false;
  if (o.version !== void 0)
    return (o.version & TAPLEAF_VERSION_MASK) === o.version;
  return true;
}
function isTaptree(scriptTree) {
  if (!Array.isArray(scriptTree)) return isTapleaf(scriptTree);
  if (scriptTree.length !== 2) return false;
  return scriptTree.every((t) => isTaptree(t));
}
var ZERO32, EC_P, NBufferSchemaFactory, TAPLEAF_VERSION_MASK, Buffer256bitSchema, Hash160bitSchema, Hash256bitSchema, BufferSchema, HexSchema, UInt8Schema, UInt32Schema, SatoshiSchema, NullablePartial;
var init_types = __esm({
  "node_modules/bitcoinjs-lib/src/esm/types.js"() {
    init_browser();
    init_dist();
    ZERO32 = new Uint8Array(32);
    EC_P = fromHex(
      "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"
    );
    NBufferSchemaFactory = (size) => pipe(instance(Uint8Array), length(size));
    TAPLEAF_VERSION_MASK = 254;
    Buffer256bitSchema = NBufferSchemaFactory(32);
    Hash160bitSchema = NBufferSchemaFactory(20);
    Hash256bitSchema = NBufferSchemaFactory(32);
    BufferSchema = instance(Uint8Array);
    HexSchema = pipe(string(), regex(/^([0-9a-f]{2})+$/i));
    UInt8Schema = pipe(
      number(),
      integer(),
      minValue(0),
      maxValue(255)
    );
    UInt32Schema = pipe(
      number(),
      integer(),
      minValue(0),
      maxValue(4294967295)
    );
    SatoshiSchema = pipe(
      bigint(),
      minValue(0n),
      maxValue(0x7fffffffffffffffn)
    );
    NullablePartial = (a) => object(
      Object.entries(a).reduce(
        (acc, next) => ({ ...acc, [next[0]]: nullish(next[1]) }),
        {}
      )
    );
  }
});

// node_modules/bitcoinjs-lib/src/esm/script_signature.js
var script_signature_exports = {};
__export(script_signature_exports, {
  decode: () => decode4,
  encode: () => encode4
});
function toDER(x) {
  let i = 0;
  while (x[i] === 0) ++i;
  if (i === x.length) return ZERO;
  x = x.slice(i);
  if (x[0] & 128) return concat([ZERO, x]);
  return x;
}
function fromDER(x) {
  if (x[0] === 0) x = x.slice(1);
  const buffer = new Uint8Array(32);
  const bstart = Math.max(0, 32 - x.length);
  buffer.set(x, bstart);
  return buffer;
}
function decode4(buffer) {
  const hashType = readUInt8(buffer, buffer.length - 1);
  if (!isDefinedHashType(hashType)) {
    throw new Error("Invalid hashType " + hashType);
  }
  const decoded = decode(buffer.subarray(0, -1));
  const r = fromDER(decoded.r);
  const s = fromDER(decoded.s);
  const signature2 = concat([r, s]);
  return { signature: signature2, hashType };
}
function encode4(signature2, hashType) {
  parse(
    object({
      signature: NBufferSchemaFactory(64),
      hashType: UInt8Schema
    }),
    { signature: signature2, hashType }
  );
  if (!isDefinedHashType(hashType)) {
    throw new Error("Invalid hashType " + hashType);
  }
  const hashTypeBuffer = new Uint8Array(1);
  writeUInt8(hashTypeBuffer, 0, hashType);
  const r = toDER(signature2.slice(0, 32));
  const s = toDER(signature2.slice(32, 64));
  return concat([encode(r, s), hashTypeBuffer]);
}
var ZERO;
var init_script_signature = __esm({
  "node_modules/bitcoinjs-lib/src/esm/script_signature.js"() {
    init_bip66();
    init_script();
    init_dist();
    init_browser();
    init_types();
    ZERO = new Uint8Array(1);
  }
});

// node_modules/bitcoinjs-lib/src/esm/script.js
var script_exports = {};
__export(script_exports, {
  OPS: () => OPS,
  compile: () => compile,
  countNonPushOnlyOPs: () => countNonPushOnlyOPs,
  decompile: () => decompile,
  fromASM: () => fromASM,
  isCanonicalPubKey: () => isCanonicalPubKey,
  isCanonicalScriptSignature: () => isCanonicalScriptSignature,
  isDefinedHashType: () => isDefinedHashType,
  isPushOnly: () => isPushOnly,
  number: () => number2,
  signature: () => signature,
  toASM: () => toASM,
  toStack: () => toStack
});
function isOPInt(value2) {
  return is(number(), value2) && (value2 === OPS.OP_0 || value2 >= OPS.OP_1 && value2 <= OPS.OP_16 || value2 === OPS.OP_1NEGATE);
}
function isPushOnlyChunk(value2) {
  return is(BufferSchema, value2) || isOPInt(value2);
}
function isPushOnly(value2) {
  return is(pipe(any(), everyItem(isPushOnlyChunk)), value2);
}
function countNonPushOnlyOPs(value2) {
  return value2.length - value2.filter(isPushOnlyChunk).length;
}
function asMinimalOP(buffer) {
  if (buffer.length === 0) return OPS.OP_0;
  if (buffer.length !== 1) return;
  if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE + buffer[0];
  if (buffer[0] === 129) return OPS.OP_1NEGATE;
}
function chunksIsBuffer(buf) {
  return buf instanceof Uint8Array;
}
function chunksIsArray(buf) {
  return is(StackSchema, buf);
}
function singleChunkIsBuffer(buf) {
  return buf instanceof Uint8Array;
}
function compile(chunks) {
  if (chunksIsBuffer(chunks)) return chunks;
  parse(StackSchema, chunks);
  const bufferSize = chunks.reduce((accum, chunk) => {
    if (singleChunkIsBuffer(chunk)) {
      if (chunk.length === 1 && asMinimalOP(chunk) !== void 0) {
        return accum + 1;
      }
      return accum + encodingLength(chunk.length) + chunk.length;
    }
    return accum + 1;
  }, 0);
  const buffer = new Uint8Array(bufferSize);
  let offset = 0;
  chunks.forEach((chunk) => {
    if (singleChunkIsBuffer(chunk)) {
      const opcode = asMinimalOP(chunk);
      if (opcode !== void 0) {
        writeUInt8(buffer, offset, opcode);
        offset += 1;
        return;
      }
      offset += encode2(buffer, chunk.length, offset);
      buffer.set(chunk, offset);
      offset += chunk.length;
    } else {
      writeUInt8(buffer, offset, chunk);
      offset += 1;
    }
  });
  if (offset !== buffer.length) throw new Error("Could not decode chunks");
  return buffer;
}
function decompile(buffer) {
  if (chunksIsArray(buffer)) return buffer;
  parse(BufferSchema, buffer);
  const chunks = [];
  let i = 0;
  while (i < buffer.length) {
    const opcode = buffer[i];
    if (opcode > OPS.OP_0 && opcode <= OPS.OP_PUSHDATA4) {
      const d = decode2(buffer, i);
      if (d === null) return null;
      i += d.size;
      if (i + d.number > buffer.length) return null;
      const data = buffer.slice(i, i + d.number);
      i += d.number;
      const op = asMinimalOP(data);
      if (op !== void 0) {
        chunks.push(op);
      } else {
        chunks.push(data);
      }
    } else {
      chunks.push(opcode);
      i += 1;
    }
  }
  return chunks;
}
function toASM(chunks) {
  if (chunksIsBuffer(chunks)) {
    chunks = decompile(chunks);
  }
  if (!chunks) {
    throw new Error("Could not convert invalid chunks to ASM");
  }
  return chunks.map((chunk) => {
    if (singleChunkIsBuffer(chunk)) {
      const op = asMinimalOP(chunk);
      if (op === void 0) return toHex(chunk);
      chunk = op;
    }
    return OPS[chunk];
  }).join(" ");
}
function fromASM(asm) {
  parse(string(), asm);
  return compile(
    asm.split(" ").map((chunk) => {
      if (isNaN(Number(chunk)) && chunk in OPS) {
        return OPS[chunk];
      }
      parse(HexSchema, chunk);
      return fromHex(chunk);
    })
  );
}
function toStack(chunks) {
  chunks = decompile(chunks);
  parse(custom(isPushOnly), chunks);
  return chunks.map((op) => {
    if (singleChunkIsBuffer(op)) return op;
    if (op === OPS.OP_0) return new Uint8Array(0);
    return encode3(op - OP_INT_BASE);
  });
}
function isCanonicalPubKey(buffer) {
  return isPoint(buffer);
}
function isDefinedHashType(hashType) {
  const hashTypeMod = hashType & ~128;
  return hashTypeMod > 0 && hashTypeMod < 4;
}
function isCanonicalScriptSignature(buffer) {
  if (!(buffer instanceof Uint8Array)) return false;
  if (!isDefinedHashType(buffer[buffer.length - 1])) return false;
  return check(buffer.slice(0, -1));
}
var OP_INT_BASE, StackSchema, number2, signature;
var init_script = __esm({
  "node_modules/bitcoinjs-lib/src/esm/script.js"() {
    init_bip66();
    init_ops();
    init_push_data();
    init_script_number();
    init_script_signature();
    init_types();
    init_browser();
    init_dist();
    OP_INT_BASE = OPS.OP_RESERVED;
    StackSchema = array(union([instance(Uint8Array), number()]));
    number2 = script_number_exports;
    signature = script_signature_exports;
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/lazy.js
function prop(object2, name, f) {
  Object.defineProperty(object2, name, {
    configurable: true,
    enumerable: true,
    get() {
      const _value = f.call(this);
      this[name] = _value;
      return _value;
    },
    set(_value) {
      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        value: _value,
        writable: true
      });
    }
  });
}
function value(f) {
  let _value;
  return () => {
    if (_value !== void 0) return _value;
    _value = f();
    return _value;
  };
}
var init_lazy = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/lazy.js"() {
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/embed.js
function p2data(a, opts) {
  if (!a.data && !a.output) throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    partial(
      object({
        network: object({}),
        output: BufferSchema,
        data: array(BufferSchema)
      })
    ),
    a
  );
  const network = a.network || bitcoin;
  const o = { name: "embed", network };
  prop(o, "output", () => {
    if (!a.data) return;
    return compile([OPS2.OP_RETURN].concat(a.data));
  });
  prop(o, "data", () => {
    if (!a.output) return;
    return decompile(a.output).slice(1);
  });
  if (opts.validate) {
    if (a.output) {
      const chunks = decompile(a.output);
      if (chunks[0] !== OPS2.OP_RETURN) throw new TypeError("Output is invalid");
      if (!chunks.slice(1).every((chunk) => is(BufferSchema, chunk)))
        throw new TypeError("Output is invalid");
      if (a.data && !stacksEqual(a.data, o.data))
        throw new TypeError("Data mismatch");
    }
  }
  return Object.assign(o, a);
}
var OPS2;
var init_embed = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/embed.js"() {
    init_networks();
    init_script();
    init_types();
    init_lazy();
    init_dist();
    OPS2 = OPS;
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2ms.js
function encodeSmallOrScriptNum(n) {
  return n <= 16 ? OP_INT_BASE2 + n : encode3(n);
}
function decodeSmallOrScriptNum(chunk) {
  if (typeof chunk === "number") {
    const val = chunk - OP_INT_BASE2;
    if (val < 1 || val > 16)
      throw new TypeError(`Invalid opcode: expected OP_1\u2013OP_16, got ${chunk}`);
    return val;
  } else return decode3(chunk);
}
function isSmallOrScriptNum(chunk) {
  if (typeof chunk === "number")
    return chunk - OP_INT_BASE2 >= 1 && chunk - OP_INT_BASE2 <= 16;
  else return Number.isInteger(decode3(chunk));
}
function p2ms(a, opts) {
  if (!a.input && !a.output && !(a.pubkeys && a.m !== void 0) && !a.signatures)
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  function isAcceptableSignature(x) {
    return isCanonicalScriptSignature(x) || (opts.allowIncomplete && x === OPS3.OP_0) !== void 0;
  }
  parse(
    partial(
      object({
        network: object({}),
        m: number(),
        n: number(),
        output: BufferSchema,
        pubkeys: array(custom(isPoint), "Received invalid pubkey"),
        signatures: array(
          custom(isAcceptableSignature),
          "Expected signature to be of type isAcceptableSignature"
        ),
        input: BufferSchema
      })
    ),
    a
  );
  const network = a.network || bitcoin;
  const o = { network };
  let chunks = [];
  let decoded = false;
  function decode19(output) {
    if (decoded) return;
    decoded = true;
    chunks = decompile(output);
    if (chunks.length < 3) throw new TypeError("Output is invalid");
    o.m = decodeSmallOrScriptNum(chunks[0]);
    o.n = decodeSmallOrScriptNum(chunks[chunks.length - 2]);
    o.pubkeys = chunks.slice(1, -2);
  }
  prop(o, "output", () => {
    if (!a.m) return;
    if (!o.n) return;
    if (!a.pubkeys) return;
    return compile(
      [].concat(
        encodeSmallOrScriptNum(a.m),
        a.pubkeys,
        encodeSmallOrScriptNum(o.n),
        OPS3.OP_CHECKMULTISIG
      )
    );
  });
  prop(o, "m", () => {
    if (!o.output) return;
    decode19(o.output);
    return o.m;
  });
  prop(o, "n", () => {
    if (!o.pubkeys) return;
    return o.pubkeys.length;
  });
  prop(o, "pubkeys", () => {
    if (!a.output) return;
    decode19(a.output);
    return o.pubkeys;
  });
  prop(o, "signatures", () => {
    if (!a.input) return;
    return decompile(a.input).slice(1);
  });
  prop(o, "input", () => {
    if (!a.signatures) return;
    return compile([OPS3.OP_0].concat(a.signatures));
  });
  prop(o, "witness", () => {
    if (!o.input) return;
    return [];
  });
  prop(o, "name", () => {
    if (!o.m || !o.n) return;
    return `p2ms(${o.m} of ${o.n})`;
  });
  if (opts.validate) {
    if (a.output) {
      decode19(a.output);
      if (!isSmallOrScriptNum(chunks[0]))
        throw new TypeError("Output is invalid");
      if (!isSmallOrScriptNum(chunks[chunks.length - 2]))
        throw new TypeError("Output is invalid");
      if (chunks[chunks.length - 1] !== OPS3.OP_CHECKMULTISIG)
        throw new TypeError("Output is invalid");
      if (o.m <= 0 || o.n > 20 || o.m > o.n || o.n !== chunks.length - 3)
        throw new TypeError("Output is invalid");
      if (!o.pubkeys.every((x) => isPoint(x)))
        throw new TypeError("Output is invalid");
      if (a.m !== void 0 && a.m !== o.m) throw new TypeError("m mismatch");
      if (a.n !== void 0 && a.n !== o.n) throw new TypeError("n mismatch");
      if (a.pubkeys && !stacksEqual(a.pubkeys, o.pubkeys))
        throw new TypeError("Pubkeys mismatch");
    }
    if (a.pubkeys) {
      if (a.n !== void 0 && a.n !== a.pubkeys.length)
        throw new TypeError("Pubkey count mismatch");
      o.n = a.pubkeys.length;
      if (o.n < o.m) throw new TypeError("Pubkey count cannot be less than m");
    }
    if (a.signatures) {
      if (a.signatures.length < o.m)
        throw new TypeError("Not enough signatures provided");
      if (a.signatures.length > o.m)
        throw new TypeError("Too many signatures provided");
    }
    if (a.input) {
      if (a.input[0] !== OPS3.OP_0) throw new TypeError("Input is invalid");
      if (o.signatures.length === 0 || !o.signatures.every(isAcceptableSignature))
        throw new TypeError("Input has invalid signature(s)");
      if (a.signatures && !stacksEqual(a.signatures, o.signatures))
        throw new TypeError("Signature mismatch");
      if (a.m !== void 0 && a.m !== a.signatures.length)
        throw new TypeError("Signature count mismatch");
    }
  }
  return Object.assign(o, a);
}
var OPS3, OP_INT_BASE2;
var init_p2ms = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2ms.js"() {
    init_networks();
    init_script();
    init_script_number();
    init_types();
    init_lazy();
    init_dist();
    OPS3 = OPS;
    OP_INT_BASE2 = OPS3.OP_RESERVED;
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2pk.js
function p2pk(a, opts) {
  if (!a.input && !a.output && !a.pubkey && !a.input && !a.signature)
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    partial(
      object({
        network: object({}),
        output: BufferSchema,
        pubkey: custom(isPoint, "invalid pubkey"),
        signature: custom(
          isCanonicalScriptSignature,
          "Expected signature to be of type isCanonicalScriptSignature"
        ),
        input: BufferSchema
      })
    ),
    a
  );
  const _chunks = value(() => {
    return decompile(a.input);
  });
  const network = a.network || bitcoin;
  const o = { name: "p2pk", network };
  prop(o, "output", () => {
    if (!a.pubkey) return;
    return compile([a.pubkey, OPS4.OP_CHECKSIG]);
  });
  prop(o, "pubkey", () => {
    if (!a.output) return;
    return a.output.slice(1, -1);
  });
  prop(o, "signature", () => {
    if (!a.input) return;
    return _chunks()[0];
  });
  prop(o, "input", () => {
    if (!a.signature) return;
    return compile([a.signature]);
  });
  prop(o, "witness", () => {
    if (!o.input) return;
    return [];
  });
  if (opts.validate) {
    if (a.output) {
      if (a.output[a.output.length - 1] !== OPS4.OP_CHECKSIG)
        throw new TypeError("Output is invalid");
      if (!isPoint(o.pubkey)) throw new TypeError("Output pubkey is invalid");
      if (a.pubkey && compare(a.pubkey, o.pubkey) !== 0)
        throw new TypeError("Pubkey mismatch");
    }
    if (a.signature) {
      if (a.input && compare(a.input, o.input) !== 0)
        throw new TypeError("Signature mismatch");
    }
    if (a.input) {
      if (_chunks().length !== 1) throw new TypeError("Input is invalid");
      if (!isCanonicalScriptSignature(o.signature))
        throw new TypeError("Input has invalid signature");
    }
  }
  return Object.assign(o, a);
}
var OPS4;
var init_p2pk = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2pk.js"() {
    init_networks();
    init_script();
    init_types();
    init_lazy();
    init_browser();
    init_dist();
    OPS4 = OPS;
  }
});

// node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists(instance2, checkFinished = true) {
  if (instance2.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance2.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance2) {
  abytes(out);
  const min = instance2.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var Hash;
var init_utils = __esm({
  "node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/utils.js"() {
    Hash = class {
    };
  }
});

// node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value2, isLE) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value2, isLE);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value2 >> _32n2 & _u32_max);
  const wl = Number(value2 & _u32_max);
  const h = isLE ? 4 : 0;
  const l = isLE ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE);
  view.setUint32(byteOffset + l, wl, isLE);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV;
var init_md = __esm({
  "node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/_md.js"() {
    init_utils();
    HashMD = class extends Hash {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
      }
      update(data) {
        aexists(this);
        data = toBytes(data);
        abytes(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists(this);
        aoutput(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        clean(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length: length2, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length2;
        to.pos = pos;
        if (length2 % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
  }
});

// node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/legacy.js
function ripemd_f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
var Rho160, Id160, Pi160, idxLR, idxL, idxR, shifts160, shiftsL160, shiftsR160, Kl160, Kr160, BUF_160, RIPEMD160, ripemd160;
var init_legacy = __esm({
  "node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/legacy.js"() {
    init_md();
    init_utils();
    Rho160 = /* @__PURE__ */ Uint8Array.from([
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8
    ]);
    Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
    Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
    idxLR = /* @__PURE__ */ (() => {
      const L = [Id160];
      const R = [Pi160];
      const res = [L, R];
      for (let i = 0; i < 4; i++)
        for (let j of res)
          j.push(j[i].map((k) => Rho160[k]));
      return res;
    })();
    idxL = /* @__PURE__ */ (() => idxLR[0])();
    idxR = /* @__PURE__ */ (() => idxLR[1])();
    shifts160 = /* @__PURE__ */ [
      [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
      [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
      [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
      [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
      [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
    ].map((i) => Uint8Array.from(i));
    shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
    shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
    Kl160 = /* @__PURE__ */ Uint32Array.from([
      0,
      1518500249,
      1859775393,
      2400959708,
      2840853838
    ]);
    Kr160 = /* @__PURE__ */ Uint32Array.from([
      1352829926,
      1548603684,
      1836072691,
      2053994217,
      0
    ]);
    BUF_160 = /* @__PURE__ */ new Uint32Array(16);
    RIPEMD160 = class extends HashMD {
      constructor() {
        super(64, 20, 8, true);
        this.h0 = 1732584193 | 0;
        this.h1 = 4023233417 | 0;
        this.h2 = 2562383102 | 0;
        this.h3 = 271733878 | 0;
        this.h4 = 3285377520 | 0;
      }
      get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
      }
      set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          BUF_160[i] = view.getUint32(offset, true);
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        for (let group = 0; group < 5; group++) {
          const rGroup = 4 - group;
          const hbl = Kl160[group], hbr = Kr160[group];
          const rl = idxL[group], rr = idxR[group];
          const sl = shiftsL160[group], sr = shiftsR160[group];
          for (let i = 0; i < 16; i++) {
            const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
            al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
          }
          for (let i = 0; i < 16; i++) {
            const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
            ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
          }
        }
        this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
      }
      roundClean() {
        clean(BUF_160);
      }
      destroy() {
        this.destroyed = true;
        clean(this.buffer);
        this.set(0, 0, 0, 0, 0);
      }
    };
    ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());
  }
});

// node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/ripemd160.js
var ripemd1602;
var init_ripemd160 = __esm({
  "node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/ripemd160.js"() {
    init_legacy();
    ripemd1602 = ripemd160;
  }
});

// node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/sha2.js
var SHA256_K, SHA256_W, SHA256, sha256;
var init_sha2 = __esm({
  "node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/sha2.js"() {
    init_md();
    init_utils();
    SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    SHA256 = class extends HashMD {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
          const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean(SHA256_W);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
  }
});

// node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/sha256.js
var sha2562;
var init_sha256 = __esm({
  "node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/sha256.js"() {
    init_sha2();
    sha2562 = sha256;
  }
});

// node_modules/bitcoinjs-lib/src/esm/crypto.js
function hash160(buffer) {
  return ripemd1602(sha2562(buffer));
}
function hash256(buffer) {
  return sha2562(sha2562(buffer));
}
function taggedHash(prefix, data) {
  return sha2562(concat([TAGGED_HASH_PREFIXES[prefix], data]));
}
var TAGGED_HASH_PREFIXES;
var init_crypto = __esm({
  "node_modules/bitcoinjs-lib/src/esm/crypto.js"() {
    init_ripemd160();
    init_sha256();
    init_browser();
    TAGGED_HASH_PREFIXES = {
      "BIP0340/challenge": Uint8Array.from([
        123,
        181,
        45,
        122,
        159,
        239,
        88,
        50,
        62,
        177,
        191,
        122,
        64,
        125,
        179,
        130,
        210,
        243,
        242,
        216,
        27,
        177,
        34,
        79,
        73,
        254,
        81,
        143,
        109,
        72,
        211,
        124,
        123,
        181,
        45,
        122,
        159,
        239,
        88,
        50,
        62,
        177,
        191,
        122,
        64,
        125,
        179,
        130,
        210,
        243,
        242,
        216,
        27,
        177,
        34,
        79,
        73,
        254,
        81,
        143,
        109,
        72,
        211,
        124
      ]),
      "BIP0340/aux": Uint8Array.from([
        241,
        239,
        78,
        94,
        192,
        99,
        202,
        218,
        109,
        148,
        202,
        250,
        157,
        152,
        126,
        160,
        105,
        38,
        88,
        57,
        236,
        193,
        31,
        151,
        45,
        119,
        165,
        46,
        216,
        193,
        204,
        144,
        241,
        239,
        78,
        94,
        192,
        99,
        202,
        218,
        109,
        148,
        202,
        250,
        157,
        152,
        126,
        160,
        105,
        38,
        88,
        57,
        236,
        193,
        31,
        151,
        45,
        119,
        165,
        46,
        216,
        193,
        204,
        144
      ]),
      "BIP0340/nonce": Uint8Array.from([
        7,
        73,
        119,
        52,
        167,
        155,
        203,
        53,
        91,
        155,
        140,
        125,
        3,
        79,
        18,
        28,
        244,
        52,
        215,
        62,
        247,
        45,
        218,
        25,
        135,
        0,
        97,
        251,
        82,
        191,
        235,
        47,
        7,
        73,
        119,
        52,
        167,
        155,
        203,
        53,
        91,
        155,
        140,
        125,
        3,
        79,
        18,
        28,
        244,
        52,
        215,
        62,
        247,
        45,
        218,
        25,
        135,
        0,
        97,
        251,
        82,
        191,
        235,
        47
      ]),
      TapLeaf: Uint8Array.from([
        174,
        234,
        143,
        220,
        66,
        8,
        152,
        49,
        5,
        115,
        75,
        88,
        8,
        29,
        30,
        38,
        56,
        211,
        95,
        28,
        181,
        64,
        8,
        212,
        211,
        87,
        202,
        3,
        190,
        120,
        233,
        238,
        174,
        234,
        143,
        220,
        66,
        8,
        152,
        49,
        5,
        115,
        75,
        88,
        8,
        29,
        30,
        38,
        56,
        211,
        95,
        28,
        181,
        64,
        8,
        212,
        211,
        87,
        202,
        3,
        190,
        120,
        233,
        238
      ]),
      TapBranch: Uint8Array.from([
        25,
        65,
        161,
        242,
        229,
        110,
        185,
        95,
        162,
        169,
        241,
        148,
        190,
        92,
        1,
        247,
        33,
        111,
        51,
        237,
        130,
        176,
        145,
        70,
        52,
        144,
        208,
        91,
        245,
        22,
        160,
        21,
        25,
        65,
        161,
        242,
        229,
        110,
        185,
        95,
        162,
        169,
        241,
        148,
        190,
        92,
        1,
        247,
        33,
        111,
        51,
        237,
        130,
        176,
        145,
        70,
        52,
        144,
        208,
        91,
        245,
        22,
        160,
        21
      ]),
      TapSighash: Uint8Array.from([
        244,
        10,
        72,
        223,
        75,
        42,
        112,
        200,
        180,
        146,
        75,
        242,
        101,
        70,
        97,
        237,
        61,
        149,
        253,
        102,
        163,
        19,
        235,
        135,
        35,
        117,
        151,
        198,
        40,
        228,
        160,
        49,
        244,
        10,
        72,
        223,
        75,
        42,
        112,
        200,
        180,
        146,
        75,
        242,
        101,
        70,
        97,
        237,
        61,
        149,
        253,
        102,
        163,
        19,
        235,
        135,
        35,
        117,
        151,
        198,
        40,
        228,
        160,
        49
      ]),
      TapTweak: Uint8Array.from([
        232,
        15,
        225,
        99,
        156,
        156,
        160,
        80,
        227,
        175,
        27,
        57,
        193,
        67,
        198,
        62,
        66,
        156,
        188,
        235,
        21,
        217,
        64,
        251,
        181,
        197,
        161,
        244,
        175,
        87,
        197,
        233,
        232,
        15,
        225,
        99,
        156,
        156,
        160,
        80,
        227,
        175,
        27,
        57,
        193,
        67,
        198,
        62,
        66,
        156,
        188,
        235,
        21,
        217,
        64,
        251,
        181,
        197,
        161,
        244,
        175,
        87,
        197,
        233
      ]),
      "KeyAgg list": Uint8Array.from([
        72,
        28,
        151,
        28,
        60,
        11,
        70,
        215,
        240,
        178,
        117,
        174,
        89,
        141,
        78,
        44,
        126,
        215,
        49,
        156,
        89,
        74,
        92,
        110,
        199,
        158,
        160,
        212,
        153,
        2,
        148,
        240,
        72,
        28,
        151,
        28,
        60,
        11,
        70,
        215,
        240,
        178,
        117,
        174,
        89,
        141,
        78,
        44,
        126,
        215,
        49,
        156,
        89,
        74,
        92,
        110,
        199,
        158,
        160,
        212,
        153,
        2,
        148,
        240
      ]),
      "KeyAgg coefficient": Uint8Array.from([
        191,
        201,
        4,
        3,
        77,
        28,
        136,
        232,
        200,
        14,
        34,
        229,
        61,
        36,
        86,
        109,
        100,
        130,
        78,
        214,
        66,
        114,
        129,
        192,
        145,
        0,
        249,
        77,
        205,
        82,
        201,
        129,
        191,
        201,
        4,
        3,
        77,
        28,
        136,
        232,
        200,
        14,
        34,
        229,
        61,
        36,
        86,
        109,
        100,
        130,
        78,
        214,
        66,
        114,
        129,
        192,
        145,
        0,
        249,
        77,
        205,
        82,
        201,
        129
      ])
    };
  }
});

// node_modules/bs58check/node_modules/@noble/hashes/esm/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes2(b, ...lengths) {
  if (!isBytes2(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists2(instance2, checkFinished = true) {
  if (instance2.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance2.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput2(out, instance2) {
  abytes2(out);
  const min = instance2.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function clean2(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr2(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes2(data);
  abytes2(data);
  return data;
}
function createHasher2(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var Hash2;
var init_utils2 = __esm({
  "node_modules/bs58check/node_modules/@noble/hashes/esm/utils.js"() {
    Hash2 = class {
    };
  }
});

// node_modules/bs58check/node_modules/@noble/hashes/esm/_md.js
function setBigUint642(view, byteOffset, value2, isLE) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value2, isLE);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value2 >> _32n2 & _u32_max);
  const wl = Number(value2 & _u32_max);
  const h = isLE ? 4 : 0;
  const l = isLE ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE);
  view.setUint32(byteOffset + l, wl, isLE);
}
function Chi2(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj2(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD2, SHA256_IV2;
var init_md2 = __esm({
  "node_modules/bs58check/node_modules/@noble/hashes/esm/_md.js"() {
    init_utils2();
    HashMD2 = class extends Hash2 {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView2(this.buffer);
      }
      update(data) {
        aexists2(this);
        data = toBytes2(data);
        abytes2(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView2(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        clean2(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint642(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView2(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length: length2, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length2;
        to.pos = pos;
        if (length2 % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV2 = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
  }
});

// node_modules/bs58check/node_modules/@noble/hashes/esm/sha2.js
var SHA256_K2, SHA256_W2, SHA2562, sha2563;
var init_sha22 = __esm({
  "node_modules/bs58check/node_modules/@noble/hashes/esm/sha2.js"() {
    init_md2();
    init_utils2();
    SHA256_K2 = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
    SHA2562 = class extends HashMD2 {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = SHA256_IV2[0] | 0;
        this.B = SHA256_IV2[1] | 0;
        this.C = SHA256_IV2[2] | 0;
        this.D = SHA256_IV2[3] | 0;
        this.E = SHA256_IV2[4] | 0;
        this.F = SHA256_IV2[5] | 0;
        this.G = SHA256_IV2[6] | 0;
        this.H = SHA256_IV2[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W2[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W2[i - 15];
          const W2 = SHA256_W2[i - 2];
          const s0 = rotr2(W15, 7) ^ rotr2(W15, 18) ^ W15 >>> 3;
          const s1 = rotr2(W2, 17) ^ rotr2(W2, 19) ^ W2 >>> 10;
          SHA256_W2[i] = s1 + SHA256_W2[i - 7] + s0 + SHA256_W2[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr2(E, 6) ^ rotr2(E, 11) ^ rotr2(E, 25);
          const T1 = H + sigma1 + Chi2(E, F, G) + SHA256_K2[i] + SHA256_W2[i] | 0;
          const sigma0 = rotr2(A, 2) ^ rotr2(A, 13) ^ rotr2(A, 22);
          const T2 = sigma0 + Maj2(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean2(SHA256_W2);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean2(this.buffer);
      }
    };
    sha2563 = /* @__PURE__ */ createHasher2(() => new SHA2562());
  }
});

// node_modules/bs58check/node_modules/@noble/hashes/esm/sha256.js
var sha2564;
var init_sha2562 = __esm({
  "node_modules/bs58check/node_modules/@noble/hashes/esm/sha256.js"() {
    init_sha22();
    sha2564 = sha2563;
  }
});

// node_modules/base-x/src/esm/index.js
function base(ALPHABET2) {
  if (ALPHABET2.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  const BASE_MAP = new Uint8Array(256);
  for (let j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (let i = 0; i < ALPHABET2.length; i++) {
    const x = ALPHABET2.charAt(i);
    const xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  const BASE = ALPHABET2.length;
  const LEADER = ALPHABET2.charAt(0);
  const FACTOR = Math.log(BASE) / Math.log(256);
  const iFACTOR = Math.log(256) / Math.log(BASE);
  function encode20(source) {
    if (source instanceof Uint8Array) {
    } else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    let zeroes = 0;
    let length2 = 0;
    let pbegin = 0;
    const pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    const b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      let carry = source[pbegin];
      let i = 0;
      for (let it1 = size - 1; (carry !== 0 || i < length2) && it1 !== -1; it1--, i++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i;
      pbegin++;
    }
    let it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    let str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET2.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    let psz = 0;
    let zeroes = 0;
    let length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    const size = (source.length - psz) * FACTOR + 1 >>> 0;
    const b256 = new Uint8Array(size);
    while (psz < source.length) {
      const charCode = source.charCodeAt(psz);
      if (charCode > 255) {
        return;
      }
      let carry = BASE_MAP[charCode];
      if (carry === 255) {
        return;
      }
      let i = 0;
      for (let it3 = size - 1; (carry !== 0 || i < length2) && it3 !== -1; it3--, i++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i;
      psz++;
    }
    let it4 = size - length2;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    const vch = new Uint8Array(zeroes + (size - it4));
    let j = zeroes;
    while (it4 !== size) {
      vch[j++] = b256[it4++];
    }
    return vch;
  }
  function decode19(string2) {
    const buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error("Non-base" + BASE + " character");
  }
  return {
    encode: encode20,
    decodeUnsafe,
    decode: decode19
  };
}
var esm_default;
var init_esm = __esm({
  "node_modules/base-x/src/esm/index.js"() {
    esm_default = base;
  }
});

// node_modules/bs58/src/esm/index.js
var ALPHABET, esm_default2;
var init_esm2 = __esm({
  "node_modules/bs58/src/esm/index.js"() {
    init_esm();
    ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    esm_default2 = esm_default(ALPHABET);
  }
});

// node_modules/bs58check/src/esm/base.js
function base_default(checksumFn) {
  function encode20(payload) {
    var payloadU8 = Uint8Array.from(payload);
    var checksum2 = checksumFn(payloadU8);
    var length2 = payloadU8.length + 4;
    var both = new Uint8Array(length2);
    both.set(payloadU8, 0);
    both.set(checksum2.subarray(0, 4), payloadU8.length);
    return esm_default2.encode(both);
  }
  function decodeRaw(buffer) {
    var payload = buffer.slice(0, -4);
    var checksum2 = buffer.slice(-4);
    var newChecksum = checksumFn(payload);
    if (checksum2[0] ^ newChecksum[0] | checksum2[1] ^ newChecksum[1] | checksum2[2] ^ newChecksum[2] | checksum2[3] ^ newChecksum[3])
      return;
    return payload;
  }
  function decodeUnsafe(str) {
    var buffer = esm_default2.decodeUnsafe(str);
    if (buffer == null)
      return;
    return decodeRaw(buffer);
  }
  function decode19(str) {
    var buffer = esm_default2.decode(str);
    var payload = decodeRaw(buffer);
    if (payload == null)
      throw new Error("Invalid checksum");
    return payload;
  }
  return {
    encode: encode20,
    decode: decode19,
    decodeUnsafe
  };
}
var init_base = __esm({
  "node_modules/bs58check/src/esm/base.js"() {
    "use strict";
    init_esm2();
  }
});

// node_modules/bs58check/src/esm/index.js
function sha256x2(buffer) {
  return sha2564(sha2564(buffer));
}
var esm_default3;
var init_esm3 = __esm({
  "node_modules/bs58check/src/esm/index.js"() {
    "use strict";
    init_sha2562();
    init_base();
    esm_default3 = base_default(sha256x2);
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2pkh.js
function p2pkh(a, opts) {
  if (!a.address && !a.hash && !a.output && !a.pubkey && !a.input)
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    partial(
      object({
        network: object({}),
        address: string(),
        hash: Hash160bitSchema,
        output: NBufferSchemaFactory(25),
        pubkey: custom(isPoint),
        signature: custom(isCanonicalScriptSignature),
        input: BufferSchema
      })
    ),
    a
  );
  const _address = value(() => {
    const payload = esm_default3.decode(a.address);
    const version = readUInt8(payload, 0);
    const hash = payload.slice(1);
    return { version, hash };
  });
  const _chunks = value(() => {
    return decompile(a.input);
  });
  const network = a.network || bitcoin;
  const o = { name: "p2pkh", network };
  prop(o, "address", () => {
    if (!o.hash) return;
    const payload = new Uint8Array(21);
    writeUInt8(payload, 0, network.pubKeyHash);
    payload.set(o.hash, 1);
    return esm_default3.encode(payload);
  });
  prop(o, "hash", () => {
    if (a.output) return a.output.slice(3, 23);
    if (a.address) return _address().hash;
    if (a.pubkey || o.pubkey) return hash160(a.pubkey || o.pubkey);
  });
  prop(o, "output", () => {
    if (!o.hash) return;
    return compile([
      OPS5.OP_DUP,
      OPS5.OP_HASH160,
      o.hash,
      OPS5.OP_EQUALVERIFY,
      OPS5.OP_CHECKSIG
    ]);
  });
  prop(o, "pubkey", () => {
    if (!a.input) return;
    return _chunks()[1];
  });
  prop(o, "signature", () => {
    if (!a.input) return;
    return _chunks()[0];
  });
  prop(o, "input", () => {
    if (!a.pubkey) return;
    if (!a.signature) return;
    return compile([a.signature, a.pubkey]);
  });
  prop(o, "witness", () => {
    if (!o.input) return;
    return [];
  });
  if (opts.validate) {
    let hash = Uint8Array.from([]);
    if (a.address) {
      if (_address().version !== network.pubKeyHash)
        throw new TypeError("Invalid version or Network mismatch");
      if (_address().hash.length !== 20) throw new TypeError("Invalid address");
      hash = _address().hash;
    }
    if (a.hash) {
      if (hash.length > 0 && compare(hash, a.hash) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = a.hash;
    }
    if (a.output) {
      if (a.output.length !== 25 || a.output[0] !== OPS5.OP_DUP || a.output[1] !== OPS5.OP_HASH160 || a.output[2] !== 20 || a.output[23] !== OPS5.OP_EQUALVERIFY || a.output[24] !== OPS5.OP_CHECKSIG)
        throw new TypeError("Output is invalid");
      const hash2 = a.output.slice(3, 23);
      if (hash.length > 0 && compare(hash, hash2) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = hash2;
    }
    if (a.pubkey) {
      const pkh = hash160(a.pubkey);
      if (hash.length > 0 && compare(hash, pkh) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = pkh;
    }
    if (a.input) {
      const chunks = _chunks();
      if (chunks.length !== 2) throw new TypeError("Input is invalid");
      if (!isCanonicalScriptSignature(chunks[0]))
        throw new TypeError("Input has invalid signature");
      if (!isPoint(chunks[1])) throw new TypeError("Input has invalid pubkey");
      if (a.signature && compare(a.signature, chunks[0]) !== 0)
        throw new TypeError("Signature mismatch");
      if (a.pubkey && compare(a.pubkey, chunks[1]) !== 0)
        throw new TypeError("Pubkey mismatch");
      const pkh = hash160(chunks[1]);
      if (hash.length > 0 && compare(hash, pkh) !== 0)
        throw new TypeError("Hash mismatch");
    }
  }
  return Object.assign(o, a);
}
var OPS5;
var init_p2pkh = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2pkh.js"() {
    init_crypto();
    init_networks();
    init_script();
    init_types();
    init_lazy();
    init_esm3();
    init_browser();
    init_dist();
    OPS5 = OPS;
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2sh.js
function p2sh(a, opts) {
  if (!a.address && !a.hash && !a.output && !a.redeem && !a.input)
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    partial(
      object({
        network: object({}),
        address: string(),
        hash: NBufferSchemaFactory(20),
        output: NBufferSchemaFactory(23),
        redeem: partial(
          object({
            network: object({}),
            output: BufferSchema,
            input: BufferSchema,
            witness: array(BufferSchema)
          })
        ),
        input: BufferSchema,
        witness: array(BufferSchema)
      })
    ),
    a
  );
  let network = a.network;
  if (!network) {
    network = a.redeem && a.redeem.network || bitcoin;
  }
  const o = { network };
  const _address = value(() => {
    const payload = esm_default3.decode(a.address);
    const version = readUInt8(payload, 0);
    const hash = payload.slice(1);
    return { version, hash };
  });
  const _chunks = value(() => {
    return decompile(a.input);
  });
  const _redeem = value(() => {
    const chunks = _chunks();
    const lastChunk = chunks[chunks.length - 1];
    return {
      network,
      output: lastChunk === OPS6.OP_FALSE ? Uint8Array.from([]) : lastChunk,
      input: compile(chunks.slice(0, -1)),
      witness: a.witness || []
    };
  });
  prop(o, "address", () => {
    if (!o.hash) return;
    const payload = new Uint8Array(21);
    writeUInt8(payload, 0, o.network.scriptHash);
    payload.set(o.hash, 1);
    return esm_default3.encode(payload);
  });
  prop(o, "hash", () => {
    if (a.output) return a.output.slice(2, 22);
    if (a.address) return _address().hash;
    if (o.redeem && o.redeem.output) return hash160(o.redeem.output);
  });
  prop(o, "output", () => {
    if (!o.hash) return;
    return compile([OPS6.OP_HASH160, o.hash, OPS6.OP_EQUAL]);
  });
  prop(o, "redeem", () => {
    if (!a.input) return;
    return _redeem();
  });
  prop(o, "input", () => {
    if (!a.redeem || !a.redeem.input || !a.redeem.output) return;
    return compile(
      [].concat(decompile(a.redeem.input), a.redeem.output)
    );
  });
  prop(o, "witness", () => {
    if (o.redeem && o.redeem.witness) return o.redeem.witness;
    if (o.input) return [];
  });
  prop(o, "name", () => {
    const nameParts = ["p2sh"];
    if (o.redeem !== void 0 && o.redeem.name !== void 0)
      nameParts.push(o.redeem.name);
    return nameParts.join("-");
  });
  if (opts.validate) {
    let hash = Uint8Array.from([]);
    if (a.address) {
      if (_address().version !== network.scriptHash)
        throw new TypeError("Invalid version or Network mismatch");
      if (_address().hash.length !== 20) throw new TypeError("Invalid address");
      hash = _address().hash;
    }
    if (a.hash) {
      if (hash.length > 0 && compare(hash, a.hash) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = a.hash;
    }
    if (a.output) {
      if (a.output.length !== 23 || a.output[0] !== OPS6.OP_HASH160 || a.output[1] !== 20 || a.output[22] !== OPS6.OP_EQUAL)
        throw new TypeError("Output is invalid");
      const hash2 = a.output.slice(2, 22);
      if (hash.length > 0 && compare(hash, hash2) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = hash2;
    }
    const checkRedeem = (redeem) => {
      if (redeem.output) {
        const decompile2 = decompile(redeem.output);
        if (!decompile2 || decompile2.length < 1)
          throw new TypeError("Redeem.output too short");
        if (redeem.output.byteLength > 520)
          throw new TypeError(
            "Redeem.output unspendable if larger than 520 bytes"
          );
        if (countNonPushOnlyOPs(decompile2) > 201)
          throw new TypeError(
            "Redeem.output unspendable with more than 201 non-push ops"
          );
        const hash2 = hash160(redeem.output);
        if (hash.length > 0 && compare(hash, hash2) !== 0)
          throw new TypeError("Hash mismatch");
        else hash = hash2;
      }
      if (redeem.input) {
        const hasInput = redeem.input.length > 0;
        const hasWitness = redeem.witness && redeem.witness.length > 0;
        if (!hasInput && !hasWitness) throw new TypeError("Empty input");
        if (hasInput && hasWitness)
          throw new TypeError("Input and witness provided");
        if (hasInput) {
          const richunks = decompile(redeem.input);
          if (!isPushOnly(richunks))
            throw new TypeError("Non push-only scriptSig");
        }
      }
    };
    if (a.input) {
      const chunks = _chunks();
      if (!chunks || chunks.length < 1) throw new TypeError("Input too short");
      if (!(_redeem().output instanceof Uint8Array))
        throw new TypeError("Input is invalid");
      checkRedeem(_redeem());
    }
    if (a.redeem) {
      if (a.redeem.network && a.redeem.network !== network)
        throw new TypeError("Network mismatch");
      if (a.input) {
        const redeem = _redeem();
        if (a.redeem.output && compare(a.redeem.output, redeem.output) !== 0)
          throw new TypeError("Redeem.output mismatch");
        if (a.redeem.input && compare(a.redeem.input, redeem.input) !== 0)
          throw new TypeError("Redeem.input mismatch");
      }
      checkRedeem(a.redeem);
    }
    if (a.witness) {
      if (a.redeem && a.redeem.witness && !stacksEqual(a.redeem.witness, a.witness))
        throw new TypeError("Witness and redeem.witness mismatch");
    }
  }
  return Object.assign(o, a);
}
var OPS6;
var init_p2sh = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2sh.js"() {
    init_crypto();
    init_networks();
    init_script();
    init_types();
    init_lazy();
    init_esm3();
    init_browser();
    init_dist();
    OPS6 = OPS;
  }
});

// node_modules/bech32/dist/index.js
var require_dist = __commonJS({
  "node_modules/bech32/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bech32m = exports.bech32 = void 0;
    var ALPHABET2 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    var ALPHABET_MAP = {};
    for (let z = 0; z < ALPHABET2.length; z++) {
      const x = ALPHABET2.charAt(z);
      ALPHABET_MAP[x] = z;
    }
    function polymodStep(pre) {
      const b = pre >> 25;
      return (pre & 33554431) << 5 ^ -(b >> 0 & 1) & 996825010 ^ -(b >> 1 & 1) & 642813549 ^ -(b >> 2 & 1) & 513874426 ^ -(b >> 3 & 1) & 1027748829 ^ -(b >> 4 & 1) & 705979059;
    }
    function prefixChk(prefix) {
      let chk = 1;
      for (let i = 0; i < prefix.length; ++i) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
          return "Invalid prefix (" + prefix + ")";
        chk = polymodStep(chk) ^ c >> 5;
      }
      chk = polymodStep(chk);
      for (let i = 0; i < prefix.length; ++i) {
        const v = prefix.charCodeAt(i);
        chk = polymodStep(chk) ^ v & 31;
      }
      return chk;
    }
    function convert(data, inBits, outBits, pad) {
      let value2 = 0;
      let bits = 0;
      const maxV = (1 << outBits) - 1;
      const result = [];
      for (let i = 0; i < data.length; ++i) {
        value2 = value2 << inBits | data[i];
        bits += inBits;
        while (bits >= outBits) {
          bits -= outBits;
          result.push(value2 >> bits & maxV);
        }
      }
      if (pad) {
        if (bits > 0) {
          result.push(value2 << outBits - bits & maxV);
        }
      } else {
        if (bits >= inBits)
          return "Excess padding";
        if (value2 << outBits - bits & maxV)
          return "Non-zero padding";
      }
      return result;
    }
    function toWords(bytes) {
      return convert(bytes, 8, 5, true);
    }
    function fromWordsUnsafe(words) {
      const res = convert(words, 5, 8, false);
      if (Array.isArray(res))
        return res;
    }
    function fromWords(words) {
      const res = convert(words, 5, 8, false);
      if (Array.isArray(res))
        return res;
      throw new Error(res);
    }
    function getLibraryFromEncoding(encoding) {
      let ENCODING_CONST;
      if (encoding === "bech32") {
        ENCODING_CONST = 1;
      } else {
        ENCODING_CONST = 734539939;
      }
      function encode20(prefix, words, LIMIT) {
        LIMIT = LIMIT || 90;
        if (prefix.length + 7 + words.length > LIMIT)
          throw new TypeError("Exceeds length limit");
        prefix = prefix.toLowerCase();
        let chk = prefixChk(prefix);
        if (typeof chk === "string")
          throw new Error(chk);
        let result = prefix + "1";
        for (let i = 0; i < words.length; ++i) {
          const x = words[i];
          if (x >> 5 !== 0)
            throw new Error("Non 5-bit word");
          chk = polymodStep(chk) ^ x;
          result += ALPHABET2.charAt(x);
        }
        for (let i = 0; i < 6; ++i) {
          chk = polymodStep(chk);
        }
        chk ^= ENCODING_CONST;
        for (let i = 0; i < 6; ++i) {
          const v = chk >> (5 - i) * 5 & 31;
          result += ALPHABET2.charAt(v);
        }
        return result;
      }
      function __decode(str, LIMIT) {
        LIMIT = LIMIT || 90;
        if (str.length < 8)
          return str + " too short";
        if (str.length > LIMIT)
          return "Exceeds length limit";
        const lowered = str.toLowerCase();
        const uppered = str.toUpperCase();
        if (str !== lowered && str !== uppered)
          return "Mixed-case string " + str;
        str = lowered;
        const split2 = str.lastIndexOf("1");
        if (split2 === -1)
          return "No separator character for " + str;
        if (split2 === 0)
          return "Missing prefix for " + str;
        const prefix = str.slice(0, split2);
        const wordChars = str.slice(split2 + 1);
        if (wordChars.length < 6)
          return "Data too short";
        let chk = prefixChk(prefix);
        if (typeof chk === "string")
          return chk;
        const words = [];
        for (let i = 0; i < wordChars.length; ++i) {
          const c = wordChars.charAt(i);
          const v = ALPHABET_MAP[c];
          if (v === void 0)
            return "Unknown character " + c;
          chk = polymodStep(chk) ^ v;
          if (i + 6 >= wordChars.length)
            continue;
          words.push(v);
        }
        if (chk !== ENCODING_CONST)
          return "Invalid checksum for " + str;
        return { prefix, words };
      }
      function decodeUnsafe(str, LIMIT) {
        const res = __decode(str, LIMIT);
        if (typeof res === "object")
          return res;
      }
      function decode19(str, LIMIT) {
        const res = __decode(str, LIMIT);
        if (typeof res === "object")
          return res;
        throw new Error(res);
      }
      return {
        decodeUnsafe,
        decode: decode19,
        encode: encode20,
        toWords,
        fromWordsUnsafe,
        fromWords
      };
    }
    exports.bech32 = getLibraryFromEncoding("bech32");
    exports.bech32m = getLibraryFromEncoding("bech32m");
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2wpkh.js
function p2wpkh(a, opts) {
  if (!a.address && !a.hash && !a.output && !a.pubkey && !a.witness)
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    partial(
      object({
        address: string(),
        hash: NBufferSchemaFactory(20),
        input: NBufferSchemaFactory(0),
        network: object({}),
        output: NBufferSchemaFactory(22),
        pubkey: custom(isPoint, "Not a valid pubkey"),
        signature: custom(isCanonicalScriptSignature),
        witness: array(BufferSchema)
      })
    ),
    a
  );
  const _address = value(() => {
    const result = import_bech32.bech32.decode(a.address);
    const version = result.words.shift();
    const data = import_bech32.bech32.fromWords(result.words);
    return {
      version,
      prefix: result.prefix,
      data: Uint8Array.from(data)
    };
  });
  const network = a.network || bitcoin;
  const o = { name: "p2wpkh", network };
  prop(o, "address", () => {
    if (!o.hash) return;
    const words = import_bech32.bech32.toWords(o.hash);
    words.unshift(0);
    return import_bech32.bech32.encode(network.bech32, words);
  });
  prop(o, "hash", () => {
    if (a.output) return a.output.slice(2, 22);
    if (a.address) return _address().data;
    if (a.pubkey || o.pubkey) return hash160(a.pubkey || o.pubkey);
  });
  prop(o, "output", () => {
    if (!o.hash) return;
    return compile([OPS7.OP_0, o.hash]);
  });
  prop(o, "pubkey", () => {
    if (a.pubkey) return a.pubkey;
    if (!a.witness) return;
    return a.witness[1];
  });
  prop(o, "signature", () => {
    if (!a.witness) return;
    return a.witness[0];
  });
  prop(o, "input", () => {
    if (!o.witness) return;
    return EMPTY_BUFFER;
  });
  prop(o, "witness", () => {
    if (!a.pubkey) return;
    if (!a.signature) return;
    return [a.signature, a.pubkey];
  });
  if (opts.validate) {
    let hash = Uint8Array.from([]);
    if (a.address) {
      if (network && network.bech32 !== _address().prefix)
        throw new TypeError("Invalid prefix or Network mismatch");
      if (_address().version !== 0)
        throw new TypeError("Invalid address version");
      if (_address().data.length !== 20)
        throw new TypeError("Invalid address data");
      hash = _address().data;
    }
    if (a.hash) {
      if (hash.length > 0 && compare(hash, a.hash) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = a.hash;
    }
    if (a.output) {
      if (a.output.length !== 22 || a.output[0] !== OPS7.OP_0 || a.output[1] !== 20)
        throw new TypeError("Output is invalid");
      if (hash.length > 0 && compare(hash, a.output.slice(2)) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = a.output.slice(2);
    }
    if (a.pubkey) {
      const pkh = hash160(a.pubkey);
      if (hash.length > 0 && compare(hash, pkh) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = pkh;
      if (!isPoint(a.pubkey) || a.pubkey.length !== 33)
        throw new TypeError("Invalid pubkey for p2wpkh");
    }
    if (a.witness) {
      if (a.witness.length !== 2) throw new TypeError("Witness is invalid");
      if (!isCanonicalScriptSignature(a.witness[0]))
        throw new TypeError("Witness has invalid signature");
      if (!isPoint(a.witness[1]) || a.witness[1].length !== 33)
        throw new TypeError("Witness has invalid pubkey");
      if (a.signature && compare(a.signature, a.witness[0]) !== 0)
        throw new TypeError("Signature mismatch");
      if (a.pubkey && compare(a.pubkey, a.witness[1]) !== 0)
        throw new TypeError("Pubkey mismatch");
      const pkh = hash160(a.witness[1]);
      if (hash.length > 0 && compare(hash, pkh) !== 0)
        throw new TypeError("Hash mismatch");
    }
  }
  return Object.assign(o, a);
}
var import_bech32, OPS7, EMPTY_BUFFER;
var init_p2wpkh = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2wpkh.js"() {
    init_crypto();
    init_networks();
    init_script();
    init_types();
    init_lazy();
    import_bech32 = __toESM(require_dist(), 1);
    init_browser();
    init_dist();
    OPS7 = OPS;
    EMPTY_BUFFER = new Uint8Array(0);
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2wsh.js
function chunkHasUncompressedPubkey(chunk) {
  if (chunk instanceof Uint8Array && chunk.length === 65 && chunk[0] === 4 && isPoint(chunk)) {
    return true;
  } else {
    return false;
  }
}
function p2wsh(a, opts) {
  if (!a.address && !a.hash && !a.output && !a.redeem && !a.witness)
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    NullablePartial({
      network: object({}),
      address: string(),
      hash: Buffer256bitSchema,
      output: NBufferSchemaFactory(34),
      redeem: NullablePartial({
        input: BufferSchema,
        network: object({}),
        output: BufferSchema,
        witness: array(BufferSchema)
      }),
      input: NBufferSchemaFactory(0),
      witness: array(BufferSchema)
    }),
    a
  );
  const _address = value(() => {
    const result = import_bech322.bech32.decode(a.address);
    const version = result.words.shift();
    const data = import_bech322.bech32.fromWords(result.words);
    return {
      version,
      prefix: result.prefix,
      data: Uint8Array.from(data)
    };
  });
  const _rchunks = value(() => {
    return decompile(a.redeem.input);
  });
  let network = a.network;
  if (!network) {
    network = a.redeem && a.redeem.network || bitcoin;
  }
  const o = { network };
  prop(o, "address", () => {
    if (!o.hash) return;
    const words = import_bech322.bech32.toWords(o.hash);
    words.unshift(0);
    return import_bech322.bech32.encode(network.bech32, words);
  });
  prop(o, "hash", () => {
    if (a.output) return a.output.slice(2);
    if (a.address) return _address().data;
    if (o.redeem && o.redeem.output) return sha2562(o.redeem.output);
  });
  prop(o, "output", () => {
    if (!o.hash) return;
    return compile([OPS8.OP_0, o.hash]);
  });
  prop(o, "redeem", () => {
    if (!a.witness) return;
    return {
      output: a.witness[a.witness.length - 1],
      input: EMPTY_BUFFER2,
      witness: a.witness.slice(0, -1)
    };
  });
  prop(o, "input", () => {
    if (!o.witness) return;
    return EMPTY_BUFFER2;
  });
  prop(o, "witness", () => {
    if (a.redeem && a.redeem.input && a.redeem.input.length > 0 && a.redeem.output && a.redeem.output.length > 0) {
      const stack = toStack(_rchunks());
      o.redeem = Object.assign({ witness: stack }, a.redeem);
      o.redeem.input = EMPTY_BUFFER2;
      return [].concat(stack, a.redeem.output);
    }
    if (!a.redeem) return;
    if (!a.redeem.output) return;
    if (!a.redeem.witness) return;
    return [].concat(a.redeem.witness, a.redeem.output);
  });
  prop(o, "name", () => {
    const nameParts = ["p2wsh"];
    if (o.redeem !== void 0 && o.redeem.name !== void 0)
      nameParts.push(o.redeem.name);
    return nameParts.join("-");
  });
  if (opts.validate) {
    let hash = Uint8Array.from([]);
    if (a.address) {
      if (_address().prefix !== network.bech32)
        throw new TypeError("Invalid prefix or Network mismatch");
      if (_address().version !== 0)
        throw new TypeError("Invalid address version");
      if (_address().data.length !== 32)
        throw new TypeError("Invalid address data");
      hash = _address().data;
    }
    if (a.hash) {
      if (hash.length > 0 && compare(hash, a.hash) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = a.hash;
    }
    if (a.output) {
      if (a.output.length !== 34 || a.output[0] !== OPS8.OP_0 || a.output[1] !== 32)
        throw new TypeError("Output is invalid");
      const hash2 = a.output.slice(2);
      if (hash.length > 0 && compare(hash, hash2) !== 0)
        throw new TypeError("Hash mismatch");
      else hash = hash2;
    }
    if (a.redeem) {
      if (a.redeem.network && a.redeem.network !== network)
        throw new TypeError("Network mismatch");
      if (a.redeem.input && a.redeem.input.length > 0 && a.redeem.witness && a.redeem.witness.length > 0)
        throw new TypeError("Ambiguous witness source");
      if (a.redeem.output) {
        const decompile2 = decompile(a.redeem.output);
        if (!decompile2 || decompile2.length < 1)
          throw new TypeError("Redeem.output is invalid");
        if (a.redeem.output.byteLength > 3600)
          throw new TypeError(
            "Redeem.output unspendable if larger than 3600 bytes"
          );
        if (countNonPushOnlyOPs(decompile2) > 201)
          throw new TypeError(
            "Redeem.output unspendable with more than 201 non-push ops"
          );
        const hash2 = sha2562(a.redeem.output);
        if (hash.length > 0 && compare(hash, hash2) !== 0)
          throw new TypeError("Hash mismatch");
        else hash = hash2;
      }
      if (a.redeem.input && !isPushOnly(_rchunks()))
        throw new TypeError("Non push-only scriptSig");
      if (a.witness && a.redeem.witness && !stacksEqual(a.witness, a.redeem.witness))
        throw new TypeError("Witness and redeem.witness mismatch");
      if (a.redeem.input && _rchunks().some(chunkHasUncompressedPubkey) || a.redeem.output && (decompile(a.redeem.output) || []).some(
        chunkHasUncompressedPubkey
      )) {
        throw new TypeError(
          "redeem.input or redeem.output contains uncompressed pubkey"
        );
      }
    }
    if (a.witness && a.witness.length > 0) {
      const wScript = a.witness[a.witness.length - 1];
      if (a.redeem && a.redeem.output && compare(a.redeem.output, wScript) !== 0)
        throw new TypeError("Witness and redeem.output mismatch");
      if (a.witness.some(chunkHasUncompressedPubkey) || (decompile(wScript) || []).some(chunkHasUncompressedPubkey))
        throw new TypeError("Witness contains uncompressed pubkey");
    }
  }
  return Object.assign(o, a);
}
var import_bech322, OPS8, EMPTY_BUFFER2;
var init_p2wsh = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2wsh.js"() {
    init_sha256();
    init_networks();
    init_script();
    init_types();
    init_lazy();
    import_bech322 = __toESM(require_dist(), 1);
    init_browser();
    init_dist();
    OPS8 = OPS;
    EMPTY_BUFFER2 = new Uint8Array(0);
  }
});

// node_modules/bitcoinjs-lib/src/esm/ecc_lib.js
function getEccLib() {
  if (!_ECCLIB_CACHE.eccLib)
    throw new Error(
      "No ECC Library provided. You must call initEccLib() with a valid TinySecp256k1Interface instance"
    );
  return _ECCLIB_CACHE.eccLib;
}
var _ECCLIB_CACHE;
var init_ecc_lib = __esm({
  "node_modules/bitcoinjs-lib/src/esm/ecc_lib.js"() {
    init_browser();
    _ECCLIB_CACHE = {};
  }
});

// node_modules/varuint-bitcoin/src/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  decode: () => decode5,
  encode: () => encode5,
  encodingLength: () => encodingLength2
});
function checkUInt53(n) {
  if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0)
    throw new RangeError("value out of range");
}
function checkUint53OrUint64(n) {
  if (typeof n === "number")
    checkUInt53(n);
  else
    checkUInt64(n);
}
function encode5(n, buffer, offset) {
  checkUint53OrUint64(n);
  if (offset === void 0)
    offset = 0;
  if (buffer === void 0) {
    buffer = new Uint8Array(encodingLength2(n));
  }
  let bytes = 0;
  if (n < 253) {
    buffer.set([Number(n)], offset);
    bytes = 1;
  } else if (n <= 65535) {
    buffer.set([253], offset);
    writeUInt16(buffer, offset + 1, Number(n), "LE");
    bytes = 3;
  } else if (n <= 4294967295) {
    buffer.set([254], offset);
    writeUInt32(buffer, offset + 1, Number(n), "LE");
    bytes = 5;
  } else {
    buffer.set([255], offset);
    writeUInt64(buffer, offset + 1, BigInt(n), "LE");
    bytes = 9;
  }
  return { buffer, bytes };
}
function decode5(buffer, offset) {
  if (offset === void 0)
    offset = 0;
  const first = buffer.at(offset);
  if (first === void 0)
    throw new Error("buffer too small");
  if (first < 253) {
    return { numberValue: first, bigintValue: BigInt(first), bytes: 1 };
  } else if (first === 253) {
    const val = readUInt16(buffer, offset + 1, "LE");
    return {
      numberValue: val,
      bigintValue: BigInt(val),
      bytes: 3
    };
  } else if (first === 254) {
    const val = readUInt32(buffer, offset + 1, "LE");
    return {
      numberValue: val,
      bigintValue: BigInt(val),
      bytes: 5
    };
  } else {
    const number3 = readUInt64(buffer, offset + 1, "LE");
    return { numberValue: number3 <= Number.MAX_SAFE_INTEGER ? Number(number3) : null, bigintValue: number3, bytes: 9 };
  }
}
function encodingLength2(n) {
  checkUint53OrUint64(n);
  return n < 253 ? 1 : n <= 65535 ? 3 : n <= 4294967295 ? 5 : 9;
}
var checkUInt64;
var init_esm4 = __esm({
  "node_modules/varuint-bitcoin/src/esm/index.js"() {
    "use strict";
    init_browser();
    checkUInt64 = (n) => {
      if (n < 0 || n > 0xffffffffffffffffn) {
        throw new RangeError("value out of range");
      }
    };
  }
});

// node_modules/bitcoinjs-lib/src/esm/bufferutils.js
function verifuint(value2, max) {
  if (typeof value2 !== "number" && typeof value2 !== "bigint")
    throw new Error("cannot write a non-number as a number");
  if (value2 < 0 && value2 < BigInt(0))
    throw new Error("specified a negative value for writing an unsigned value");
  if (value2 > max && value2 > BigInt(max))
    throw new Error("RangeError: value out of range");
  if (Math.floor(Number(value2)) !== Number(value2))
    throw new Error("value has a fractional component");
}
function reverseBuffer(buffer) {
  if (buffer.length < 1) return buffer;
  let j = buffer.length - 1;
  let tmp = 0;
  for (let i = 0; i < buffer.length / 2; i++) {
    tmp = buffer[i];
    buffer[i] = buffer[j];
    buffer[j] = tmp;
    j--;
  }
  return buffer;
}
function cloneBuffer(buffer) {
  const clone = new Uint8Array(buffer.length);
  clone.set(buffer);
  return clone;
}
var MAX_JS_NUMBER, BufferWriter, BufferReader;
var init_bufferutils = __esm({
  "node_modules/bitcoinjs-lib/src/esm/bufferutils.js"() {
    init_types();
    init_esm4();
    init_dist();
    init_browser();
    MAX_JS_NUMBER = 9007199254740991;
    BufferWriter = class _BufferWriter {
      buffer;
      offset;
      static withCapacity(size) {
        return new _BufferWriter(new Uint8Array(size));
      }
      constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
        parse(tuple([BufferSchema, UInt32Schema]), [
          buffer,
          offset
        ]);
      }
      writeUInt8(i) {
        this.offset = writeUInt8(this.buffer, this.offset, i);
      }
      writeInt32(i) {
        this.offset = writeInt32(this.buffer, this.offset, i, "LE");
      }
      writeInt64(i) {
        this.offset = writeInt64(this.buffer, this.offset, BigInt(i), "LE");
      }
      writeUInt32(i) {
        this.offset = writeUInt32(this.buffer, this.offset, i, "LE");
      }
      writeUInt64(i) {
        this.offset = writeUInt64(this.buffer, this.offset, BigInt(i), "LE");
      }
      writeVarInt(i) {
        const { bytes } = encode5(i, this.buffer, this.offset);
        this.offset += bytes;
      }
      writeSlice(slice) {
        if (this.buffer.length < this.offset + slice.length) {
          throw new Error("Cannot write slice out of bounds");
        }
        this.buffer.set(slice, this.offset);
        this.offset += slice.length;
      }
      writeVarSlice(slice) {
        this.writeVarInt(slice.length);
        this.writeSlice(slice);
      }
      writeVector(vector2) {
        this.writeVarInt(vector2.length);
        vector2.forEach((buf) => this.writeVarSlice(buf));
      }
      end() {
        if (this.buffer.length === this.offset) {
          return this.buffer;
        }
        throw new Error(`buffer size ${this.buffer.length}, offset ${this.offset}`);
      }
    };
    BufferReader = class {
      buffer;
      offset;
      constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
        parse(tuple([BufferSchema, UInt32Schema]), [
          buffer,
          offset
        ]);
      }
      readUInt8() {
        const result = readUInt8(this.buffer, this.offset);
        this.offset++;
        return result;
      }
      readInt32() {
        const result = readInt32(this.buffer, this.offset, "LE");
        this.offset += 4;
        return result;
      }
      readUInt32() {
        const result = readUInt32(this.buffer, this.offset, "LE");
        this.offset += 4;
        return result;
      }
      readInt64() {
        const result = readInt64(this.buffer, this.offset, "LE");
        this.offset += 8;
        return result;
      }
      readVarInt() {
        const { bigintValue, bytes } = decode5(this.buffer, this.offset);
        this.offset += bytes;
        return bigintValue;
      }
      readSlice(n) {
        verifuint(n, MAX_JS_NUMBER);
        const num = Number(n);
        if (this.buffer.length < this.offset + num) {
          throw new Error("Cannot read slice out of bounds");
        }
        const result = this.buffer.slice(this.offset, this.offset + num);
        this.offset += num;
        return result;
      }
      readVarSlice() {
        return this.readSlice(this.readVarInt());
      }
      readVector() {
        const count = this.readVarInt();
        const vector2 = [];
        for (let i = 0; i < count; i++) vector2.push(this.readVarSlice());
        return vector2;
      }
    };
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/bip341.js
function rootHashFromPath(controlBlock, leafHash) {
  if (controlBlock.length < 33)
    throw new TypeError(
      `The control-block length is too small. Got ${controlBlock.length}, expected min 33.`
    );
  const m = (controlBlock.length - 33) / 32;
  let kj = leafHash;
  for (let j = 0; j < m; j++) {
    const ej = controlBlock.slice(33 + 32 * j, 65 + 32 * j);
    if (compare(kj, ej) < 0) {
      kj = tapBranchHash(kj, ej);
    } else {
      kj = tapBranchHash(ej, kj);
    }
  }
  return kj;
}
function toHashTree(scriptTree) {
  if (isTapleaf(scriptTree)) return { hash: tapleafHash(scriptTree) };
  const hashes = [toHashTree(scriptTree[0]), toHashTree(scriptTree[1])];
  hashes.sort((a, b) => compare(a.hash, b.hash));
  const [left, right] = hashes;
  return {
    hash: tapBranchHash(left.hash, right.hash),
    left,
    right
  };
}
function findScriptPath(node, hash) {
  if (isHashBranch(node)) {
    const leftPath = findScriptPath(node.left, hash);
    if (leftPath !== void 0) return [...leftPath, node.right.hash];
    const rightPath = findScriptPath(node.right, hash);
    if (rightPath !== void 0) return [...rightPath, node.left.hash];
  } else if (compare(node.hash, hash) === 0) {
    return [];
  }
  return void 0;
}
function tapleafHash(leaf) {
  const version = leaf.version || LEAF_VERSION_TAPSCRIPT;
  return taggedHash(
    "TapLeaf",
    concat([Uint8Array.from([version]), serializeScript(leaf.output)])
  );
}
function tapTweakHash(pubKey, h) {
  return taggedHash(
    "TapTweak",
    concat(h ? [pubKey, h] : [pubKey])
  );
}
function tweakKey(pubKey, h) {
  if (!(pubKey instanceof Uint8Array)) return null;
  if (pubKey.length !== 32) return null;
  if (h && h.length !== 32) return null;
  const tweakHash = tapTweakHash(pubKey, h);
  const res = getEccLib().xOnlyPointAddTweak(pubKey, tweakHash);
  if (!res || res.xOnlyPubkey === null) return null;
  return {
    parity: res.parity,
    x: Uint8Array.from(res.xOnlyPubkey)
  };
}
function tapBranchHash(a, b) {
  return taggedHash("TapBranch", concat([a, b]));
}
function serializeScript(s) {
  const varintLen = esm_exports.encodingLength(s.length);
  const buffer = new Uint8Array(varintLen);
  esm_exports.encode(s.length, buffer);
  return concat([buffer, s]);
}
var LEAF_VERSION_TAPSCRIPT, MAX_TAPTREE_DEPTH, isHashBranch;
var init_bip341 = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/bip341.js"() {
    init_ecc_lib();
    init_crypto();
    init_bufferutils();
    init_types();
    init_browser();
    LEAF_VERSION_TAPSCRIPT = 192;
    MAX_TAPTREE_DEPTH = 128;
    isHashBranch = (ht) => "left" in ht && "right" in ht;
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/p2tr.js
function p2tr(a, opts) {
  if (!a.address && !a.output && !a.pubkey && !a.internalPubkey && !(a.witness && a.witness.length > 1))
    throw new TypeError("Not enough data");
  opts = Object.assign({ validate: true }, opts || {});
  parse(
    partial(
      object({
        address: string(),
        input: NBufferSchemaFactory(0),
        network: object({}),
        output: NBufferSchemaFactory(34),
        internalPubkey: NBufferSchemaFactory(32),
        hash: NBufferSchemaFactory(32),
        // merkle root hash, the tweak
        pubkey: NBufferSchemaFactory(32),
        // tweaked with `hash` from `internalPubkey`
        signature: union([
          NBufferSchemaFactory(64),
          NBufferSchemaFactory(65)
        ]),
        witness: array(BufferSchema),
        scriptTree: custom(isTaptree, "Taptree is not of type isTaptree"),
        redeem: partial(
          object({
            output: BufferSchema,
            // tapleaf script
            redeemVersion: number(),
            // tapleaf version
            witness: array(BufferSchema)
          })
        ),
        redeemVersion: number()
      })
    ),
    a
  );
  const _address = value(() => {
    return fromBech32(a.address);
  });
  const _witness = value(() => {
    if (!a.witness || !a.witness.length) return;
    if (a.witness.length >= 2 && a.witness[a.witness.length - 1][0] === ANNEX_PREFIX) {
      return a.witness.slice(0, -1);
    }
    return a.witness.slice();
  });
  const _hashTree = value(() => {
    if (a.scriptTree) return toHashTree(a.scriptTree);
    if (a.hash) return { hash: a.hash };
    return;
  });
  const network = a.network || bitcoin;
  const o = { name: "p2tr", network };
  prop(o, "address", () => {
    if (!o.pubkey) return;
    const words = import_bech323.bech32m.toWords(o.pubkey);
    words.unshift(TAPROOT_WITNESS_VERSION);
    return import_bech323.bech32m.encode(network.bech32, words);
  });
  prop(o, "hash", () => {
    const hashTree = _hashTree();
    if (hashTree) return hashTree.hash;
    const w = _witness();
    if (w && w.length > 1) {
      const controlBlock = w[w.length - 1];
      const leafVersion = controlBlock[0] & TAPLEAF_VERSION_MASK;
      const script = w[w.length - 2];
      const leafHash = tapleafHash({ output: script, version: leafVersion });
      return rootHashFromPath(controlBlock, leafHash);
    }
    return null;
  });
  prop(o, "output", () => {
    if (!o.pubkey) return;
    return compile([OPS9.OP_1, o.pubkey]);
  });
  prop(o, "redeemVersion", () => {
    if (a.redeemVersion) return a.redeemVersion;
    if (a.redeem && a.redeem.redeemVersion !== void 0 && a.redeem.redeemVersion !== null) {
      return a.redeem.redeemVersion;
    }
    return LEAF_VERSION_TAPSCRIPT;
  });
  prop(o, "redeem", () => {
    const witness = _witness();
    if (!witness || witness.length < 2) return;
    return {
      output: witness[witness.length - 2],
      witness: witness.slice(0, -2),
      redeemVersion: witness[witness.length - 1][0] & TAPLEAF_VERSION_MASK
    };
  });
  prop(o, "pubkey", () => {
    if (a.pubkey) return a.pubkey;
    if (a.output) return a.output.slice(2);
    if (a.address) return _address().data;
    if (o.internalPubkey) {
      const tweakedKey = tweakKey(o.internalPubkey, o.hash);
      if (tweakedKey) return tweakedKey.x;
    }
  });
  prop(o, "internalPubkey", () => {
    if (a.internalPubkey) return a.internalPubkey;
    const witness = _witness();
    if (witness && witness.length > 1)
      return witness[witness.length - 1].slice(1, 33);
  });
  prop(o, "signature", () => {
    if (a.signature) return a.signature;
    const witness = _witness();
    if (!witness || witness.length !== 1) return;
    return witness[0];
  });
  prop(o, "witness", () => {
    if (a.witness) return a.witness;
    const hashTree = _hashTree();
    if (hashTree && a.redeem && a.redeem.output && a.internalPubkey) {
      const leafHash = tapleafHash({
        output: a.redeem.output,
        version: o.redeemVersion
      });
      const path = findScriptPath(hashTree, leafHash);
      if (!path) return;
      const outputKey = tweakKey(a.internalPubkey, hashTree.hash);
      if (!outputKey) return;
      const controlBock = concat(
        [
          Uint8Array.from([o.redeemVersion | outputKey.parity]),
          a.internalPubkey
        ].concat(path)
      );
      return [a.redeem.output, controlBock];
    }
    if (a.signature) return [a.signature];
  });
  if (opts.validate) {
    let pubkey = Uint8Array.from([]);
    if (a.address) {
      if (network && network.bech32 !== _address().prefix)
        throw new TypeError("Invalid prefix or Network mismatch");
      if (_address().version !== TAPROOT_WITNESS_VERSION)
        throw new TypeError("Invalid address version");
      if (_address().data.length !== 32)
        throw new TypeError("Invalid address data");
      pubkey = _address().data;
    }
    if (a.pubkey) {
      if (pubkey.length > 0 && compare(pubkey, a.pubkey) !== 0)
        throw new TypeError("Pubkey mismatch");
      else pubkey = a.pubkey;
    }
    if (a.output) {
      if (a.output.length !== 34 || a.output[0] !== OPS9.OP_1 || a.output[1] !== 32)
        throw new TypeError("Output is invalid");
      if (pubkey.length > 0 && compare(pubkey, a.output.slice(2)) !== 0)
        throw new TypeError("Pubkey mismatch");
      else pubkey = a.output.slice(2);
    }
    if (a.internalPubkey) {
      const tweakedKey = tweakKey(a.internalPubkey, o.hash);
      if (pubkey.length > 0 && compare(pubkey, tweakedKey.x) !== 0)
        throw new TypeError("Pubkey mismatch");
      else pubkey = tweakedKey.x;
    }
    if (pubkey && pubkey.length) {
      if (!getEccLib().isXOnlyPoint(pubkey))
        throw new TypeError("Invalid pubkey for p2tr");
    }
    const hashTree = _hashTree();
    if (a.hash && hashTree) {
      if (compare(a.hash, hashTree.hash) !== 0)
        throw new TypeError("Hash mismatch");
    }
    if (a.redeem && a.redeem.output && hashTree) {
      const leafHash = tapleafHash({
        output: a.redeem.output,
        version: o.redeemVersion
      });
      if (!findScriptPath(hashTree, leafHash))
        throw new TypeError("Redeem script not in tree");
    }
    const witness = _witness();
    if (a.redeem && o.redeem) {
      if (a.redeem.redeemVersion) {
        if (a.redeem.redeemVersion !== o.redeem.redeemVersion)
          throw new TypeError("Redeem.redeemVersion and witness mismatch");
      }
      if (a.redeem.output) {
        if (decompile(a.redeem.output).length === 0)
          throw new TypeError("Redeem.output is invalid");
        if (o.redeem.output && compare(a.redeem.output, o.redeem.output) !== 0)
          throw new TypeError("Redeem.output and witness mismatch");
      }
      if (a.redeem.witness) {
        if (o.redeem.witness && !stacksEqual(a.redeem.witness, o.redeem.witness))
          throw new TypeError("Redeem.witness and witness mismatch");
      }
    }
    if (witness && witness.length) {
      if (witness.length === 1) {
        if (a.signature && compare(a.signature, witness[0]) !== 0)
          throw new TypeError("Signature mismatch");
      } else {
        const controlBlock = witness[witness.length - 1];
        if (controlBlock.length < 33)
          throw new TypeError(
            `The control-block length is too small. Got ${controlBlock.length}, expected min 33.`
          );
        if ((controlBlock.length - 33) % 32 !== 0)
          throw new TypeError(
            `The control-block length of ${controlBlock.length} is incorrect!`
          );
        const m = (controlBlock.length - 33) / 32;
        if (m > 128)
          throw new TypeError(
            `The script path is too long. Got ${m}, expected max 128.`
          );
        const internalPubkey = controlBlock.slice(1, 33);
        if (a.internalPubkey && compare(a.internalPubkey, internalPubkey) !== 0)
          throw new TypeError("Internal pubkey mismatch");
        if (!getEccLib().isXOnlyPoint(internalPubkey))
          throw new TypeError("Invalid internalPubkey for p2tr witness");
        const leafVersion = controlBlock[0] & TAPLEAF_VERSION_MASK;
        const script = witness[witness.length - 2];
        const leafHash = tapleafHash({ output: script, version: leafVersion });
        const hash = rootHashFromPath(controlBlock, leafHash);
        const outputKey = tweakKey(internalPubkey, hash);
        if (!outputKey)
          throw new TypeError("Invalid outputKey for p2tr witness");
        if (pubkey.length && compare(pubkey, outputKey.x) !== 0)
          throw new TypeError("Pubkey mismatch for p2tr witness");
        if (outputKey.parity !== (controlBlock[0] & 1))
          throw new Error("Incorrect parity");
      }
    }
  }
  return Object.assign(o, a);
}
var import_bech323, OPS9, TAPROOT_WITNESS_VERSION, ANNEX_PREFIX;
var init_p2tr = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/p2tr.js"() {
    init_networks();
    init_script();
    init_types();
    init_ecc_lib();
    init_bip341();
    init_lazy();
    import_bech323 = __toESM(require_dist(), 1);
    init_address();
    init_browser();
    init_dist();
    OPS9 = OPS;
    TAPROOT_WITNESS_VERSION = 1;
    ANNEX_PREFIX = 80;
  }
});

// node_modules/bitcoinjs-lib/src/esm/payments/index.js
var payments_exports = {};
__export(payments_exports, {
  embed: () => p2data,
  p2ms: () => p2ms,
  p2pk: () => p2pk,
  p2pkh: () => p2pkh,
  p2sh: () => p2sh,
  p2tr: () => p2tr,
  p2wpkh: () => p2wpkh,
  p2wsh: () => p2wsh
});
var init_payments = __esm({
  "node_modules/bitcoinjs-lib/src/esm/payments/index.js"() {
    init_embed();
    init_p2ms();
    init_p2pk();
    init_p2pkh();
    init_p2sh();
    init_p2wpkh();
    init_p2wsh();
    init_p2tr();
  }
});

// node_modules/bitcoinjs-lib/src/esm/address.js
var address_exports = {};
__export(address_exports, {
  fromBase58Check: () => fromBase58Check,
  fromBech32: () => fromBech32,
  fromOutputScript: () => fromOutputScript,
  toBase58Check: () => toBase58Check,
  toBech32: () => toBech32,
  toOutputScript: () => toOutputScript
});
function _toFutureSegwitAddress(output, network) {
  const data = output.slice(2);
  if (data.length < FUTURE_SEGWIT_MIN_SIZE || data.length > FUTURE_SEGWIT_MAX_SIZE)
    throw new TypeError("Invalid program length for segwit address");
  const version = output[0] - FUTURE_SEGWIT_VERSION_DIFF;
  if (version < FUTURE_SEGWIT_MIN_VERSION || version > FUTURE_SEGWIT_MAX_VERSION)
    throw new TypeError("Invalid version for segwit address");
  if (output[1] !== data.length)
    throw new TypeError("Invalid script for segwit address");
  if (WARNING_STATES[0] === false) {
    console.warn(FUTURE_SEGWIT_VERSION_WARNING);
    WARNING_STATES[0] = true;
  }
  return toBech32(data, version, network.bech32);
}
function fromBase58Check(address) {
  const payload = esm_default3.decode(address);
  if (payload.length < 21) throw new TypeError(address + " is too short");
  if (payload.length > 21) throw new TypeError(address + " is too long");
  const version = readUInt8(payload, 0);
  const hash = payload.slice(1);
  return { version, hash };
}
function fromBech32(address) {
  let result;
  let version;
  try {
    result = import_bech324.bech32.decode(address);
  } catch (e) {
  }
  if (result) {
    version = result.words[0];
    if (version !== 0) throw new TypeError(address + " uses wrong encoding");
  } else {
    result = import_bech324.bech32m.decode(address);
    version = result.words[0];
    if (version === 0) throw new TypeError(address + " uses wrong encoding");
  }
  const data = import_bech324.bech32.fromWords(result.words.slice(1));
  return {
    version,
    prefix: result.prefix,
    data: Uint8Array.from(data)
  };
}
function toBase58Check(hash, version) {
  parse(tuple([Hash160bitSchema, UInt8Schema]), [hash, version]);
  const payload = new Uint8Array(21);
  writeUInt8(payload, 0, version);
  payload.set(hash, 1);
  return esm_default3.encode(payload);
}
function toBech32(data, version, prefix) {
  const words = import_bech324.bech32.toWords(data);
  words.unshift(version);
  return version === 0 ? import_bech324.bech32.encode(prefix, words) : import_bech324.bech32m.encode(prefix, words);
}
function fromOutputScript(output, network) {
  network = network || bitcoin;
  try {
    return p2pkh({ output, network }).address;
  } catch (e) {
  }
  try {
    return p2sh({ output, network }).address;
  } catch (e) {
  }
  try {
    return p2wpkh({ output, network }).address;
  } catch (e) {
  }
  try {
    return p2wsh({ output, network }).address;
  } catch (e) {
  }
  try {
    return p2tr({ output, network }).address;
  } catch (e) {
  }
  try {
    return _toFutureSegwitAddress(output, network);
  } catch (e) {
  }
  throw new Error(toASM(output) + " has no matching Address");
}
function toOutputScript(address, network) {
  network = network || bitcoin;
  let decodeBase58;
  let decodeBech32;
  try {
    decodeBase58 = fromBase58Check(address);
  } catch (e) {
  }
  if (decodeBase58) {
    if (decodeBase58.version === network.pubKeyHash)
      return p2pkh({ hash: decodeBase58.hash }).output;
    if (decodeBase58.version === network.scriptHash)
      return p2sh({ hash: decodeBase58.hash }).output;
  } else {
    try {
      decodeBech32 = fromBech32(address);
    } catch (e) {
    }
    if (decodeBech32) {
      if (decodeBech32.prefix !== network.bech32)
        throw new Error(address + " has an invalid prefix");
      if (decodeBech32.version === 0) {
        if (decodeBech32.data.length === 20)
          return p2wpkh({ hash: decodeBech32.data }).output;
        if (decodeBech32.data.length === 32)
          return p2wsh({ hash: decodeBech32.data }).output;
      } else if (decodeBech32.version === 1) {
        if (decodeBech32.data.length === 32)
          return p2tr({ pubkey: decodeBech32.data }).output;
      } else if (decodeBech32.version >= FUTURE_SEGWIT_MIN_VERSION && decodeBech32.version <= FUTURE_SEGWIT_MAX_VERSION && decodeBech32.data.length >= FUTURE_SEGWIT_MIN_SIZE && decodeBech32.data.length <= FUTURE_SEGWIT_MAX_SIZE) {
        if (WARNING_STATES[1] === false) {
          console.warn(FUTURE_SEGWIT_VERSION_WARNING);
          WARNING_STATES[1] = true;
        }
        return compile([
          decodeBech32.version + FUTURE_SEGWIT_VERSION_DIFF,
          decodeBech32.data
        ]);
      }
    }
  }
  throw new Error(address + " has no matching Script");
}
var import_bech324, FUTURE_SEGWIT_MAX_SIZE, FUTURE_SEGWIT_MIN_SIZE, FUTURE_SEGWIT_MAX_VERSION, FUTURE_SEGWIT_MIN_VERSION, FUTURE_SEGWIT_VERSION_DIFF, FUTURE_SEGWIT_VERSION_WARNING, WARNING_STATES;
var init_address = __esm({
  "node_modules/bitcoinjs-lib/src/esm/address.js"() {
    init_networks();
    init_payments();
    init_script();
    init_types();
    import_bech324 = __toESM(require_dist(), 1);
    init_esm3();
    init_browser();
    init_dist();
    FUTURE_SEGWIT_MAX_SIZE = 40;
    FUTURE_SEGWIT_MIN_SIZE = 2;
    FUTURE_SEGWIT_MAX_VERSION = 16;
    FUTURE_SEGWIT_MIN_VERSION = 2;
    FUTURE_SEGWIT_VERSION_DIFF = 80;
    FUTURE_SEGWIT_VERSION_WARNING = "WARNING: Sending to a future segwit version address can lead to loss of funds. End users MUST be warned carefully in the GUI and asked if they wish to proceed with caution. Wallets should verify the segwit version from the output of fromBech32, then decide when it is safe to use which version of segwit.";
    WARNING_STATES = [false, false];
  }
});

// node_modules/bitcoinjs-lib/src/esm/merkle.js
var init_merkle = __esm({
  "node_modules/bitcoinjs-lib/src/esm/merkle.js"() {
    init_browser();
  }
});

// node_modules/bitcoinjs-lib/src/esm/transaction.js
function varSliceSize(someScript) {
  const length2 = someScript.length;
  return esm_exports.encodingLength(length2) + length2;
}
function vectorSize(someVector) {
  const length2 = someVector.length;
  return esm_exports.encodingLength(length2) + someVector.reduce((sum, witness) => {
    return sum + varSliceSize(witness);
  }, 0);
}
function isOutput(out) {
  return out.value !== void 0;
}
var EMPTY_BUFFER3, EMPTY_WITNESS, ZERO2, ONE, VALUE_UINT64_MAX, BLANK_OUTPUT, Transaction;
var init_transaction = __esm({
  "node_modules/bitcoinjs-lib/src/esm/transaction.js"() {
    init_bufferutils();
    init_crypto();
    init_sha256();
    init_script();
    init_script();
    init_types();
    init_browser();
    init_dist();
    EMPTY_BUFFER3 = new Uint8Array(0);
    EMPTY_WITNESS = [];
    ZERO2 = fromHex(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );
    ONE = fromHex(
      "0000000000000000000000000000000000000000000000000000000000000001"
    );
    VALUE_UINT64_MAX = fromHex("ffffffffffffffff");
    BLANK_OUTPUT = {
      script: EMPTY_BUFFER3,
      valueBuffer: VALUE_UINT64_MAX
    };
    Transaction = class _Transaction {
      static DEFAULT_SEQUENCE = 4294967295;
      static SIGHASH_DEFAULT = 0;
      static SIGHASH_ALL = 1;
      static SIGHASH_NONE = 2;
      static SIGHASH_SINGLE = 3;
      static SIGHASH_ANYONECANPAY = 128;
      static SIGHASH_OUTPUT_MASK = 3;
      static SIGHASH_INPUT_MASK = 128;
      static ADVANCED_TRANSACTION_MARKER = 0;
      static ADVANCED_TRANSACTION_FLAG = 1;
      static fromBuffer(buffer, _NO_STRICT) {
        const bufferReader = new BufferReader(buffer);
        const tx = new _Transaction();
        tx.version = bufferReader.readUInt32();
        const marker2 = bufferReader.readUInt8();
        const flag = bufferReader.readUInt8();
        let hasWitnesses = false;
        if (marker2 === _Transaction.ADVANCED_TRANSACTION_MARKER && flag === _Transaction.ADVANCED_TRANSACTION_FLAG) {
          hasWitnesses = true;
        } else {
          bufferReader.offset -= 2;
        }
        const vinLen = bufferReader.readVarInt();
        for (let i = 0; i < vinLen; ++i) {
          tx.ins.push({
            hash: bufferReader.readSlice(32),
            index: bufferReader.readUInt32(),
            script: bufferReader.readVarSlice(),
            sequence: bufferReader.readUInt32(),
            witness: EMPTY_WITNESS
          });
        }
        const voutLen = bufferReader.readVarInt();
        for (let i = 0; i < voutLen; ++i) {
          tx.outs.push({
            value: bufferReader.readInt64(),
            script: bufferReader.readVarSlice()
          });
        }
        if (hasWitnesses) {
          for (let i = 0; i < vinLen; ++i) {
            tx.ins[i].witness = bufferReader.readVector();
          }
          if (!tx.hasWitnesses())
            throw new Error("Transaction has superfluous witness data");
        }
        tx.locktime = bufferReader.readUInt32();
        if (_NO_STRICT) return tx;
        if (bufferReader.offset !== buffer.length)
          throw new Error("Transaction has unexpected data");
        return tx;
      }
      static fromHex(hex2) {
        return _Transaction.fromBuffer(fromHex(hex2), false);
      }
      static isCoinbaseHash(buffer) {
        parse(Hash256bitSchema, buffer);
        for (let i = 0; i < 32; ++i) {
          if (buffer[i] !== 0) return false;
        }
        return true;
      }
      version = 1;
      locktime = 0;
      ins = [];
      outs = [];
      isCoinbase() {
        return this.ins.length === 1 && _Transaction.isCoinbaseHash(this.ins[0].hash);
      }
      addInput(hash, index, sequence, scriptSig) {
        parse(
          tuple([
            Hash256bitSchema,
            UInt32Schema,
            nullable(optional(UInt32Schema)),
            nullable(optional(BufferSchema))
          ]),
          [hash, index, sequence, scriptSig]
        );
        if (sequence === void 0 || sequence === null) {
          sequence = _Transaction.DEFAULT_SEQUENCE;
        }
        return this.ins.push({
          hash,
          index,
          script: scriptSig || EMPTY_BUFFER3,
          sequence,
          witness: EMPTY_WITNESS
        }) - 1;
      }
      addOutput(scriptPubKey, value2) {
        parse(tuple([BufferSchema, SatoshiSchema]), [
          scriptPubKey,
          value2
        ]);
        return this.outs.push({
          script: scriptPubKey,
          value: value2
        }) - 1;
      }
      hasWitnesses() {
        return this.ins.some((x) => {
          return x.witness.length !== 0;
        });
      }
      stripWitnesses() {
        this.ins.forEach((input) => {
          input.witness = EMPTY_WITNESS;
        });
      }
      weight() {
        const base2 = this.byteLength(false);
        const total = this.byteLength(true);
        return base2 * 3 + total;
      }
      virtualSize() {
        return Math.ceil(this.weight() / 4);
      }
      byteLength(_ALLOW_WITNESS = true) {
        const hasWitnesses = _ALLOW_WITNESS && this.hasWitnesses();
        return (hasWitnesses ? 10 : 8) + esm_exports.encodingLength(this.ins.length) + esm_exports.encodingLength(this.outs.length) + this.ins.reduce((sum, input) => {
          return sum + 40 + varSliceSize(input.script);
        }, 0) + this.outs.reduce((sum, output) => {
          return sum + 8 + varSliceSize(output.script);
        }, 0) + (hasWitnesses ? this.ins.reduce((sum, input) => {
          return sum + vectorSize(input.witness);
        }, 0) : 0);
      }
      clone() {
        const newTx = new _Transaction();
        newTx.version = this.version;
        newTx.locktime = this.locktime;
        newTx.ins = this.ins.map((txIn) => {
          return {
            hash: txIn.hash,
            index: txIn.index,
            script: txIn.script,
            sequence: txIn.sequence,
            witness: txIn.witness
          };
        });
        newTx.outs = this.outs.map((txOut) => {
          return {
            script: txOut.script,
            value: txOut.value
          };
        });
        return newTx;
      }
      /**
       * Hash transaction for signing a specific input.
       *
       * Bitcoin uses a different hash for each signed transaction input.
       * This method copies the transaction, makes the necessary changes based on the
       * hashType, and then hashes the result.
       * This hash can then be used to sign the provided transaction input.
       */
      hashForSignature(inIndex, prevOutScript, hashType) {
        parse(tuple([UInt32Schema, BufferSchema, number()]), [
          inIndex,
          prevOutScript,
          hashType
        ]);
        if (inIndex >= this.ins.length) return ONE;
        const ourScript = compile(
          decompile(prevOutScript).filter((x) => {
            return x !== OPS.OP_CODESEPARATOR;
          })
        );
        const txTmp = this.clone();
        if ((hashType & 31) === _Transaction.SIGHASH_NONE) {
          txTmp.outs = [];
          txTmp.ins.forEach((input, i) => {
            if (i === inIndex) return;
            input.sequence = 0;
          });
        } else if ((hashType & 31) === _Transaction.SIGHASH_SINGLE) {
          if (inIndex >= this.outs.length) return ONE;
          txTmp.outs.length = inIndex + 1;
          for (let i = 0; i < inIndex; i++) {
            txTmp.outs[i] = BLANK_OUTPUT;
          }
          txTmp.ins.forEach((input, y) => {
            if (y === inIndex) return;
            input.sequence = 0;
          });
        }
        if (hashType & _Transaction.SIGHASH_ANYONECANPAY) {
          txTmp.ins = [txTmp.ins[inIndex]];
          txTmp.ins[0].script = ourScript;
        } else {
          txTmp.ins.forEach((input) => {
            input.script = EMPTY_BUFFER3;
          });
          txTmp.ins[inIndex].script = ourScript;
        }
        const buffer = new Uint8Array(txTmp.byteLength(false) + 4);
        writeInt32(buffer, buffer.length - 4, hashType, "LE");
        txTmp.__toBuffer(buffer, 0, false);
        return hash256(buffer);
      }
      hashForWitnessV1(inIndex, prevOutScripts, values, hashType, leafHash, annex) {
        parse(
          tuple([
            UInt32Schema,
            array(BufferSchema),
            array(SatoshiSchema),
            UInt32Schema
          ]),
          [inIndex, prevOutScripts, values, hashType]
        );
        if (values.length !== this.ins.length || prevOutScripts.length !== this.ins.length) {
          throw new Error("Must supply prevout script and value for all inputs");
        }
        const outputType = hashType === _Transaction.SIGHASH_DEFAULT ? _Transaction.SIGHASH_ALL : hashType & _Transaction.SIGHASH_OUTPUT_MASK;
        const inputType = hashType & _Transaction.SIGHASH_INPUT_MASK;
        const isAnyoneCanPay = inputType === _Transaction.SIGHASH_ANYONECANPAY;
        const isNone = outputType === _Transaction.SIGHASH_NONE;
        const isSingle = outputType === _Transaction.SIGHASH_SINGLE;
        let hashPrevouts = EMPTY_BUFFER3;
        let hashAmounts = EMPTY_BUFFER3;
        let hashScriptPubKeys = EMPTY_BUFFER3;
        let hashSequences = EMPTY_BUFFER3;
        let hashOutputs = EMPTY_BUFFER3;
        if (!isAnyoneCanPay) {
          let bufferWriter = BufferWriter.withCapacity(36 * this.ins.length);
          this.ins.forEach((txIn) => {
            bufferWriter.writeSlice(txIn.hash);
            bufferWriter.writeUInt32(txIn.index);
          });
          hashPrevouts = sha2562(bufferWriter.end());
          bufferWriter = BufferWriter.withCapacity(8 * this.ins.length);
          values.forEach((value2) => bufferWriter.writeInt64(value2));
          hashAmounts = sha2562(bufferWriter.end());
          bufferWriter = BufferWriter.withCapacity(
            prevOutScripts.map(varSliceSize).reduce((a, b) => a + b)
          );
          prevOutScripts.forEach(
            (prevOutScript) => bufferWriter.writeVarSlice(prevOutScript)
          );
          hashScriptPubKeys = sha2562(bufferWriter.end());
          bufferWriter = BufferWriter.withCapacity(4 * this.ins.length);
          this.ins.forEach((txIn) => bufferWriter.writeUInt32(txIn.sequence));
          hashSequences = sha2562(bufferWriter.end());
        }
        if (!(isNone || isSingle)) {
          if (!this.outs.length)
            throw new Error("Add outputs to the transaction before signing.");
          const txOutsSize = this.outs.map((output) => 8 + varSliceSize(output.script)).reduce((a, b) => a + b);
          const bufferWriter = BufferWriter.withCapacity(txOutsSize);
          this.outs.forEach((out) => {
            bufferWriter.writeInt64(out.value);
            bufferWriter.writeVarSlice(out.script);
          });
          hashOutputs = sha2562(bufferWriter.end());
        } else if (isSingle && inIndex < this.outs.length) {
          const output = this.outs[inIndex];
          const bufferWriter = BufferWriter.withCapacity(
            8 + varSliceSize(output.script)
          );
          bufferWriter.writeInt64(output.value);
          bufferWriter.writeVarSlice(output.script);
          hashOutputs = sha2562(bufferWriter.end());
        }
        const spendType = (leafHash ? 2 : 0) + (annex ? 1 : 0);
        const sigMsgSize = 174 - (isAnyoneCanPay ? 49 : 0) - (isNone ? 32 : 0) + (annex ? 32 : 0) + (leafHash ? 37 : 0);
        const sigMsgWriter = BufferWriter.withCapacity(sigMsgSize);
        sigMsgWriter.writeUInt8(hashType);
        sigMsgWriter.writeUInt32(this.version);
        sigMsgWriter.writeUInt32(this.locktime);
        sigMsgWriter.writeSlice(hashPrevouts);
        sigMsgWriter.writeSlice(hashAmounts);
        sigMsgWriter.writeSlice(hashScriptPubKeys);
        sigMsgWriter.writeSlice(hashSequences);
        if (!(isNone || isSingle)) {
          sigMsgWriter.writeSlice(hashOutputs);
        }
        sigMsgWriter.writeUInt8(spendType);
        if (isAnyoneCanPay) {
          const input = this.ins[inIndex];
          sigMsgWriter.writeSlice(input.hash);
          sigMsgWriter.writeUInt32(input.index);
          sigMsgWriter.writeInt64(values[inIndex]);
          sigMsgWriter.writeVarSlice(prevOutScripts[inIndex]);
          sigMsgWriter.writeUInt32(input.sequence);
        } else {
          sigMsgWriter.writeUInt32(inIndex);
        }
        if (annex) {
          const bufferWriter = BufferWriter.withCapacity(varSliceSize(annex));
          bufferWriter.writeVarSlice(annex);
          sigMsgWriter.writeSlice(sha2562(bufferWriter.end()));
        }
        if (isSingle) {
          sigMsgWriter.writeSlice(hashOutputs);
        }
        if (leafHash) {
          sigMsgWriter.writeSlice(leafHash);
          sigMsgWriter.writeUInt8(0);
          sigMsgWriter.writeUInt32(4294967295);
        }
        return taggedHash(
          "TapSighash",
          concat([Uint8Array.from([0]), sigMsgWriter.end()])
        );
      }
      hashForWitnessV0(inIndex, prevOutScript, value2, hashType) {
        parse(
          tuple([
            UInt32Schema,
            BufferSchema,
            SatoshiSchema,
            UInt32Schema
          ]),
          [inIndex, prevOutScript, value2, hashType]
        );
        let tbuffer = Uint8Array.from([]);
        let bufferWriter;
        let hashOutputs = ZERO2;
        let hashPrevouts = ZERO2;
        let hashSequence = ZERO2;
        if (!(hashType & _Transaction.SIGHASH_ANYONECANPAY)) {
          tbuffer = new Uint8Array(36 * this.ins.length);
          bufferWriter = new BufferWriter(tbuffer, 0);
          this.ins.forEach((txIn) => {
            bufferWriter.writeSlice(txIn.hash);
            bufferWriter.writeUInt32(txIn.index);
          });
          hashPrevouts = hash256(tbuffer);
        }
        if (!(hashType & _Transaction.SIGHASH_ANYONECANPAY) && (hashType & 31) !== _Transaction.SIGHASH_SINGLE && (hashType & 31) !== _Transaction.SIGHASH_NONE) {
          tbuffer = new Uint8Array(4 * this.ins.length);
          bufferWriter = new BufferWriter(tbuffer, 0);
          this.ins.forEach((txIn) => {
            bufferWriter.writeUInt32(txIn.sequence);
          });
          hashSequence = hash256(tbuffer);
        }
        if ((hashType & 31) !== _Transaction.SIGHASH_SINGLE && (hashType & 31) !== _Transaction.SIGHASH_NONE) {
          const txOutsSize = this.outs.reduce((sum, output) => {
            return sum + 8 + varSliceSize(output.script);
          }, 0);
          tbuffer = new Uint8Array(txOutsSize);
          bufferWriter = new BufferWriter(tbuffer, 0);
          this.outs.forEach((out) => {
            bufferWriter.writeInt64(out.value);
            bufferWriter.writeVarSlice(out.script);
          });
          hashOutputs = hash256(tbuffer);
        } else if ((hashType & 31) === _Transaction.SIGHASH_SINGLE && inIndex < this.outs.length) {
          const output = this.outs[inIndex];
          tbuffer = new Uint8Array(8 + varSliceSize(output.script));
          bufferWriter = new BufferWriter(tbuffer, 0);
          bufferWriter.writeInt64(output.value);
          bufferWriter.writeVarSlice(output.script);
          hashOutputs = hash256(tbuffer);
        }
        tbuffer = new Uint8Array(156 + varSliceSize(prevOutScript));
        bufferWriter = new BufferWriter(tbuffer, 0);
        const input = this.ins[inIndex];
        bufferWriter.writeUInt32(this.version);
        bufferWriter.writeSlice(hashPrevouts);
        bufferWriter.writeSlice(hashSequence);
        bufferWriter.writeSlice(input.hash);
        bufferWriter.writeUInt32(input.index);
        bufferWriter.writeVarSlice(prevOutScript);
        bufferWriter.writeInt64(value2);
        bufferWriter.writeUInt32(input.sequence);
        bufferWriter.writeSlice(hashOutputs);
        bufferWriter.writeUInt32(this.locktime);
        bufferWriter.writeUInt32(hashType);
        return hash256(tbuffer);
      }
      getHash(forWitness) {
        if (forWitness && this.isCoinbase()) return new Uint8Array(32);
        return hash256(this.__toBuffer(void 0, void 0, forWitness));
      }
      getId() {
        return toHex(reverseBuffer(this.getHash(false)));
      }
      toBuffer(buffer, initialOffset) {
        return this.__toBuffer(buffer, initialOffset, true);
      }
      toHex() {
        return toHex(this.toBuffer(void 0, void 0));
      }
      setInputScript(index, scriptSig) {
        parse(tuple([number(), BufferSchema]), [index, scriptSig]);
        this.ins[index].script = scriptSig;
      }
      setWitness(index, witness) {
        parse(tuple([number(), array(BufferSchema)]), [
          index,
          witness
        ]);
        this.ins[index].witness = witness;
      }
      __toBuffer(buffer, initialOffset, _ALLOW_WITNESS = false) {
        if (!buffer) buffer = new Uint8Array(this.byteLength(_ALLOW_WITNESS));
        const bufferWriter = new BufferWriter(buffer, initialOffset || 0);
        bufferWriter.writeUInt32(this.version);
        const hasWitnesses = _ALLOW_WITNESS && this.hasWitnesses();
        if (hasWitnesses) {
          bufferWriter.writeUInt8(_Transaction.ADVANCED_TRANSACTION_MARKER);
          bufferWriter.writeUInt8(_Transaction.ADVANCED_TRANSACTION_FLAG);
        }
        bufferWriter.writeVarInt(this.ins.length);
        this.ins.forEach((txIn) => {
          bufferWriter.writeSlice(txIn.hash);
          bufferWriter.writeUInt32(txIn.index);
          bufferWriter.writeVarSlice(txIn.script);
          bufferWriter.writeUInt32(txIn.sequence);
        });
        bufferWriter.writeVarInt(this.outs.length);
        this.outs.forEach((txOut) => {
          if (isOutput(txOut)) {
            bufferWriter.writeInt64(txOut.value);
          } else {
            bufferWriter.writeSlice(txOut.valueBuffer);
          }
          bufferWriter.writeVarSlice(txOut.script);
        });
        if (hasWitnesses) {
          this.ins.forEach((input) => {
            bufferWriter.writeVector(input.witness);
          });
        }
        bufferWriter.writeUInt32(this.locktime);
        if (initialOffset !== void 0)
          return buffer.slice(initialOffset, bufferWriter.offset);
        return buffer;
      }
    };
  }
});

// node_modules/bitcoinjs-lib/src/esm/block.js
var errorMerkleNoTxes, errorWitnessNotSegwit;
var init_block = __esm({
  "node_modules/bitcoinjs-lib/src/esm/block.js"() {
    init_bufferutils();
    init_crypto();
    init_merkle();
    init_transaction();
    init_browser();
    errorMerkleNoTxes = new TypeError(
      "Cannot compute merkle root for zero transactions"
    );
    errorWitnessNotSegwit = new TypeError(
      "Cannot compute witness commit for non-segwit block"
    );
  }
});

// node_modules/bip174/src/esm/lib/typeFields.js
var GlobalTypes, InputTypes, OutputTypes;
var init_typeFields = __esm({
  "node_modules/bip174/src/esm/lib/typeFields.js"() {
    (function(GlobalTypes2) {
      GlobalTypes2[GlobalTypes2["UNSIGNED_TX"] = 0] = "UNSIGNED_TX";
      GlobalTypes2[GlobalTypes2["GLOBAL_XPUB"] = 1] = "GLOBAL_XPUB";
    })(GlobalTypes || (GlobalTypes = {}));
    (function(InputTypes2) {
      InputTypes2[InputTypes2["NON_WITNESS_UTXO"] = 0] = "NON_WITNESS_UTXO";
      InputTypes2[InputTypes2["WITNESS_UTXO"] = 1] = "WITNESS_UTXO";
      InputTypes2[InputTypes2["PARTIAL_SIG"] = 2] = "PARTIAL_SIG";
      InputTypes2[InputTypes2["SIGHASH_TYPE"] = 3] = "SIGHASH_TYPE";
      InputTypes2[InputTypes2["REDEEM_SCRIPT"] = 4] = "REDEEM_SCRIPT";
      InputTypes2[InputTypes2["WITNESS_SCRIPT"] = 5] = "WITNESS_SCRIPT";
      InputTypes2[InputTypes2["BIP32_DERIVATION"] = 6] = "BIP32_DERIVATION";
      InputTypes2[InputTypes2["FINAL_SCRIPTSIG"] = 7] = "FINAL_SCRIPTSIG";
      InputTypes2[InputTypes2["FINAL_SCRIPTWITNESS"] = 8] = "FINAL_SCRIPTWITNESS";
      InputTypes2[InputTypes2["POR_COMMITMENT"] = 9] = "POR_COMMITMENT";
      InputTypes2[InputTypes2["TAP_KEY_SIG"] = 19] = "TAP_KEY_SIG";
      InputTypes2[InputTypes2["TAP_SCRIPT_SIG"] = 20] = "TAP_SCRIPT_SIG";
      InputTypes2[InputTypes2["TAP_LEAF_SCRIPT"] = 21] = "TAP_LEAF_SCRIPT";
      InputTypes2[InputTypes2["TAP_BIP32_DERIVATION"] = 22] = "TAP_BIP32_DERIVATION";
      InputTypes2[InputTypes2["TAP_INTERNAL_KEY"] = 23] = "TAP_INTERNAL_KEY";
      InputTypes2[InputTypes2["TAP_MERKLE_ROOT"] = 24] = "TAP_MERKLE_ROOT";
    })(InputTypes || (InputTypes = {}));
    (function(OutputTypes2) {
      OutputTypes2[OutputTypes2["REDEEM_SCRIPT"] = 0] = "REDEEM_SCRIPT";
      OutputTypes2[OutputTypes2["WITNESS_SCRIPT"] = 1] = "WITNESS_SCRIPT";
      OutputTypes2[OutputTypes2["BIP32_DERIVATION"] = 2] = "BIP32_DERIVATION";
      OutputTypes2[OutputTypes2["TAP_INTERNAL_KEY"] = 5] = "TAP_INTERNAL_KEY";
      OutputTypes2[OutputTypes2["TAP_TREE"] = 6] = "TAP_TREE";
      OutputTypes2[OutputTypes2["TAP_BIP32_DERIVATION"] = 7] = "TAP_BIP32_DERIVATION";
    })(OutputTypes || (OutputTypes = {}));
  }
});

// node_modules/bip174/src/esm/lib/converter/global/globalXpub.js
var globalXpub_exports = {};
__export(globalXpub_exports, {
  canAddToArray: () => canAddToArray,
  check: () => check2,
  decode: () => decode6,
  encode: () => encode6,
  expected: () => expected
});
function decode6(keyVal) {
  if (keyVal.key[0] !== GlobalTypes.GLOBAL_XPUB) {
    throw new Error(
      "Decode Error: could not decode globalXpub with key 0x" + toHex(keyVal.key)
    );
  }
  if (keyVal.key.length !== 79 || ![2, 3].includes(keyVal.key[46])) {
    throw new Error(
      "Decode Error: globalXpub has invalid extended pubkey in key 0x" + toHex(keyVal.key)
    );
  }
  if (keyVal.value.length / 4 % 1 !== 0) {
    throw new Error(
      "Decode Error: Global GLOBAL_XPUB value length should be multiple of 4"
    );
  }
  const extendedPubkey = keyVal.key.slice(1);
  const data = {
    masterFingerprint: keyVal.value.slice(0, 4),
    extendedPubkey,
    path: "m"
  };
  for (const i of range(keyVal.value.length / 4 - 1)) {
    const val = readUInt32(keyVal.value, i * 4 + 4, "LE");
    const isHard = !!(val & 2147483648);
    const idx = val & 2147483647;
    data.path += "/" + idx.toString(10) + (isHard ? "'" : "");
  }
  return data;
}
function encode6(data) {
  const head = new Uint8Array([GlobalTypes.GLOBAL_XPUB]);
  const key = concat([head, data.extendedPubkey]);
  const splitPath = data.path.split("/");
  const value2 = new Uint8Array(splitPath.length * 4);
  value2.set(data.masterFingerprint, 0);
  let offset = 4;
  splitPath.slice(1).forEach((level) => {
    const isHard = level.slice(-1) === "'";
    let num = 2147483647 & parseInt(isHard ? level.slice(0, -1) : level, 10);
    if (isHard) num += 2147483648;
    writeUInt32(value2, offset, num, "LE");
    offset += 4;
  });
  return {
    key,
    value: value2
  };
}
function check2(data) {
  const epk = data.extendedPubkey;
  const mfp = data.masterFingerprint;
  const p = data.path;
  return epk instanceof Uint8Array && epk.length === 78 && [2, 3].indexOf(epk[45]) > -1 && mfp instanceof Uint8Array && mfp.length === 4 && typeof p === "string" && !!p.match(/^m(\/\d+'?)*$/);
}
function canAddToArray(array2, item, dupeSet) {
  const dupeString = toHex(item.extendedPubkey);
  if (dupeSet.has(dupeString)) return false;
  dupeSet.add(dupeString);
  return array2.filter((v) => compare(v.extendedPubkey, item.extendedPubkey)).length === 0;
}
var range, expected;
var init_globalXpub = __esm({
  "node_modules/bip174/src/esm/lib/converter/global/globalXpub.js"() {
    init_typeFields();
    init_browser();
    range = (n) => [...Array(n).keys()];
    expected = "{ masterFingerprint: Uint8Array; extendedPubkey: Uint8Array; path: string; }";
  }
});

// node_modules/bip174/src/esm/lib/converter/global/unsignedTx.js
var unsignedTx_exports = {};
__export(unsignedTx_exports, {
  encode: () => encode7
});
function encode7(data) {
  return {
    key: new Uint8Array([GlobalTypes.UNSIGNED_TX]),
    value: data.toBuffer()
  };
}
var init_unsignedTx = __esm({
  "node_modules/bip174/src/esm/lib/converter/global/unsignedTx.js"() {
    init_typeFields();
  }
});

// node_modules/bip174/src/esm/lib/converter/input/finalScriptSig.js
var finalScriptSig_exports = {};
__export(finalScriptSig_exports, {
  canAdd: () => canAdd,
  check: () => check3,
  decode: () => decode7,
  encode: () => encode8,
  expected: () => expected2
});
function decode7(keyVal) {
  if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTSIG) {
    throw new Error(
      "Decode Error: could not decode finalScriptSig with key 0x" + toHex(keyVal.key)
    );
  }
  return keyVal.value;
}
function encode8(data) {
  const key = new Uint8Array([InputTypes.FINAL_SCRIPTSIG]);
  return {
    key,
    value: data
  };
}
function check3(data) {
  return data instanceof Uint8Array;
}
function canAdd(currentData, newData) {
  return !!currentData && !!newData && currentData.finalScriptSig === void 0;
}
var expected2;
var init_finalScriptSig = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/finalScriptSig.js"() {
    init_typeFields();
    init_browser();
    expected2 = "Uint8Array";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/finalScriptWitness.js
var finalScriptWitness_exports = {};
__export(finalScriptWitness_exports, {
  canAdd: () => canAdd2,
  check: () => check4,
  decode: () => decode8,
  encode: () => encode9,
  expected: () => expected3
});
function decode8(keyVal) {
  if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTWITNESS) {
    throw new Error(
      "Decode Error: could not decode finalScriptWitness with key 0x" + toHex(keyVal.key)
    );
  }
  return keyVal.value;
}
function encode9(data) {
  const key = new Uint8Array([InputTypes.FINAL_SCRIPTWITNESS]);
  return {
    key,
    value: data
  };
}
function check4(data) {
  return data instanceof Uint8Array;
}
function canAdd2(currentData, newData) {
  return !!currentData && !!newData && currentData.finalScriptWitness === void 0;
}
var expected3;
var init_finalScriptWitness = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/finalScriptWitness.js"() {
    init_typeFields();
    init_browser();
    expected3 = "Uint8Array";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/nonWitnessUtxo.js
var nonWitnessUtxo_exports = {};
__export(nonWitnessUtxo_exports, {
  canAdd: () => canAdd3,
  check: () => check5,
  decode: () => decode9,
  encode: () => encode10,
  expected: () => expected4
});
function decode9(keyVal) {
  if (keyVal.key[0] !== InputTypes.NON_WITNESS_UTXO) {
    throw new Error(
      "Decode Error: could not decode nonWitnessUtxo with key 0x" + toHex(keyVal.key)
    );
  }
  return keyVal.value;
}
function encode10(data) {
  return {
    key: new Uint8Array([InputTypes.NON_WITNESS_UTXO]),
    value: data
  };
}
function check5(data) {
  return data instanceof Uint8Array;
}
function canAdd3(currentData, newData) {
  return !!currentData && !!newData && currentData.nonWitnessUtxo === void 0;
}
var expected4;
var init_nonWitnessUtxo = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/nonWitnessUtxo.js"() {
    init_typeFields();
    init_browser();
    expected4 = "Uint8Array";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/partialSig.js
var partialSig_exports = {};
__export(partialSig_exports, {
  canAddToArray: () => canAddToArray2,
  check: () => check6,
  decode: () => decode10,
  encode: () => encode11,
  expected: () => expected5
});
function decode10(keyVal) {
  if (keyVal.key[0] !== InputTypes.PARTIAL_SIG) {
    throw new Error(
      "Decode Error: could not decode partialSig with key 0x" + toHex(keyVal.key)
    );
  }
  if (!(keyVal.key.length === 34 || keyVal.key.length === 66) || ![2, 3, 4].includes(keyVal.key[1])) {
    throw new Error(
      "Decode Error: partialSig has invalid pubkey in key 0x" + toHex(keyVal.key)
    );
  }
  const pubkey = keyVal.key.slice(1);
  return {
    pubkey,
    signature: keyVal.value
  };
}
function encode11(pSig) {
  const head = new Uint8Array([InputTypes.PARTIAL_SIG]);
  return {
    key: concat([head, pSig.pubkey]),
    value: pSig.signature
  };
}
function check6(data) {
  return data.pubkey instanceof Uint8Array && data.signature instanceof Uint8Array && [33, 65].includes(data.pubkey.length) && [2, 3, 4].includes(data.pubkey[0]) && isDerSigWithSighash(data.signature);
}
function isDerSigWithSighash(buf) {
  if (!(buf instanceof Uint8Array) || buf.length < 9) return false;
  if (buf[0] !== 48) return false;
  if (buf.length !== buf[1] + 3) return false;
  if (buf[2] !== 2) return false;
  const rLen = buf[3];
  if (rLen > 33 || rLen < 1) return false;
  if (buf[3 + rLen + 1] !== 2) return false;
  const sLen = buf[3 + rLen + 2];
  if (sLen > 33 || sLen < 1) return false;
  if (buf.length !== 3 + rLen + 2 + sLen + 2) return false;
  return true;
}
function canAddToArray2(array2, item, dupeSet) {
  const dupeString = toHex(item.pubkey);
  if (dupeSet.has(dupeString)) return false;
  dupeSet.add(dupeString);
  return array2.filter((v) => compare(v.pubkey, item.pubkey) === 0).length === 0;
}
var expected5;
var init_partialSig = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/partialSig.js"() {
    init_typeFields();
    init_browser();
    expected5 = "{ pubkey: Uint8Array; signature: Uint8Array; }";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/porCommitment.js
var porCommitment_exports = {};
__export(porCommitment_exports, {
  canAdd: () => canAdd4,
  check: () => check7,
  decode: () => decode11,
  encode: () => encode12,
  expected: () => expected6
});
function decode11(keyVal) {
  if (keyVal.key[0] !== InputTypes.POR_COMMITMENT) {
    throw new Error(
      "Decode Error: could not decode porCommitment with key 0x" + toHex(keyVal.key)
    );
  }
  return toUtf8(keyVal.value);
}
function encode12(data) {
  const key = new Uint8Array([InputTypes.POR_COMMITMENT]);
  return {
    key,
    value: fromUtf8(data)
  };
}
function check7(data) {
  return typeof data === "string";
}
function canAdd4(currentData, newData) {
  return !!currentData && !!newData && currentData.porCommitment === void 0;
}
var expected6;
var init_porCommitment = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/porCommitment.js"() {
    init_typeFields();
    init_browser();
    expected6 = "string";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/sighashType.js
var sighashType_exports = {};
__export(sighashType_exports, {
  canAdd: () => canAdd5,
  check: () => check8,
  decode: () => decode12,
  encode: () => encode13,
  expected: () => expected7
});
function decode12(keyVal) {
  if (keyVal.key[0] !== InputTypes.SIGHASH_TYPE) {
    throw new Error(
      "Decode Error: could not decode sighashType with key 0x" + toHex(keyVal.key)
    );
  }
  return Number(readUInt32(keyVal.value, 0, "LE"));
}
function encode13(data) {
  const key = Uint8Array.from([InputTypes.SIGHASH_TYPE]);
  const value2 = new Uint8Array(4);
  writeUInt32(value2, 0, data, "LE");
  return {
    key,
    value: value2
  };
}
function check8(data) {
  return typeof data === "number";
}
function canAdd5(currentData, newData) {
  return !!currentData && !!newData && currentData.sighashType === void 0;
}
var expected7;
var init_sighashType = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/sighashType.js"() {
    init_typeFields();
    init_browser();
    expected7 = "number";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/tapKeySig.js
var tapKeySig_exports = {};
__export(tapKeySig_exports, {
  canAdd: () => canAdd6,
  check: () => check9,
  decode: () => decode13,
  encode: () => encode14,
  expected: () => expected8
});
function decode13(keyVal) {
  if (keyVal.key[0] !== InputTypes.TAP_KEY_SIG || keyVal.key.length !== 1) {
    throw new Error(
      "Decode Error: could not decode tapKeySig with key 0x" + toHex(keyVal.key)
    );
  }
  if (!check9(keyVal.value)) {
    throw new Error(
      "Decode Error: tapKeySig not a valid 64-65-byte BIP340 signature"
    );
  }
  return keyVal.value;
}
function encode14(value2) {
  const key = Uint8Array.from([InputTypes.TAP_KEY_SIG]);
  return { key, value: value2 };
}
function check9(data) {
  return data instanceof Uint8Array && (data.length === 64 || data.length === 65);
}
function canAdd6(currentData, newData) {
  return !!currentData && !!newData && currentData.tapKeySig === void 0;
}
var expected8;
var init_tapKeySig = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/tapKeySig.js"() {
    init_typeFields();
    init_browser();
    expected8 = "Uint8Array";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/tapLeafScript.js
var tapLeafScript_exports = {};
__export(tapLeafScript_exports, {
  canAddToArray: () => canAddToArray3,
  check: () => check10,
  decode: () => decode14,
  encode: () => encode15,
  expected: () => expected9
});
function decode14(keyVal) {
  if (keyVal.key[0] !== InputTypes.TAP_LEAF_SCRIPT) {
    throw new Error(
      "Decode Error: could not decode tapLeafScript with key 0x" + toHex(keyVal.key)
    );
  }
  if ((keyVal.key.length - 2) % 32 !== 0) {
    throw new Error(
      "Decode Error: tapLeafScript has invalid control block in key 0x" + toHex(keyVal.key)
    );
  }
  const leafVersion = keyVal.value[keyVal.value.length - 1];
  if ((keyVal.key[1] & 254) !== leafVersion) {
    throw new Error(
      "Decode Error: tapLeafScript bad leaf version in key 0x" + toHex(keyVal.key)
    );
  }
  const script = keyVal.value.slice(0, -1);
  const controlBlock = keyVal.key.slice(1);
  return { controlBlock, script, leafVersion };
}
function encode15(tScript) {
  const head = Uint8Array.from([InputTypes.TAP_LEAF_SCRIPT]);
  const verBuf = Uint8Array.from([tScript.leafVersion]);
  return {
    key: concat([head, tScript.controlBlock]),
    value: concat([tScript.script, verBuf])
  };
}
function check10(data) {
  return data.controlBlock instanceof Uint8Array && (data.controlBlock.length - 1) % 32 === 0 && (data.controlBlock[0] & 254) === data.leafVersion && data.script instanceof Uint8Array;
}
function canAddToArray3(array2, item, dupeSet) {
  const dupeString = toHex(item.controlBlock);
  if (dupeSet.has(dupeString)) return false;
  dupeSet.add(dupeString);
  return array2.filter((v) => compare(v.controlBlock, item.controlBlock) === 0).length === 0;
}
var expected9;
var init_tapLeafScript = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/tapLeafScript.js"() {
    init_typeFields();
    init_browser();
    expected9 = "{ controlBlock: Uint8Array; leafVersion: number, script: Uint8Array; }";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/tapMerkleRoot.js
var tapMerkleRoot_exports = {};
__export(tapMerkleRoot_exports, {
  canAdd: () => canAdd7,
  check: () => check11,
  decode: () => decode15,
  encode: () => encode16,
  expected: () => expected10
});
function decode15(keyVal) {
  if (keyVal.key[0] !== InputTypes.TAP_MERKLE_ROOT || keyVal.key.length !== 1) {
    throw new Error(
      "Decode Error: could not decode tapMerkleRoot with key 0x" + toHex(keyVal.key)
    );
  }
  if (!check11(keyVal.value)) {
    throw new Error("Decode Error: tapMerkleRoot not a 32-byte hash");
  }
  return keyVal.value;
}
function encode16(value2) {
  const key = Uint8Array.from([InputTypes.TAP_MERKLE_ROOT]);
  return { key, value: value2 };
}
function check11(data) {
  return data instanceof Uint8Array && data.length === 32;
}
function canAdd7(currentData, newData) {
  return !!currentData && !!newData && currentData.tapMerkleRoot === void 0;
}
var expected10;
var init_tapMerkleRoot = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/tapMerkleRoot.js"() {
    init_typeFields();
    init_browser();
    expected10 = "Uint8Array";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/tapScriptSig.js
var tapScriptSig_exports = {};
__export(tapScriptSig_exports, {
  canAddToArray: () => canAddToArray4,
  check: () => check12,
  decode: () => decode16,
  encode: () => encode17,
  expected: () => expected11
});
function decode16(keyVal) {
  if (keyVal.key[0] !== InputTypes.TAP_SCRIPT_SIG) {
    throw new Error(
      "Decode Error: could not decode tapScriptSig with key 0x" + toHex(keyVal.key)
    );
  }
  if (keyVal.key.length !== 65) {
    throw new Error(
      "Decode Error: tapScriptSig has invalid key 0x" + toHex(keyVal.key)
    );
  }
  if (keyVal.value.length !== 64 && keyVal.value.length !== 65) {
    throw new Error(
      "Decode Error: tapScriptSig has invalid signature in key 0x" + toHex(keyVal.key)
    );
  }
  const pubkey = keyVal.key.slice(1, 33);
  const leafHash = keyVal.key.slice(33);
  return {
    pubkey,
    leafHash,
    signature: keyVal.value
  };
}
function encode17(tSig) {
  const head = Uint8Array.from([InputTypes.TAP_SCRIPT_SIG]);
  return {
    key: concat([head, tSig.pubkey, tSig.leafHash]),
    value: tSig.signature
  };
}
function check12(data) {
  return data.pubkey instanceof Uint8Array && data.leafHash instanceof Uint8Array && data.signature instanceof Uint8Array && data.pubkey.length === 32 && data.leafHash.length === 32 && (data.signature.length === 64 || data.signature.length === 65);
}
function canAddToArray4(array2, item, dupeSet) {
  const dupeString = toHex(item.pubkey) + toHex(item.leafHash);
  if (dupeSet.has(dupeString)) return false;
  dupeSet.add(dupeString);
  return array2.filter(
    (v) => compare(v.pubkey, item.pubkey) === 0 && compare(v.leafHash, item.leafHash) === 0
  ).length === 0;
}
var expected11;
var init_tapScriptSig = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/tapScriptSig.js"() {
    init_typeFields();
    init_browser();
    expected11 = "{ pubkey: Uint8Array; leafHash: Uint8Array; signature: Uint8Array; }";
  }
});

// node_modules/bip174/src/esm/lib/converter/input/witnessUtxo.js
var witnessUtxo_exports = {};
__export(witnessUtxo_exports, {
  canAdd: () => canAdd8,
  check: () => check13,
  decode: () => decode17,
  encode: () => encode18,
  expected: () => expected12
});
function decode17(keyVal) {
  if (keyVal.key[0] !== InputTypes.WITNESS_UTXO) {
    throw new Error(
      "Decode Error: could not decode witnessUtxo with key 0x" + toHex(keyVal.key)
    );
  }
  const value2 = readInt64(keyVal.value, 0, "LE");
  let _offset = 8;
  const { numberValue: scriptLen, bytes } = decode5(
    keyVal.value,
    _offset
  );
  _offset += bytes;
  const script = keyVal.value.slice(_offset);
  if (script.length !== scriptLen) {
    throw new Error("Decode Error: WITNESS_UTXO script is not proper length");
  }
  return {
    script,
    value: value2
  };
}
function encode18(data) {
  const { script, value: value2 } = data;
  const varuintlen = encodingLength2(script.length);
  const result = new Uint8Array(8 + varuintlen + script.length);
  writeInt64(result, 0, BigInt(value2), "LE");
  encode5(script.length, result, 8);
  result.set(script, 8 + varuintlen);
  return {
    key: Uint8Array.from([InputTypes.WITNESS_UTXO]),
    value: result
  };
}
function check13(data) {
  return data.script instanceof Uint8Array && typeof data.value === "bigint";
}
function canAdd8(currentData, newData) {
  return !!currentData && !!newData && currentData.witnessUtxo === void 0;
}
var expected12;
var init_witnessUtxo = __esm({
  "node_modules/bip174/src/esm/lib/converter/input/witnessUtxo.js"() {
    init_typeFields();
    init_browser();
    init_esm4();
    expected12 = "{ script: Uint8Array; value: bigint; }";
  }
});

// node_modules/bip174/src/esm/lib/converter/output/tapTree.js
var tapTree_exports = {};
__export(tapTree_exports, {
  canAdd: () => canAdd9,
  check: () => check14,
  decode: () => decode18,
  encode: () => encode19,
  expected: () => expected13
});
function decode18(keyVal) {
  if (keyVal.key[0] !== OutputTypes.TAP_TREE || keyVal.key.length !== 1) {
    throw new Error(
      "Decode Error: could not decode tapTree with key 0x" + toHex(keyVal.key)
    );
  }
  let _offset = 0;
  const data = [];
  while (_offset < keyVal.value.length) {
    const depth = keyVal.value[_offset++];
    const leafVersion = keyVal.value[_offset++];
    const { numberValue: scriptLen, bytes } = decode5(
      keyVal.value,
      _offset
    );
    _offset += bytes;
    data.push({
      depth,
      leafVersion,
      script: keyVal.value.slice(_offset, _offset + scriptLen)
    });
    _offset += scriptLen;
  }
  return { leaves: data };
}
function encode19(tree) {
  const key = Uint8Array.from([OutputTypes.TAP_TREE]);
  const bufs = [].concat(
    ...tree.leaves.map((tapLeaf) => [
      Uint8Array.of(tapLeaf.depth, tapLeaf.leafVersion),
      encode5(BigInt(tapLeaf.script.length)).buffer,
      tapLeaf.script
    ])
  );
  return {
    key,
    value: concat(bufs)
  };
}
function check14(data) {
  return Array.isArray(data.leaves) && data.leaves.every(
    (tapLeaf) => tapLeaf.depth >= 0 && tapLeaf.depth <= 128 && (tapLeaf.leafVersion & 254) === tapLeaf.leafVersion && tapLeaf.script instanceof Uint8Array
  );
}
function canAdd9(currentData, newData) {
  return !!currentData && !!newData && currentData.tapTree === void 0;
}
var expected13;
var init_tapTree = __esm({
  "node_modules/bip174/src/esm/lib/converter/output/tapTree.js"() {
    init_typeFields();
    init_esm4();
    init_browser();
    expected13 = "{ leaves: [{ depth: number; leafVersion: number, script: Uint8Array; }] }";
  }
});

// node_modules/bip174/src/esm/lib/converter/shared/bip32Derivation.js
function makeConverter(TYPE_BYTE, isValidPubkey = isValidDERKey) {
  function decode19(keyVal) {
    if (keyVal.key[0] !== TYPE_BYTE) {
      throw new Error(
        "Decode Error: could not decode bip32Derivation with key 0x" + toHex(keyVal.key)
      );
    }
    const pubkey = keyVal.key.slice(1);
    if (!isValidPubkey(pubkey)) {
      throw new Error(
        "Decode Error: bip32Derivation has invalid pubkey in key 0x" + toHex(keyVal.key)
      );
    }
    if (keyVal.value.length / 4 % 1 !== 0) {
      throw new Error(
        "Decode Error: Input BIP32_DERIVATION value length should be multiple of 4"
      );
    }
    const data = {
      masterFingerprint: keyVal.value.slice(0, 4),
      pubkey,
      path: "m"
    };
    for (const i of range2(keyVal.value.length / 4 - 1)) {
      const val = readUInt32(keyVal.value, i * 4 + 4, "LE");
      const isHard = !!(val & 2147483648);
      const idx = val & 2147483647;
      data.path += "/" + idx.toString(10) + (isHard ? "'" : "");
    }
    return data;
  }
  function encode20(data) {
    const head = Uint8Array.from([TYPE_BYTE]);
    const key = concat([head, data.pubkey]);
    const splitPath = data.path.split("/");
    const value2 = new Uint8Array(splitPath.length * 4);
    value2.set(data.masterFingerprint, 0);
    let offset = 4;
    splitPath.slice(1).forEach((level) => {
      const isHard = level.slice(-1) === "'";
      let num = 2147483647 & parseInt(isHard ? level.slice(0, -1) : level, 10);
      if (isHard) num += 2147483648;
      writeUInt32(value2, offset, num, "LE");
      offset += 4;
    });
    return {
      key,
      value: value2
    };
  }
  const expected14 = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; }";
  function check15(data) {
    return data.pubkey instanceof Uint8Array && data.masterFingerprint instanceof Uint8Array && typeof data.path === "string" && isValidPubkey(data.pubkey) && data.masterFingerprint.length === 4;
  }
  function canAddToArray5(array2, item, dupeSet) {
    const dupeString = toHex(item.pubkey);
    if (dupeSet.has(dupeString)) return false;
    dupeSet.add(dupeString);
    return array2.filter((v) => compare(v.pubkey, item.pubkey) === 0).length === 0;
  }
  return {
    decode: decode19,
    encode: encode20,
    check: check15,
    expected: expected14,
    canAddToArray: canAddToArray5
  };
}
var range2, isValidDERKey;
var init_bip32Derivation = __esm({
  "node_modules/bip174/src/esm/lib/converter/shared/bip32Derivation.js"() {
    init_browser();
    range2 = (n) => [...Array(n).keys()];
    isValidDERKey = (pubkey) => pubkey.length === 33 && [2, 3].includes(pubkey[0]) || pubkey.length === 65 && 4 === pubkey[0];
  }
});

// node_modules/bip174/src/esm/lib/converter/shared/checkPubkey.js
function makeChecker(pubkeyTypes) {
  return checkPubkey;
  function checkPubkey(keyVal) {
    let pubkey;
    if (pubkeyTypes.includes(keyVal.key[0])) {
      pubkey = keyVal.key.slice(1);
      if (!(pubkey.length === 33 || pubkey.length === 65) || ![2, 3, 4].includes(pubkey[0])) {
        throw new Error(
          "Format Error: invalid pubkey in key 0x" + toHex(keyVal.key)
        );
      }
    }
    return pubkey;
  }
}
var init_checkPubkey = __esm({
  "node_modules/bip174/src/esm/lib/converter/shared/checkPubkey.js"() {
    init_browser();
  }
});

// node_modules/bip174/src/esm/lib/converter/shared/redeemScript.js
function makeConverter2(TYPE_BYTE) {
  function decode19(keyVal) {
    if (keyVal.key[0] !== TYPE_BYTE) {
      throw new Error(
        "Decode Error: could not decode redeemScript with key 0x" + toHex(keyVal.key)
      );
    }
    return keyVal.value;
  }
  function encode20(data) {
    const key = Uint8Array.from([TYPE_BYTE]);
    return {
      key,
      value: data
    };
  }
  const expected14 = "Uint8Array";
  function check15(data) {
    return data instanceof Uint8Array;
  }
  function canAdd10(currentData, newData) {
    return !!currentData && !!newData && currentData.redeemScript === void 0;
  }
  return {
    decode: decode19,
    encode: encode20,
    check: check15,
    expected: expected14,
    canAdd: canAdd10
  };
}
var init_redeemScript = __esm({
  "node_modules/bip174/src/esm/lib/converter/shared/redeemScript.js"() {
    init_browser();
  }
});

// node_modules/bip174/src/esm/lib/converter/shared/tapBip32Derivation.js
function makeConverter3(TYPE_BYTE) {
  const parent = makeConverter(TYPE_BYTE, isValidBIP340Key);
  function decode19(keyVal) {
    const { numberValue: nHashes, bytes: nHashesLen } = decode5(
      keyVal.value
    );
    const base2 = parent.decode({
      key: keyVal.key,
      value: keyVal.value.slice(nHashesLen + Number(nHashes) * 32)
    });
    const leafHashes = new Array(Number(nHashes));
    for (let i = 0, _offset = nHashesLen; i < nHashes; i++, _offset += 32) {
      leafHashes[i] = keyVal.value.slice(_offset, _offset + 32);
    }
    return { ...base2, leafHashes };
  }
  function encode20(data) {
    const base2 = parent.encode(data);
    const nHashesLen = encodingLength2(data.leafHashes.length);
    const nHashesBuf = new Uint8Array(nHashesLen);
    encode5(data.leafHashes.length, nHashesBuf);
    const value2 = concat([nHashesBuf, ...data.leafHashes, base2.value]);
    return { ...base2, value: value2 };
  }
  const expected14 = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; leafHashes: Uint8Array[]; }";
  function check15(data) {
    return Array.isArray(data.leafHashes) && data.leafHashes.every(
      (leafHash) => leafHash instanceof Uint8Array && leafHash.length === 32
    ) && parent.check(data);
  }
  return {
    decode: decode19,
    encode: encode20,
    check: check15,
    expected: expected14,
    canAddToArray: parent.canAddToArray
  };
}
var isValidBIP340Key;
var init_tapBip32Derivation = __esm({
  "node_modules/bip174/src/esm/lib/converter/shared/tapBip32Derivation.js"() {
    init_esm4();
    init_browser();
    init_bip32Derivation();
    isValidBIP340Key = (pubkey) => pubkey.length === 32;
  }
});

// node_modules/bip174/src/esm/lib/converter/shared/tapInternalKey.js
function makeConverter4(TYPE_BYTE) {
  function decode19(keyVal) {
    if (keyVal.key[0] !== TYPE_BYTE || keyVal.key.length !== 1) {
      throw new Error(
        "Decode Error: could not decode tapInternalKey with key 0x" + toHex(keyVal.key)
      );
    }
    if (keyVal.value.length !== 32) {
      throw new Error(
        "Decode Error: tapInternalKey not a 32-byte x-only pubkey"
      );
    }
    return keyVal.value;
  }
  function encode20(value2) {
    const key = Uint8Array.from([TYPE_BYTE]);
    return { key, value: value2 };
  }
  const expected14 = "Uint8Array";
  function check15(data) {
    return data instanceof Uint8Array && data.length === 32;
  }
  function canAdd10(currentData, newData) {
    return !!currentData && !!newData && currentData.tapInternalKey === void 0;
  }
  return {
    decode: decode19,
    encode: encode20,
    check: check15,
    expected: expected14,
    canAdd: canAdd10
  };
}
var init_tapInternalKey = __esm({
  "node_modules/bip174/src/esm/lib/converter/shared/tapInternalKey.js"() {
    init_browser();
  }
});

// node_modules/bip174/src/esm/lib/converter/shared/witnessScript.js
function makeConverter5(TYPE_BYTE) {
  function decode19(keyVal) {
    if (keyVal.key[0] !== TYPE_BYTE) {
      throw new Error(
        "Decode Error: could not decode witnessScript with key 0x" + toHex(keyVal.key)
      );
    }
    return keyVal.value;
  }
  function encode20(data) {
    const key = Uint8Array.from([TYPE_BYTE]);
    return {
      key,
      value: data
    };
  }
  const expected14 = "Uint8Array";
  function check15(data) {
    return data instanceof Uint8Array;
  }
  function canAdd10(currentData, newData) {
    return !!currentData && !!newData && currentData.witnessScript === void 0;
  }
  return {
    decode: decode19,
    encode: encode20,
    check: check15,
    expected: expected14,
    canAdd: canAdd10
  };
}
var init_witnessScript = __esm({
  "node_modules/bip174/src/esm/lib/converter/shared/witnessScript.js"() {
    init_browser();
  }
});

// node_modules/bip174/src/esm/lib/converter/index.js
var converter_exports = {};
__export(converter_exports, {
  globals: () => globals,
  inputs: () => inputs,
  outputs: () => outputs
});
var globals, inputs, outputs;
var init_converter = __esm({
  "node_modules/bip174/src/esm/lib/converter/index.js"() {
    init_typeFields();
    init_globalXpub();
    init_unsignedTx();
    init_finalScriptSig();
    init_finalScriptWitness();
    init_nonWitnessUtxo();
    init_partialSig();
    init_porCommitment();
    init_sighashType();
    init_tapKeySig();
    init_tapLeafScript();
    init_tapMerkleRoot();
    init_tapScriptSig();
    init_witnessUtxo();
    init_tapTree();
    init_bip32Derivation();
    init_checkPubkey();
    init_redeemScript();
    init_tapBip32Derivation();
    init_tapInternalKey();
    init_witnessScript();
    globals = {
      unsignedTx: unsignedTx_exports,
      globalXpub: globalXpub_exports,
      // pass an Array of key bytes that require pubkey beside the key
      checkPubkey: makeChecker([])
    };
    inputs = {
      nonWitnessUtxo: nonWitnessUtxo_exports,
      partialSig: partialSig_exports,
      sighashType: sighashType_exports,
      finalScriptSig: finalScriptSig_exports,
      finalScriptWitness: finalScriptWitness_exports,
      porCommitment: porCommitment_exports,
      witnessUtxo: witnessUtxo_exports,
      bip32Derivation: makeConverter(InputTypes.BIP32_DERIVATION),
      redeemScript: makeConverter2(InputTypes.REDEEM_SCRIPT),
      witnessScript: makeConverter5(InputTypes.WITNESS_SCRIPT),
      checkPubkey: makeChecker([
        InputTypes.PARTIAL_SIG,
        InputTypes.BIP32_DERIVATION
      ]),
      tapKeySig: tapKeySig_exports,
      tapScriptSig: tapScriptSig_exports,
      tapLeafScript: tapLeafScript_exports,
      tapBip32Derivation: makeConverter3(
        InputTypes.TAP_BIP32_DERIVATION
      ),
      tapInternalKey: makeConverter4(InputTypes.TAP_INTERNAL_KEY),
      tapMerkleRoot: tapMerkleRoot_exports
    };
    outputs = {
      bip32Derivation: makeConverter(OutputTypes.BIP32_DERIVATION),
      redeemScript: makeConverter2(OutputTypes.REDEEM_SCRIPT),
      witnessScript: makeConverter5(OutputTypes.WITNESS_SCRIPT),
      checkPubkey: makeChecker([OutputTypes.BIP32_DERIVATION]),
      tapBip32Derivation: makeConverter3(
        OutputTypes.TAP_BIP32_DERIVATION
      ),
      tapTree: tapTree_exports,
      tapInternalKey: makeConverter4(OutputTypes.TAP_INTERNAL_KEY)
    };
  }
});

// node_modules/bip174/src/esm/lib/converter/tools.js
function keyValsToBuffer(keyVals) {
  const buffers = keyVals.map(keyValToBuffer);
  buffers.push(Uint8Array.from([0]));
  return concat(buffers);
}
function keyValToBuffer(keyVal) {
  const keyLen = keyVal.key.length;
  const valLen = keyVal.value.length;
  const keyVarIntLen = encodingLength2(keyLen);
  const valVarIntLen = encodingLength2(valLen);
  const buffer = new Uint8Array(keyVarIntLen + keyLen + valVarIntLen + valLen);
  encode5(keyLen, buffer, 0);
  buffer.set(keyVal.key, keyVarIntLen);
  encode5(valLen, buffer, keyVarIntLen + keyLen);
  buffer.set(keyVal.value, keyVarIntLen + keyLen + valVarIntLen);
  return buffer;
}
var range3;
var init_tools = __esm({
  "node_modules/bip174/src/esm/lib/converter/tools.js"() {
    init_esm4();
    init_browser();
    range3 = (n) => [...Array(n).keys()];
  }
});

// node_modules/bip174/src/esm/lib/parser/fromBuffer.js
function psbtFromBuffer(buffer, txGetter) {
  let offset = 0;
  function varSlice() {
    const { numberValue: keyLen, bytes } = decode5(buffer, offset);
    offset += bytes;
    const key = buffer.slice(offset, offset + Number(keyLen));
    offset += Number(keyLen);
    return key;
  }
  function readUInt32BE() {
    const num = readUInt32(buffer, offset, "BE");
    offset += 4;
    return num;
  }
  function readUInt82() {
    const num = readUInt8(buffer, offset);
    offset += 1;
    return num;
  }
  function getKeyValue() {
    const key = varSlice();
    const value2 = varSlice();
    return {
      key,
      value: value2
    };
  }
  function checkEndOfKeyValPairs() {
    if (offset >= buffer.length) {
      throw new Error("Format Error: Unexpected End of PSBT");
    }
    const isEnd = readUInt8(buffer, offset) === 0;
    if (isEnd) {
      offset++;
    }
    return isEnd;
  }
  if (readUInt32BE() !== 1886610036) {
    throw new Error("Format Error: Invalid Magic Number");
  }
  if (readUInt82() !== 255) {
    throw new Error(
      "Format Error: Magic Number must be followed by 0xff separator"
    );
  }
  const globalMapKeyVals = [];
  const globalKeyIndex = {};
  while (!checkEndOfKeyValPairs()) {
    const keyVal = getKeyValue();
    const hexKey = toHex(keyVal.key);
    if (globalKeyIndex[hexKey]) {
      throw new Error(
        "Format Error: Keys must be unique for global keymap: key " + hexKey
      );
    }
    globalKeyIndex[hexKey] = 1;
    globalMapKeyVals.push(keyVal);
  }
  const unsignedTxMaps = globalMapKeyVals.filter(
    (keyVal) => keyVal.key[0] === GlobalTypes.UNSIGNED_TX
  );
  if (unsignedTxMaps.length !== 1) {
    throw new Error("Format Error: Only one UNSIGNED_TX allowed");
  }
  const unsignedTx = txGetter(unsignedTxMaps[0].value);
  const { inputCount, outputCount } = unsignedTx.getInputOutputCounts();
  const inputKeyVals = [];
  const outputKeyVals = [];
  for (const index of range3(inputCount)) {
    const inputKeyIndex = {};
    const input = [];
    while (!checkEndOfKeyValPairs()) {
      const keyVal = getKeyValue();
      const hexKey = toHex(keyVal.key);
      if (inputKeyIndex[hexKey]) {
        throw new Error(
          "Format Error: Keys must be unique for each input: input index " + index + " key " + hexKey
        );
      }
      inputKeyIndex[hexKey] = 1;
      input.push(keyVal);
    }
    inputKeyVals.push(input);
  }
  for (const index of range3(outputCount)) {
    const outputKeyIndex = {};
    const output = [];
    while (!checkEndOfKeyValPairs()) {
      const keyVal = getKeyValue();
      const hexKey = toHex(keyVal.key);
      if (outputKeyIndex[hexKey]) {
        throw new Error(
          "Format Error: Keys must be unique for each output: output index " + index + " key " + hexKey
        );
      }
      outputKeyIndex[hexKey] = 1;
      output.push(keyVal);
    }
    outputKeyVals.push(output);
  }
  return psbtFromKeyVals(unsignedTx, {
    globalMapKeyVals,
    inputKeyVals,
    outputKeyVals
  });
}
function checkKeyBuffer(type, keyBuf, keyNum) {
  if (compare(keyBuf, Uint8Array.from([keyNum]))) {
    throw new Error(
      // `Format Error: Invalid ${type} key: ${keyBuf.toString('hex')}`,
      `Format Error: Invalid ${type} key: ${toHex(keyBuf)}`
    );
  }
}
function psbtFromKeyVals(unsignedTx, { globalMapKeyVals, inputKeyVals, outputKeyVals }) {
  const globalMap = {
    unsignedTx
  };
  let txCount = 0;
  for (const keyVal of globalMapKeyVals) {
    switch (keyVal.key[0]) {
      case GlobalTypes.UNSIGNED_TX:
        checkKeyBuffer("global", keyVal.key, GlobalTypes.UNSIGNED_TX);
        if (txCount > 0) {
          throw new Error("Format Error: GlobalMap has multiple UNSIGNED_TX");
        }
        txCount++;
        break;
      case GlobalTypes.GLOBAL_XPUB:
        if (globalMap.globalXpub === void 0) {
          globalMap.globalXpub = [];
        }
        globalMap.globalXpub.push(globals.globalXpub.decode(keyVal));
        break;
      default:
        if (!globalMap.unknownKeyVals) globalMap.unknownKeyVals = [];
        globalMap.unknownKeyVals.push(keyVal);
    }
  }
  const inputCount = inputKeyVals.length;
  const outputCount = outputKeyVals.length;
  const inputs2 = [];
  const outputs2 = [];
  for (const index of range3(inputCount)) {
    const input = {};
    for (const keyVal of inputKeyVals[index]) {
      inputs.checkPubkey(keyVal);
      switch (keyVal.key[0]) {
        case InputTypes.NON_WITNESS_UTXO:
          checkKeyBuffer("input", keyVal.key, InputTypes.NON_WITNESS_UTXO);
          if (input.nonWitnessUtxo !== void 0) {
            throw new Error(
              "Format Error: Input has multiple NON_WITNESS_UTXO"
            );
          }
          input.nonWitnessUtxo = inputs.nonWitnessUtxo.decode(keyVal);
          break;
        case InputTypes.WITNESS_UTXO:
          checkKeyBuffer("input", keyVal.key, InputTypes.WITNESS_UTXO);
          if (input.witnessUtxo !== void 0) {
            throw new Error("Format Error: Input has multiple WITNESS_UTXO");
          }
          input.witnessUtxo = inputs.witnessUtxo.decode(keyVal);
          break;
        case InputTypes.PARTIAL_SIG:
          if (input.partialSig === void 0) {
            input.partialSig = [];
          }
          input.partialSig.push(inputs.partialSig.decode(keyVal));
          break;
        case InputTypes.SIGHASH_TYPE:
          checkKeyBuffer("input", keyVal.key, InputTypes.SIGHASH_TYPE);
          if (input.sighashType !== void 0) {
            throw new Error("Format Error: Input has multiple SIGHASH_TYPE");
          }
          input.sighashType = inputs.sighashType.decode(keyVal);
          break;
        case InputTypes.REDEEM_SCRIPT:
          checkKeyBuffer("input", keyVal.key, InputTypes.REDEEM_SCRIPT);
          if (input.redeemScript !== void 0) {
            throw new Error("Format Error: Input has multiple REDEEM_SCRIPT");
          }
          input.redeemScript = inputs.redeemScript.decode(keyVal);
          break;
        case InputTypes.WITNESS_SCRIPT:
          checkKeyBuffer("input", keyVal.key, InputTypes.WITNESS_SCRIPT);
          if (input.witnessScript !== void 0) {
            throw new Error("Format Error: Input has multiple WITNESS_SCRIPT");
          }
          input.witnessScript = inputs.witnessScript.decode(keyVal);
          break;
        case InputTypes.BIP32_DERIVATION:
          if (input.bip32Derivation === void 0) {
            input.bip32Derivation = [];
          }
          input.bip32Derivation.push(
            inputs.bip32Derivation.decode(keyVal)
          );
          break;
        case InputTypes.FINAL_SCRIPTSIG:
          checkKeyBuffer("input", keyVal.key, InputTypes.FINAL_SCRIPTSIG);
          input.finalScriptSig = inputs.finalScriptSig.decode(keyVal);
          break;
        case InputTypes.FINAL_SCRIPTWITNESS:
          checkKeyBuffer("input", keyVal.key, InputTypes.FINAL_SCRIPTWITNESS);
          input.finalScriptWitness = inputs.finalScriptWitness.decode(
            keyVal
          );
          break;
        case InputTypes.POR_COMMITMENT:
          checkKeyBuffer("input", keyVal.key, InputTypes.POR_COMMITMENT);
          input.porCommitment = inputs.porCommitment.decode(keyVal);
          break;
        case InputTypes.TAP_KEY_SIG:
          checkKeyBuffer("input", keyVal.key, InputTypes.TAP_KEY_SIG);
          input.tapKeySig = inputs.tapKeySig.decode(keyVal);
          break;
        case InputTypes.TAP_SCRIPT_SIG:
          if (input.tapScriptSig === void 0) {
            input.tapScriptSig = [];
          }
          input.tapScriptSig.push(inputs.tapScriptSig.decode(keyVal));
          break;
        case InputTypes.TAP_LEAF_SCRIPT:
          if (input.tapLeafScript === void 0) {
            input.tapLeafScript = [];
          }
          input.tapLeafScript.push(inputs.tapLeafScript.decode(keyVal));
          break;
        case InputTypes.TAP_BIP32_DERIVATION:
          if (input.tapBip32Derivation === void 0) {
            input.tapBip32Derivation = [];
          }
          input.tapBip32Derivation.push(
            inputs.tapBip32Derivation.decode(keyVal)
          );
          break;
        case InputTypes.TAP_INTERNAL_KEY:
          checkKeyBuffer("input", keyVal.key, InputTypes.TAP_INTERNAL_KEY);
          input.tapInternalKey = inputs.tapInternalKey.decode(keyVal);
          break;
        case InputTypes.TAP_MERKLE_ROOT:
          checkKeyBuffer("input", keyVal.key, InputTypes.TAP_MERKLE_ROOT);
          input.tapMerkleRoot = inputs.tapMerkleRoot.decode(keyVal);
          break;
        default:
          if (!input.unknownKeyVals) input.unknownKeyVals = [];
          input.unknownKeyVals.push(keyVal);
      }
    }
    inputs2.push(input);
  }
  for (const index of range3(outputCount)) {
    const output = {};
    for (const keyVal of outputKeyVals[index]) {
      outputs.checkPubkey(keyVal);
      switch (keyVal.key[0]) {
        case OutputTypes.REDEEM_SCRIPT:
          checkKeyBuffer("output", keyVal.key, OutputTypes.REDEEM_SCRIPT);
          if (output.redeemScript !== void 0) {
            throw new Error("Format Error: Output has multiple REDEEM_SCRIPT");
          }
          output.redeemScript = outputs.redeemScript.decode(keyVal);
          break;
        case OutputTypes.WITNESS_SCRIPT:
          checkKeyBuffer("output", keyVal.key, OutputTypes.WITNESS_SCRIPT);
          if (output.witnessScript !== void 0) {
            throw new Error("Format Error: Output has multiple WITNESS_SCRIPT");
          }
          output.witnessScript = outputs.witnessScript.decode(keyVal);
          break;
        case OutputTypes.BIP32_DERIVATION:
          if (output.bip32Derivation === void 0) {
            output.bip32Derivation = [];
          }
          output.bip32Derivation.push(
            outputs.bip32Derivation.decode(keyVal)
          );
          break;
        case OutputTypes.TAP_INTERNAL_KEY:
          checkKeyBuffer("output", keyVal.key, OutputTypes.TAP_INTERNAL_KEY);
          output.tapInternalKey = outputs.tapInternalKey.decode(keyVal);
          break;
        case OutputTypes.TAP_TREE:
          checkKeyBuffer("output", keyVal.key, OutputTypes.TAP_TREE);
          output.tapTree = outputs.tapTree.decode(keyVal);
          break;
        case OutputTypes.TAP_BIP32_DERIVATION:
          if (output.tapBip32Derivation === void 0) {
            output.tapBip32Derivation = [];
          }
          output.tapBip32Derivation.push(
            outputs.tapBip32Derivation.decode(keyVal)
          );
          break;
        default:
          if (!output.unknownKeyVals) output.unknownKeyVals = [];
          output.unknownKeyVals.push(keyVal);
      }
    }
    outputs2.push(output);
  }
  return { globalMap, inputs: inputs2, outputs: outputs2 };
}
var init_fromBuffer = __esm({
  "node_modules/bip174/src/esm/lib/parser/fromBuffer.js"() {
    init_converter();
    init_tools();
    init_esm4();
    init_browser();
    init_typeFields();
  }
});

// node_modules/bip174/src/esm/lib/parser/toBuffer.js
function psbtToBuffer({ globalMap, inputs: inputs2, outputs: outputs2 }) {
  const { globalKeyVals, inputKeyVals, outputKeyVals } = psbtToKeyVals({
    globalMap,
    inputs: inputs2,
    outputs: outputs2
  });
  const globalBuffer = keyValsToBuffer(globalKeyVals);
  const keyValsOrEmptyToBuffer = (keyVals) => keyVals.length === 0 ? [Uint8Array.from([0])] : keyVals.map(keyValsToBuffer);
  const inputBuffers = keyValsOrEmptyToBuffer(inputKeyVals);
  const outputBuffers = keyValsOrEmptyToBuffer(outputKeyVals);
  const header = new Uint8Array(5);
  header.set([112, 115, 98, 116, 255], 0);
  return concat(
    [header, globalBuffer].concat(inputBuffers, outputBuffers)
  );
}
function keyValsFromMap(keyValMap, converterFactory) {
  const keyHexSet = /* @__PURE__ */ new Set();
  const keyVals = Object.entries(keyValMap).reduce((result, [key, value2]) => {
    if (key === "unknownKeyVals") return result;
    const converter = converterFactory[key];
    if (converter === void 0) return result;
    const encodedKeyVals = (Array.isArray(value2) ? value2 : [value2]).map(
      converter.encode
    );
    const keyHexes = encodedKeyVals.map((kv) => toHex(kv.key));
    keyHexes.forEach((hex2) => {
      if (keyHexSet.has(hex2))
        throw new Error("Serialize Error: Duplicate key: " + hex2);
      keyHexSet.add(hex2);
    });
    return result.concat(encodedKeyVals);
  }, []);
  const otherKeyVals = keyValMap.unknownKeyVals ? keyValMap.unknownKeyVals.filter((keyVal) => {
    return !keyHexSet.has(toHex(keyVal.key));
  }) : [];
  return keyVals.concat(otherKeyVals).sort(sortKeyVals);
}
function psbtToKeyVals({ globalMap, inputs: inputs2, outputs: outputs2 }) {
  return {
    globalKeyVals: keyValsFromMap(globalMap, globals),
    inputKeyVals: inputs2.map((i) => keyValsFromMap(i, inputs)),
    outputKeyVals: outputs2.map((o) => keyValsFromMap(o, outputs))
  };
}
var sortKeyVals;
var init_toBuffer = __esm({
  "node_modules/bip174/src/esm/lib/parser/toBuffer.js"() {
    init_converter();
    init_tools();
    init_browser();
    sortKeyVals = (a, b) => {
      return compare(a.key, b.key);
    };
  }
});

// node_modules/bip174/src/esm/lib/parser/index.js
var init_parser = __esm({
  "node_modules/bip174/src/esm/lib/parser/index.js"() {
    init_fromBuffer();
    init_toBuffer();
  }
});

// node_modules/bip174/src/esm/lib/combiner/index.js
function combine(psbts) {
  const self = psbts[0];
  const selfKeyVals = psbtToKeyVals(self);
  const others = psbts.slice(1);
  if (others.length === 0) throw new Error("Combine: Nothing to combine");
  const selfTx = getTx(self);
  if (selfTx === void 0) {
    throw new Error("Combine: Self missing transaction");
  }
  const selfGlobalSet = getKeySet(selfKeyVals.globalKeyVals);
  const selfInputSets = selfKeyVals.inputKeyVals.map(getKeySet);
  const selfOutputSets = selfKeyVals.outputKeyVals.map(getKeySet);
  for (const other of others) {
    const otherTx = getTx(other);
    if (otherTx === void 0 || compare(otherTx.toBuffer(), selfTx.toBuffer()) !== 0) {
      throw new Error(
        "Combine: One of the Psbts does not have the same transaction."
      );
    }
    const otherKeyVals = psbtToKeyVals(other);
    const otherGlobalSet = getKeySet(otherKeyVals.globalKeyVals);
    otherGlobalSet.forEach(
      keyPusher(
        selfGlobalSet,
        selfKeyVals.globalKeyVals,
        otherKeyVals.globalKeyVals
      )
    );
    const otherInputSets = otherKeyVals.inputKeyVals.map(getKeySet);
    otherInputSets.forEach(
      (inputSet, idx) => inputSet.forEach(
        keyPusher(
          selfInputSets[idx],
          selfKeyVals.inputKeyVals[idx],
          otherKeyVals.inputKeyVals[idx]
        )
      )
    );
    const otherOutputSets = otherKeyVals.outputKeyVals.map(getKeySet);
    otherOutputSets.forEach(
      (outputSet, idx) => outputSet.forEach(
        keyPusher(
          selfOutputSets[idx],
          selfKeyVals.outputKeyVals[idx],
          otherKeyVals.outputKeyVals[idx]
        )
      )
    );
  }
  return psbtFromKeyVals(selfTx, {
    globalMapKeyVals: selfKeyVals.globalKeyVals,
    inputKeyVals: selfKeyVals.inputKeyVals,
    outputKeyVals: selfKeyVals.outputKeyVals
  });
}
function keyPusher(selfSet, selfKeyVals, otherKeyVals) {
  return (key) => {
    if (selfSet.has(key)) return;
    const newKv = otherKeyVals.filter((kv) => toHex(kv.key) === key)[0];
    selfKeyVals.push(newKv);
    selfSet.add(key);
  };
}
function getTx(psbt) {
  return psbt.globalMap.unsignedTx;
}
function getKeySet(keyVals) {
  const set = /* @__PURE__ */ new Set();
  keyVals.forEach((keyVal) => {
    const hex2 = toHex(keyVal.key);
    if (set.has(hex2))
      throw new Error("Combine: KeyValue Map keys should be unique");
    set.add(hex2);
  });
  return set;
}
var init_combiner = __esm({
  "node_modules/bip174/src/esm/lib/combiner/index.js"() {
    init_parser();
    init_browser();
  }
});

// node_modules/bip174/src/esm/lib/utils.js
function checkForInput(inputs2, inputIndex) {
  const input = inputs2[inputIndex];
  if (input === void 0) throw new Error(`No input #${inputIndex}`);
  return input;
}
function checkForOutput(outputs2, outputIndex) {
  const output = outputs2[outputIndex];
  if (output === void 0) throw new Error(`No output #${outputIndex}`);
  return output;
}
function checkHasKey(checkKeyVal, keyVals, enumLength) {
  if (checkKeyVal.key[0] < enumLength) {
    throw new Error(
      `Use the method for your specific key instead of addUnknownKeyVal*`
    );
  }
  if (keyVals && keyVals.filter((kv) => compare(kv.key, checkKeyVal.key) === 0).length !== 0) {
    throw new Error(`Duplicate Key: ${toHex(checkKeyVal.key)}`);
  }
}
function getEnumLength(myenum) {
  let count = 0;
  Object.keys(myenum).forEach((val) => {
    if (Number(isNaN(Number(val)))) {
      count++;
    }
  });
  return count;
}
function inputCheckUncleanFinalized(inputIndex, input) {
  let result = false;
  if (input.nonWitnessUtxo || input.witnessUtxo) {
    const needScriptSig = !!input.redeemScript;
    const needWitnessScript = !!input.witnessScript;
    const scriptSigOK = !needScriptSig || !!input.finalScriptSig;
    const witnessScriptOK = !needWitnessScript || !!input.finalScriptWitness;
    const hasOneFinal = !!input.finalScriptSig || !!input.finalScriptWitness;
    result = scriptSigOK && witnessScriptOK && hasOneFinal;
  }
  if (result === false) {
    throw new Error(
      `Input #${inputIndex} has too much or too little data to clean`
    );
  }
}
function throwForUpdateMaker(typeName, name, expected14, data) {
  throw new Error(
    `Data for ${typeName} key ${name} is incorrect: Expected ${expected14} and got ${JSON.stringify(data)}`
  );
}
function updateMaker(typeName) {
  return (updateData, mainData) => {
    for (const name of Object.keys(updateData)) {
      const data = updateData[name];
      const { canAdd: canAdd10, canAddToArray: canAddToArray5, check: check15, expected: expected14 } = (
        // @ts-ignore
        converter_exports[typeName + "s"][name] || {}
      );
      const isArray = !!canAddToArray5;
      if (check15) {
        if (isArray) {
          if (!Array.isArray(data) || // @ts-ignore
          mainData[name] && !Array.isArray(mainData[name])) {
            throw new Error(`Key type ${name} must be an array`);
          }
          if (!data.every(check15)) {
            throwForUpdateMaker(typeName, name, expected14, data);
          }
          const arr = mainData[name] || [];
          const dupeCheckSet = /* @__PURE__ */ new Set();
          if (!data.every((v) => canAddToArray5(arr, v, dupeCheckSet))) {
            throw new Error("Can not add duplicate data to array");
          }
          mainData[name] = arr.concat(data);
        } else {
          if (!check15(data)) {
            throwForUpdateMaker(typeName, name, expected14, data);
          }
          if (!canAdd10(mainData, data)) {
            throw new Error(`Can not add duplicate data to ${typeName}`);
          }
          mainData[name] = data;
        }
      }
    }
  };
}
function addInputAttributes(inputs2, data) {
  const index = inputs2.length - 1;
  const input = checkForInput(inputs2, index);
  updateInput(data, input);
}
function addOutputAttributes(outputs2, data) {
  const index = outputs2.length - 1;
  const output = checkForOutput(outputs2, index);
  updateOutput(data, output);
}
var updateGlobal, updateInput, updateOutput;
var init_utils3 = __esm({
  "node_modules/bip174/src/esm/lib/utils.js"() {
    init_converter();
    init_browser();
    updateGlobal = updateMaker("global");
    updateInput = updateMaker("input");
    updateOutput = updateMaker("output");
  }
});

// node_modules/bip174/src/esm/lib/psbt.js
var Psbt;
var init_psbt = __esm({
  "node_modules/bip174/src/esm/lib/psbt.js"() {
    init_combiner();
    init_parser();
    init_typeFields();
    init_utils3();
    init_browser();
    init_utils3();
    Psbt = class {
      constructor(tx) {
        this.inputs = [];
        this.outputs = [];
        this.globalMap = {
          unsignedTx: tx
        };
      }
      static fromBase64(data, txFromBuffer) {
        const buffer = fromBase64(data);
        return this.fromBuffer(buffer, txFromBuffer);
      }
      static fromHex(data, txFromBuffer) {
        const buffer = fromHex(data);
        return this.fromBuffer(buffer, txFromBuffer);
      }
      static fromBuffer(buffer, txFromBuffer) {
        const results = psbtFromBuffer(buffer, txFromBuffer);
        const psbt = new this(results.globalMap.unsignedTx);
        Object.assign(psbt, results);
        return psbt;
      }
      toBase64() {
        const buffer = this.toBuffer();
        return toBase64(buffer);
      }
      toHex() {
        const buffer = this.toBuffer();
        return toHex(buffer);
      }
      toBuffer() {
        return psbtToBuffer(this);
      }
      updateGlobal(updateData) {
        updateGlobal(updateData, this.globalMap);
        return this;
      }
      updateInput(inputIndex, updateData) {
        const input = checkForInput(this.inputs, inputIndex);
        updateInput(updateData, input);
        return this;
      }
      updateOutput(outputIndex, updateData) {
        const output = checkForOutput(this.outputs, outputIndex);
        updateOutput(updateData, output);
        return this;
      }
      addUnknownKeyValToGlobal(keyVal) {
        checkHasKey(
          keyVal,
          this.globalMap.unknownKeyVals,
          getEnumLength(GlobalTypes)
        );
        if (!this.globalMap.unknownKeyVals) this.globalMap.unknownKeyVals = [];
        this.globalMap.unknownKeyVals.push(keyVal);
        return this;
      }
      addUnknownKeyValToInput(inputIndex, keyVal) {
        const input = checkForInput(this.inputs, inputIndex);
        checkHasKey(keyVal, input.unknownKeyVals, getEnumLength(InputTypes));
        if (!input.unknownKeyVals) input.unknownKeyVals = [];
        input.unknownKeyVals.push(keyVal);
        return this;
      }
      addUnknownKeyValToOutput(outputIndex, keyVal) {
        const output = checkForOutput(this.outputs, outputIndex);
        checkHasKey(keyVal, output.unknownKeyVals, getEnumLength(OutputTypes));
        if (!output.unknownKeyVals) output.unknownKeyVals = [];
        output.unknownKeyVals.push(keyVal);
        return this;
      }
      addInput(inputData) {
        this.globalMap.unsignedTx.addInput(inputData);
        this.inputs.push({
          unknownKeyVals: []
        });
        const addKeyVals = inputData.unknownKeyVals || [];
        const inputIndex = this.inputs.length - 1;
        if (!Array.isArray(addKeyVals)) {
          throw new Error("unknownKeyVals must be an Array");
        }
        addKeyVals.forEach(
          (keyVal) => this.addUnknownKeyValToInput(inputIndex, keyVal)
        );
        addInputAttributes(this.inputs, inputData);
        return this;
      }
      addOutput(outputData) {
        this.globalMap.unsignedTx.addOutput(outputData);
        this.outputs.push({
          unknownKeyVals: []
        });
        const addKeyVals = outputData.unknownKeyVals || [];
        const outputIndex = this.outputs.length - 1;
        if (!Array.isArray(addKeyVals)) {
          throw new Error("unknownKeyVals must be an Array");
        }
        addKeyVals.forEach(
          (keyVal) => this.addUnknownKeyValToOutput(outputIndex, keyVal)
        );
        addOutputAttributes(this.outputs, outputData);
        return this;
      }
      clearFinalizedInput(inputIndex) {
        const input = checkForInput(this.inputs, inputIndex);
        inputCheckUncleanFinalized(inputIndex, input);
        for (const key of Object.keys(input)) {
          if (![
            "witnessUtxo",
            "nonWitnessUtxo",
            "finalScriptSig",
            "finalScriptWitness",
            "unknownKeyVals"
          ].includes(key)) {
            delete input[key];
          }
        }
        return this;
      }
      combine(...those) {
        const result = combine([this].concat(those));
        Object.assign(this, result);
        return this;
      }
      getTransaction() {
        return this.globalMap.unsignedTx.toBuffer();
      }
    };
  }
});

// node_modules/bitcoinjs-lib/src/esm/psbt/psbtutils.js
function isPaymentFactory(payment) {
  return (script) => {
    try {
      payment({ output: script });
      return true;
    } catch (err) {
      return false;
    }
  };
}
function witnessStackToScriptWitness(witness) {
  let buffer = new Uint8Array(0);
  function writeSlice(slice) {
    buffer = concat([buffer, slice]);
  }
  function writeVarInt(i) {
    const currentLen = buffer.length;
    const varintLen = encodingLength2(i);
    buffer = concat([buffer, new Uint8Array(varintLen)]);
    encode5(i, buffer, currentLen);
  }
  function writeVarSlice(slice) {
    writeVarInt(slice.length);
    writeSlice(slice);
  }
  function writeVector(vector2) {
    writeVarInt(vector2.length);
    vector2.forEach(writeVarSlice);
  }
  writeVector(witness);
  return buffer;
}
function pubkeyPositionInScript(pubkey, script) {
  const pubkeyHash = hash160(pubkey);
  const pubkeyXOnly = pubkey.slice(1, 33);
  const decompiled = decompile(script);
  if (decompiled === null) throw new Error("Unknown script error");
  return decompiled.findIndex((element) => {
    if (typeof element === "number") return false;
    return compare(pubkey, element) === 0 || compare(pubkeyHash, element) === 0 || compare(pubkeyXOnly, element) === 0;
  });
}
function pubkeyInScript(pubkey, script) {
  return pubkeyPositionInScript(pubkey, script) !== -1;
}
function checkInputForSig(input, action) {
  const pSigs = extractPartialSigs(input);
  return pSigs.some(
    (pSig) => signatureBlocksAction(pSig, signature.decode, action)
  );
}
function signatureBlocksAction(signature2, signatureDecodeFn, action) {
  const { hashType } = signatureDecodeFn(signature2);
  const whitelist = [];
  const isAnyoneCanPay = hashType & Transaction.SIGHASH_ANYONECANPAY;
  if (isAnyoneCanPay) whitelist.push("addInput");
  const hashMod = hashType & 31;
  switch (hashMod) {
    case Transaction.SIGHASH_ALL:
      break;
    case Transaction.SIGHASH_SINGLE:
    case Transaction.SIGHASH_NONE:
      whitelist.push("addOutput");
      whitelist.push("setInputSequence");
      break;
  }
  if (whitelist.indexOf(action) === -1) {
    return true;
  }
  return false;
}
function extractPartialSigs(input) {
  let pSigs = [];
  if ((input.partialSig || []).length === 0) {
    if (!input.finalScriptSig && !input.finalScriptWitness) return [];
    pSigs = getPsigsFromInputFinalScripts(input);
  } else {
    pSigs = input.partialSig;
  }
  return pSigs.map((p) => p.signature);
}
function getPsigsFromInputFinalScripts(input) {
  const scriptItems = !input.finalScriptSig ? [] : decompile(input.finalScriptSig) || [];
  const witnessItems = !input.finalScriptWitness ? [] : decompile(input.finalScriptWitness) || [];
  return scriptItems.concat(witnessItems).filter((item) => {
    return item instanceof Uint8Array && isCanonicalScriptSignature(item);
  }).map((sig) => ({ signature: sig }));
}
var isP2MS, isP2PK, isP2PKH, isP2WPKH, isP2WSHScript, isP2SHScript, isP2TR;
var init_psbtutils = __esm({
  "node_modules/bitcoinjs-lib/src/esm/psbt/psbtutils.js"() {
    init_esm4();
    init_script();
    init_transaction();
    init_crypto();
    init_payments();
    init_browser();
    isP2MS = isPaymentFactory(p2ms);
    isP2PK = isPaymentFactory(p2pk);
    isP2PKH = isPaymentFactory(p2pkh);
    isP2WPKH = isPaymentFactory(p2wpkh);
    isP2WSHScript = isPaymentFactory(p2wsh);
    isP2SHScript = isPaymentFactory(p2sh);
    isP2TR = isPaymentFactory(p2tr);
  }
});

// node_modules/bitcoinjs-lib/src/esm/psbt/bip371.js
function tapScriptFinalizer(inputIndex, input, tapLeafHashToFinalize) {
  const tapLeaf = findTapLeafToFinalize(
    input,
    inputIndex,
    tapLeafHashToFinalize
  );
  try {
    const sigs = sortSignatures(input, tapLeaf);
    const witness = sigs.concat(tapLeaf.script).concat(tapLeaf.controlBlock);
    return { finalScriptWitness: witnessStackToScriptWitness(witness) };
  } catch (err) {
    throw new Error(`Can not finalize taproot input #${inputIndex}: ${err}`);
  }
}
function serializeTaprootSignature(sig, sighashType) {
  const sighashTypeByte = sighashType ? Uint8Array.from([sighashType]) : Uint8Array.from([]);
  return concat([sig, sighashTypeByte]);
}
function isTaprootInput(input) {
  return input && !!(input.tapInternalKey || input.tapMerkleRoot || input.tapLeafScript && input.tapLeafScript.length || input.tapBip32Derivation && input.tapBip32Derivation.length || input.witnessUtxo && isP2TR(input.witnessUtxo.script));
}
function isTaprootOutput(output, script) {
  return output && !!(output.tapInternalKey || output.tapTree || output.tapBip32Derivation && output.tapBip32Derivation.length || script && isP2TR(script));
}
function checkTaprootInputFields(inputData, newInputData, action) {
  checkMixedTaprootAndNonTaprootInputFields(inputData, newInputData, action);
  checkIfTapLeafInTree(inputData, newInputData, action);
}
function checkTaprootOutputFields(outputData, newOutputData, action) {
  checkMixedTaprootAndNonTaprootOutputFields(outputData, newOutputData, action);
  checkTaprootScriptPubkey(outputData, newOutputData);
}
function checkTaprootScriptPubkey(outputData, newOutputData) {
  if (!newOutputData.tapTree && !newOutputData.tapInternalKey) return;
  const tapInternalKey = newOutputData.tapInternalKey || outputData.tapInternalKey;
  const tapTree = newOutputData.tapTree || outputData.tapTree;
  if (tapInternalKey) {
    const { script: scriptPubkey } = outputData;
    const script = getTaprootScripPubkey(tapInternalKey, tapTree);
    if (scriptPubkey && compare(script, scriptPubkey) !== 0)
      throw new Error("Error adding output. Script or address mismatch.");
  }
}
function getTaprootScripPubkey(tapInternalKey, tapTree) {
  const scriptTree = tapTree && tapTreeFromList(tapTree.leaves);
  const { output } = p2tr({
    internalPubkey: tapInternalKey,
    scriptTree
  });
  return output;
}
function tapTreeFromList(leaves = []) {
  if (leaves.length === 1 && leaves[0].depth === 0)
    return {
      output: leaves[0].script,
      version: leaves[0].leafVersion
    };
  return instertLeavesInTree(leaves);
}
function checkTaprootInputForSigs(input, action) {
  const sigs = extractTaprootSigs(input);
  return sigs.some(
    (sig) => signatureBlocksAction(sig, decodeSchnorrSignature, action)
  );
}
function decodeSchnorrSignature(signature2) {
  return {
    signature: signature2.slice(0, 64),
    hashType: signature2.slice(64)[0] || Transaction.SIGHASH_DEFAULT
  };
}
function extractTaprootSigs(input) {
  const sigs = [];
  if (input.tapKeySig) sigs.push(input.tapKeySig);
  if (input.tapScriptSig)
    sigs.push(...input.tapScriptSig.map((s) => s.signature));
  if (!sigs.length) {
    const finalTapKeySig = getTapKeySigFromWitness(input.finalScriptWitness);
    if (finalTapKeySig) sigs.push(finalTapKeySig);
  }
  return sigs;
}
function getTapKeySigFromWitness(finalScriptWitness) {
  if (!finalScriptWitness) return;
  const witness = finalScriptWitness.slice(2);
  if (witness.length === 64 || witness.length === 65) return witness;
}
function instertLeavesInTree(leaves) {
  let tree;
  for (const leaf of leaves) {
    tree = instertLeafInTree(leaf, tree);
    if (!tree) throw new Error(`No room left to insert tapleaf in tree`);
  }
  return tree;
}
function instertLeafInTree(leaf, tree, depth = 0) {
  if (depth > MAX_TAPTREE_DEPTH) throw new Error("Max taptree depth exceeded.");
  if (leaf.depth === depth) {
    if (!tree)
      return {
        output: leaf.script,
        version: leaf.leafVersion
      };
    return;
  }
  if (isTapleaf(tree)) return;
  const leftSide = instertLeafInTree(leaf, tree && tree[0], depth + 1);
  if (leftSide) return [leftSide, tree && tree[1]];
  const rightSide = instertLeafInTree(leaf, tree && tree[1], depth + 1);
  if (rightSide) return [tree && tree[0], rightSide];
}
function checkMixedTaprootAndNonTaprootInputFields(inputData, newInputData, action) {
  const isBadTaprootUpdate = isTaprootInput(inputData) && hasNonTaprootFields(newInputData);
  const isBadNonTaprootUpdate = hasNonTaprootFields(inputData) && isTaprootInput(newInputData);
  const hasMixedFields = inputData === newInputData && isTaprootInput(newInputData) && hasNonTaprootFields(newInputData);
  if (isBadTaprootUpdate || isBadNonTaprootUpdate || hasMixedFields)
    throw new Error(
      `Invalid arguments for Psbt.${action}. Cannot use both taproot and non-taproot fields.`
    );
}
function checkMixedTaprootAndNonTaprootOutputFields(inputData, newInputData, action) {
  const isBadTaprootUpdate = isTaprootOutput(inputData) && hasNonTaprootFields(newInputData);
  const isBadNonTaprootUpdate = hasNonTaprootFields(inputData) && isTaprootOutput(newInputData);
  const hasMixedFields = inputData === newInputData && isTaprootOutput(newInputData) && hasNonTaprootFields(newInputData);
  if (isBadTaprootUpdate || isBadNonTaprootUpdate || hasMixedFields)
    throw new Error(
      `Invalid arguments for Psbt.${action}. Cannot use both taproot and non-taproot fields.`
    );
}
function checkIfTapLeafInTree(inputData, newInputData, action) {
  if (newInputData.tapMerkleRoot) {
    const newLeafsInTree = (newInputData.tapLeafScript || []).every(
      (l) => isTapLeafInTree(l, newInputData.tapMerkleRoot)
    );
    const oldLeafsInTree = (inputData.tapLeafScript || []).every(
      (l) => isTapLeafInTree(l, newInputData.tapMerkleRoot)
    );
    if (!newLeafsInTree || !oldLeafsInTree)
      throw new Error(
        `Invalid arguments for Psbt.${action}. Tapleaf not part of taptree.`
      );
  } else if (inputData.tapMerkleRoot) {
    const newLeafsInTree = (newInputData.tapLeafScript || []).every(
      (l) => isTapLeafInTree(l, inputData.tapMerkleRoot)
    );
    if (!newLeafsInTree)
      throw new Error(
        `Invalid arguments for Psbt.${action}. Tapleaf not part of taptree.`
      );
  }
}
function isTapLeafInTree(tapLeaf, merkleRoot) {
  if (!merkleRoot) return true;
  const leafHash = tapleafHash({
    output: tapLeaf.script,
    version: tapLeaf.leafVersion
  });
  const rootHash = rootHashFromPath(tapLeaf.controlBlock, leafHash);
  return compare(rootHash, merkleRoot) === 0;
}
function sortSignatures(input, tapLeaf) {
  const leafHash = tapleafHash({
    output: tapLeaf.script,
    version: tapLeaf.leafVersion
  });
  return (input.tapScriptSig || []).filter((tss) => compare(tss.leafHash, leafHash) === 0).map((tss) => addPubkeyPositionInScript(tapLeaf.script, tss)).sort((t1, t2) => t2.positionInScript - t1.positionInScript).map((t) => t.signature);
}
function addPubkeyPositionInScript(script, tss) {
  return Object.assign(
    {
      positionInScript: pubkeyPositionInScript(tss.pubkey, script)
    },
    tss
  );
}
function findTapLeafToFinalize(input, inputIndex, leafHashToFinalize) {
  if (!input.tapScriptSig || !input.tapScriptSig.length)
    throw new Error(
      `Can not finalize taproot input #${inputIndex}. No tapleaf script signature provided.`
    );
  const tapLeaf = (input.tapLeafScript || []).sort((a, b) => a.controlBlock.length - b.controlBlock.length).find(
    (leaf) => canFinalizeLeaf(leaf, input.tapScriptSig, leafHashToFinalize)
  );
  if (!tapLeaf)
    throw new Error(
      `Can not finalize taproot input #${inputIndex}. Signature for tapleaf script not found.`
    );
  return tapLeaf;
}
function canFinalizeLeaf(leaf, tapScriptSig, hash) {
  const leafHash = tapleafHash({
    output: leaf.script,
    version: leaf.leafVersion
  });
  const whiteListedHash = !hash || compare(leafHash, hash) === 0;
  return whiteListedHash && tapScriptSig.find((tss) => compare(tss.leafHash, leafHash) === 0) !== void 0;
}
function hasNonTaprootFields(io) {
  return io && !!(io.redeemScript || io.witnessScript || io.bip32Derivation && io.bip32Derivation.length);
}
var toXOnly;
var init_bip371 = __esm({
  "node_modules/bitcoinjs-lib/src/esm/psbt/bip371.js"() {
    init_types();
    init_transaction();
    init_psbtutils();
    init_bip341();
    init_payments();
    init_browser();
    init_psbtutils();
    toXOnly = (pubKey) => pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
  }
});

// node_modules/bitcoinjs-lib/src/esm/psbt.js
function canFinalize(input, script, scriptType) {
  switch (scriptType) {
    case "pubkey":
    case "pubkeyhash":
    case "witnesspubkeyhash":
      return hasSigs(1, input.partialSig);
    case "multisig":
      const p2ms2 = p2ms({ output: script });
      return hasSigs(p2ms2.m, input.partialSig, p2ms2.pubkeys);
    default:
      return false;
  }
}
function checkCache(cache) {
  if (cache.__UNSAFE_SIGN_NONSEGWIT !== false) {
    throw new Error("Not BIP174 compliant, can not export");
  }
}
function hasSigs(neededSigs, partialSig, pubkeys) {
  if (!partialSig) return false;
  let sigs;
  if (pubkeys) {
    sigs = pubkeys.map((pkey) => {
      const pubkey = compressPubkey(pkey);
      return partialSig.find(
        (pSig) => compare(pSig.pubkey, pubkey) === 0
      );
    }).filter((v) => !!v);
  } else {
    sigs = partialSig;
  }
  if (sigs.length > neededSigs) throw new Error("Too many signatures");
  return sigs.length === neededSigs;
}
function isFinalized(input) {
  return !!input.finalScriptSig || !!input.finalScriptWitness;
}
function bip32DerivationIsMine(root) {
  return (d) => {
    if (compare(root.fingerprint, d.masterFingerprint)) return false;
    if (compare(root.derivePath(d.path).publicKey, d.pubkey))
      return false;
    return true;
  };
}
function check32Bit(num) {
  if (typeof num !== "number" || num !== Math.floor(num) || num > 4294967295 || num < 0) {
    throw new Error("Invalid 32 bit integer");
  }
}
function checkFees(psbt, cache, opts) {
  const feeRate = cache.__FEE_RATE || psbt.getFeeRate();
  const vsize = cache.__EXTRACTED_TX.virtualSize();
  const satoshis = feeRate * vsize;
  if (feeRate >= opts.maximumFeeRate) {
    throw new Error(
      `Warning: You are paying around ${(satoshis / 1e8).toFixed(8)} in fees, which is ${feeRate} satoshi per byte for a transaction with a VSize of ${vsize} bytes (segwit counted as 0.25 byte per byte). Use setMaximumFeeRate method to raise your threshold, or pass true to the first arg of extractTransaction.`
    );
  }
}
function checkInputsForPartialSig(inputs2, action) {
  inputs2.forEach((input) => {
    const throws = isTaprootInput(input) ? checkTaprootInputForSigs(input, action) : checkInputForSig(input, action);
    if (throws)
      throw new Error("Can not modify transaction, signatures exist.");
  });
}
function checkPartialSigSighashes(input) {
  if (!input.sighashType || !input.partialSig) return;
  const { partialSig, sighashType } = input;
  partialSig.forEach((pSig) => {
    const { hashType } = signature.decode(pSig.signature);
    if (sighashType !== hashType) {
      throw new Error("Signature sighash does not match input sighash type");
    }
  });
}
function checkScriptForPubkey(pubkey, script, action) {
  if (!pubkeyInScript(pubkey, script)) {
    throw new Error(
      `Can not ${action} for this input with the key ${toHex(pubkey)}`
    );
  }
}
function checkTxEmpty(tx) {
  const isEmpty = tx.ins.every(
    (input) => input.script && input.script.length === 0 && input.witness && input.witness.length === 0
  );
  if (!isEmpty) {
    throw new Error("Format Error: Transaction ScriptSigs are not empty");
  }
}
function checkTxForDupeIns(tx, cache) {
  tx.ins.forEach((input) => {
    checkTxInputCache(cache, input);
  });
}
function checkTxInputCache(cache, input) {
  const key = toHex(reverseBuffer(Uint8Array.from(input.hash))) + ":" + input.index;
  if (cache.__TX_IN_CACHE[key]) throw new Error("Duplicate input detected.");
  cache.__TX_IN_CACHE[key] = 1;
}
function scriptCheckerFactory(payment, paymentScriptName) {
  return (inputIndex, scriptPubKey, redeemScript, ioType) => {
    const redeemScriptOutput = payment({
      redeem: { output: redeemScript }
    }).output;
    if (compare(scriptPubKey, redeemScriptOutput)) {
      throw new Error(
        `${paymentScriptName} for ${ioType} #${inputIndex} doesn't match the scriptPubKey in the prevout`
      );
    }
  };
}
function getTxCacheValue(key, name, inputs2, c) {
  if (!inputs2.every(isFinalized))
    throw new Error(`PSBT must be finalized to calculate ${name}`);
  if (key === "__FEE_RATE" && c.__FEE_RATE) return c.__FEE_RATE;
  if (key === "__FEE" && c.__FEE) return c.__FEE;
  let tx;
  let mustFinalize = true;
  if (c.__EXTRACTED_TX) {
    tx = c.__EXTRACTED_TX;
    mustFinalize = false;
  } else {
    tx = c.__TX.clone();
  }
  inputFinalizeGetAmts(inputs2, tx, c, mustFinalize);
  if (key === "__FEE_RATE") return c.__FEE_RATE;
  else if (key === "__FEE") return c.__FEE;
}
function getFinalScripts(inputIndex, input, script, isSegwit, isP2SH, isP2WSH) {
  const scriptType = classifyScript(script);
  if (!canFinalize(input, script, scriptType))
    throw new Error(`Can not finalize input #${inputIndex}`);
  return prepareFinalScripts(
    script,
    scriptType,
    input.partialSig,
    isSegwit,
    isP2SH,
    isP2WSH
  );
}
function prepareFinalScripts(script, scriptType, partialSig, isSegwit, isP2SH, isP2WSH) {
  let finalScriptSig;
  let finalScriptWitness;
  const payment = getPayment(script, scriptType, partialSig);
  const p2wsh2 = !isP2WSH ? null : p2wsh({ redeem: payment });
  const p2sh2 = !isP2SH ? null : p2sh({ redeem: p2wsh2 || payment });
  if (isSegwit) {
    if (p2wsh2) {
      finalScriptWitness = witnessStackToScriptWitness(p2wsh2.witness);
    } else {
      finalScriptWitness = witnessStackToScriptWitness(payment.witness);
    }
    if (p2sh2) {
      finalScriptSig = p2sh2.input;
    }
  } else {
    if (p2sh2) {
      finalScriptSig = p2sh2.input;
    } else {
      finalScriptSig = payment.input;
    }
  }
  return {
    finalScriptSig,
    finalScriptWitness
  };
}
function getHashAndSighashType(inputs2, inputIndex, pubkey, cache, sighashTypes) {
  const input = checkForInput(inputs2, inputIndex);
  const { hash, sighashType, script } = getHashForSig(
    inputIndex,
    input,
    cache,
    false,
    sighashTypes
  );
  checkScriptForPubkey(pubkey, script, "sign");
  return {
    hash,
    sighashType
  };
}
function getHashForSig(inputIndex, input, cache, forValidate, sighashTypes) {
  const unsignedTx = cache.__TX;
  const sighashType = input.sighashType || Transaction.SIGHASH_ALL;
  checkSighashTypeAllowed(sighashType, sighashTypes);
  let hash;
  const prevout = getUtxoForInput(inputIndex, input, cache);
  if (!prevout) throw new Error("Need a Utxo input item for signing");
  const { meaningfulScript, type } = getMeaningfulScript(
    prevout.script,
    inputIndex,
    "input",
    input.redeemScript,
    input.witnessScript
  );
  if (["p2sh-p2wsh", "p2wsh"].indexOf(type) >= 0) {
    hash = unsignedTx.hashForWitnessV0(
      inputIndex,
      meaningfulScript,
      prevout.value,
      sighashType
    );
  } else if (isP2WPKH(meaningfulScript)) {
    const signingScript = p2pkh({
      hash: meaningfulScript.slice(2)
    }).output;
    hash = unsignedTx.hashForWitnessV0(
      inputIndex,
      signingScript,
      prevout.value,
      sighashType
    );
  } else {
    if (input.nonWitnessUtxo === void 0 && cache.__UNSAFE_SIGN_NONSEGWIT === false)
      throw new Error(
        `Input #${inputIndex} has witnessUtxo but non-segwit script: ${toHex(meaningfulScript)}`
      );
    if (!forValidate && cache.__UNSAFE_SIGN_NONSEGWIT !== false)
      console.warn(
        "Warning: Signing non-segwit inputs without the full parent transaction means there is a chance that a miner could feed you incorrect information to trick you into paying large fees. This behavior is the same as Psbt's predecessor (TransactionBuilder - now removed) when signing non-segwit scripts. You are not able to export this Psbt with toBuffer|toBase64|toHex since it is not BIP174 compliant.\n*********************\nPROCEED WITH CAUTION!\n*********************"
      );
    hash = unsignedTx.hashForSignature(
      inputIndex,
      meaningfulScript,
      sighashType
    );
  }
  return {
    script: meaningfulScript,
    sighashType,
    hash
  };
}
function getAllTaprootHashesForSigValidation(inputIndex, input, inputs2, cache) {
  const allPublicKeys = [];
  if (input.tapInternalKey) {
    const key = getPrevoutTaprootKey(inputIndex, input, cache);
    if (key) {
      allPublicKeys.push(key);
    }
  }
  if (input.tapScriptSig) {
    const tapScriptPubkeys = input.tapScriptSig.map((tss) => tss.pubkey);
    allPublicKeys.push(...tapScriptPubkeys);
  }
  const allHashes = allPublicKeys.map(
    (publicKey) => getTaprootHashesForSigValidation(
      inputIndex,
      input,
      inputs2,
      publicKey,
      cache
    )
  );
  return allHashes.flat();
}
function getPrevoutTaprootKey(inputIndex, input, cache) {
  const { script } = getScriptAndAmountFromUtxo(inputIndex, input, cache);
  return isP2TR(script) ? script.subarray(2, 34) : null;
}
function trimTaprootSig(signature2) {
  return signature2.length === 64 ? signature2 : signature2.subarray(0, 64);
}
function getTaprootHashesForSigning(inputIndex, input, inputs2, pubkey, cache, tapLeafHashToSign, allowedSighashTypes) {
  const sighashType = input.sighashType || Transaction.SIGHASH_DEFAULT;
  checkSighashTypeAllowed(sighashType, allowedSighashTypes);
  const keySpend = Boolean(input.tapInternalKey && !tapLeafHashToSign);
  return getTaprootHashesForSig(
    inputIndex,
    input,
    inputs2,
    pubkey,
    cache,
    keySpend,
    sighashType,
    tapLeafHashToSign
  );
}
function getTaprootHashesForSigValidation(inputIndex, input, inputs2, pubkey, cache) {
  const sighashType = input.sighashType || Transaction.SIGHASH_DEFAULT;
  const keySpend = Boolean(input.tapKeySig);
  return getTaprootHashesForSig(
    inputIndex,
    input,
    inputs2,
    pubkey,
    cache,
    keySpend,
    sighashType
  );
}
function getTaprootHashesForSig(inputIndex, input, inputs2, pubkey, cache, keySpend, sighashType, tapLeafHashToSign) {
  const unsignedTx = cache.__TX;
  const prevOuts = inputs2.map(
    (i, index) => getScriptAndAmountFromUtxo(index, i, cache)
  );
  const signingScripts = prevOuts.map((o) => o.script);
  const values = prevOuts.map((o) => o.value);
  const hashes = [];
  if (keySpend) {
    const outputKey = getPrevoutTaprootKey(inputIndex, input, cache) || Uint8Array.from([]);
    if (compare(toXOnly(pubkey), outputKey) === 0) {
      const tapKeyHash = unsignedTx.hashForWitnessV1(
        inputIndex,
        signingScripts,
        values,
        sighashType
      );
      hashes.push({ pubkey, hash: tapKeyHash });
    }
  }
  const tapLeafHashes = (input.tapLeafScript || []).filter((tapLeaf) => pubkeyInScript(pubkey, tapLeaf.script)).map((tapLeaf) => {
    const hash = tapleafHash({
      output: tapLeaf.script,
      version: tapLeaf.leafVersion
    });
    return Object.assign({ hash }, tapLeaf);
  }).filter(
    (tapLeaf) => !tapLeafHashToSign || compare(tapLeafHashToSign, tapLeaf.hash) === 0
  ).map((tapLeaf) => {
    const tapScriptHash = unsignedTx.hashForWitnessV1(
      inputIndex,
      signingScripts,
      values,
      sighashType,
      tapLeaf.hash
    );
    return {
      pubkey,
      hash: tapScriptHash,
      leafHash: tapLeaf.hash
    };
  });
  return hashes.concat(tapLeafHashes);
}
function checkSighashTypeAllowed(sighashType, sighashTypes) {
  if (sighashTypes && sighashTypes.indexOf(sighashType) < 0) {
    const str = sighashTypeToString(sighashType);
    throw new Error(
      `Sighash type is not allowed. Retry the sign method passing the sighashTypes array of whitelisted types. Sighash type: ${str}`
    );
  }
}
function getPayment(script, scriptType, partialSig) {
  let payment;
  switch (scriptType) {
    case "multisig":
      const sigs = getSortedSigs(script, partialSig);
      payment = p2ms({
        output: script,
        signatures: sigs
      });
      break;
    case "pubkey":
      payment = p2pk({
        output: script,
        signature: partialSig[0].signature
      });
      break;
    case "pubkeyhash":
      payment = p2pkh({
        output: script,
        pubkey: partialSig[0].pubkey,
        signature: partialSig[0].signature
      });
      break;
    case "witnesspubkeyhash":
      payment = p2wpkh({
        output: script,
        pubkey: partialSig[0].pubkey,
        signature: partialSig[0].signature
      });
      break;
  }
  return payment;
}
function getScriptFromInput(inputIndex, input, cache) {
  const res = {
    script: null,
    isSegwit: false,
    isP2SH: false,
    isP2WSH: false
  };
  res.isP2SH = !!input.redeemScript;
  res.isP2WSH = !!input.witnessScript;
  if (input.witnessScript) {
    res.script = input.witnessScript;
  } else if (input.redeemScript) {
    res.script = input.redeemScript;
  } else {
    const prevout = getUtxoForInput(inputIndex, input, cache);
    if (prevout) res.script = prevout.script;
  }
  if (input.witnessScript || isP2WPKH(res.script)) {
    res.isSegwit = true;
  }
  return res;
}
function getSignersFromHD(inputIndex, inputs2, hdKeyPair) {
  const input = checkForInput(inputs2, inputIndex);
  if (!input.bip32Derivation || input.bip32Derivation.length === 0) {
    throw new Error("Need bip32Derivation to sign with HD");
  }
  const myDerivations = input.bip32Derivation.map((bipDv) => {
    if (compare(bipDv.masterFingerprint, hdKeyPair.fingerprint) === 0) {
      return bipDv;
    } else {
      return;
    }
  }).filter((v) => !!v);
  if (myDerivations.length === 0) {
    throw new Error(
      "Need one bip32Derivation masterFingerprint to match the HDSigner fingerprint"
    );
  }
  const signers = myDerivations.map((bipDv) => {
    const node = hdKeyPair.derivePath(bipDv.path);
    if (compare(bipDv.pubkey, node.publicKey) !== 0) {
      throw new Error("pubkey did not match bip32Derivation");
    }
    return node;
  });
  return signers;
}
function getSortedSigs(script, partialSig) {
  const p2ms2 = p2ms({ output: script });
  return p2ms2.pubkeys.map((pk) => {
    return (partialSig.filter((ps) => {
      return compare(ps.pubkey, pk) === 0;
    })[0] || {}).signature;
  }).filter((v) => !!v);
}
function scriptWitnessToWitnessStack(buffer) {
  let offset = 0;
  function readSlice(n) {
    offset += n;
    return buffer.slice(offset - n, offset);
  }
  function readVarInt() {
    const vi = decode5(buffer, offset);
    offset += encodingLength2(vi.bigintValue);
    return vi.numberValue;
  }
  function readVarSlice() {
    return readSlice(readVarInt());
  }
  function readVector() {
    const count = readVarInt();
    const vector2 = [];
    for (let i = 0; i < count; i++) vector2.push(readVarSlice());
    return vector2;
  }
  return readVector();
}
function sighashTypeToString(sighashType) {
  let text = sighashType & Transaction.SIGHASH_ANYONECANPAY ? "SIGHASH_ANYONECANPAY | " : "";
  const sigMod = sighashType & 31;
  switch (sigMod) {
    case Transaction.SIGHASH_ALL:
      text += "SIGHASH_ALL";
      break;
    case Transaction.SIGHASH_SINGLE:
      text += "SIGHASH_SINGLE";
      break;
    case Transaction.SIGHASH_NONE:
      text += "SIGHASH_NONE";
      break;
  }
  return text;
}
function addNonWitnessTxCache(cache, input, inputIndex) {
  cache.__NON_WITNESS_UTXO_BUF_CACHE[inputIndex] = input.nonWitnessUtxo;
  const tx = Transaction.fromBuffer(input.nonWitnessUtxo);
  cache.__NON_WITNESS_UTXO_TX_CACHE[inputIndex] = tx;
  const self = cache;
  const selfIndex = inputIndex;
  delete input.nonWitnessUtxo;
  Object.defineProperty(input, "nonWitnessUtxo", {
    enumerable: true,
    get() {
      const buf = self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex];
      const txCache = self.__NON_WITNESS_UTXO_TX_CACHE[selfIndex];
      if (buf !== void 0) {
        return buf;
      } else {
        const newBuf = txCache.toBuffer();
        self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex] = newBuf;
        return newBuf;
      }
    },
    set(data) {
      self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex] = data;
    }
  });
}
function inputFinalizeGetAmts(inputs2, tx, cache, mustFinalize) {
  let inputAmount = 0n;
  inputs2.forEach((input, idx) => {
    if (mustFinalize && input.finalScriptSig)
      tx.ins[idx].script = input.finalScriptSig;
    if (mustFinalize && input.finalScriptWitness) {
      tx.ins[idx].witness = scriptWitnessToWitnessStack(
        input.finalScriptWitness
      );
    }
    const prevout = getUtxoForInput(idx, input, cache);
    if (!prevout) throw new Error(`Need a Utxo input item for input #${idx}`);
    inputAmount += prevout.value;
  });
  const outputAmount = tx.outs.reduce((total, o) => total + o.value, 0n);
  const fee = inputAmount - outputAmount;
  if (fee < 0) {
    throw new Error("Outputs are spending more than Inputs");
  }
  const bytes = tx.virtualSize();
  cache.__FEE = fee;
  cache.__EXTRACTED_TX = tx;
  cache.__FEE_RATE = Math.floor(Number(fee / BigInt(bytes)));
}
function nonWitnessUtxoTxFromCache(cache, input, inputIndex) {
  const c = cache.__NON_WITNESS_UTXO_TX_CACHE;
  if (!c[inputIndex]) {
    addNonWitnessTxCache(cache, input, inputIndex);
  }
  return c[inputIndex];
}
function getUtxoForInput(inputIndex, input, cache) {
  if (input.nonWitnessUtxo) {
    const nonWitnessUtxoTx = nonWitnessUtxoTxFromCache(
      cache,
      input,
      inputIndex
    );
    const txInput = cache.__TX.ins[inputIndex];
    if (compare(txInput.hash, nonWitnessUtxoTx.getHash()) !== 0) {
      throw new Error(
        `Non-witness UTXO hash for input #${inputIndex} doesn't match the hash specified in the prevout`
      );
    }
    const prevout = nonWitnessUtxoTx.outs[txInput.index];
    if (!prevout) {
      throw new Error(
        `Non-witness UTXO for input #${inputIndex} has no output #${txInput.index}`
      );
    }
    if (input.witnessUtxo && (input.witnessUtxo.value !== prevout.value || compare(input.witnessUtxo.script, prevout.script) !== 0)) {
      throw new Error(
        `Witness UTXO for input #${inputIndex} doesn't match the non-witness UTXO`
      );
    }
    return prevout;
  }
  return input.witnessUtxo;
}
function getScriptFromUtxo(inputIndex, input, cache) {
  const { script } = getScriptAndAmountFromUtxo(inputIndex, input, cache);
  return script;
}
function getScriptAndAmountFromUtxo(inputIndex, input, cache) {
  const prevout = getUtxoForInput(inputIndex, input, cache);
  if (!prevout) throw new Error("Can't find pubkey in input without Utxo data");
  return prevout;
}
function pubkeyInInput(pubkey, input, inputIndex, cache) {
  const script = getScriptFromUtxo(inputIndex, input, cache);
  const { meaningfulScript } = getMeaningfulScript(
    script,
    inputIndex,
    "input",
    input.redeemScript,
    input.witnessScript
  );
  return pubkeyInScript(pubkey, meaningfulScript);
}
function pubkeyInOutput(pubkey, output, outputIndex, cache) {
  const script = cache.__TX.outs[outputIndex].script;
  const { meaningfulScript } = getMeaningfulScript(
    script,
    outputIndex,
    "output",
    output.redeemScript,
    output.witnessScript
  );
  return pubkeyInScript(pubkey, meaningfulScript);
}
function redeemFromFinalScriptSig(finalScript) {
  if (!finalScript) return;
  const decomp = decompile(finalScript);
  if (!decomp) return;
  const lastItem = decomp[decomp.length - 1];
  if (!(lastItem instanceof Uint8Array) || isPubkeyLike(lastItem) || isSigLike(lastItem))
    return;
  const sDecomp = decompile(lastItem);
  if (!sDecomp) return;
  return lastItem;
}
function redeemFromFinalWitnessScript(finalScript) {
  if (!finalScript) return;
  const decomp = scriptWitnessToWitnessStack(finalScript);
  const lastItem = decomp[decomp.length - 1];
  if (isPubkeyLike(lastItem)) return;
  const sDecomp = decompile(lastItem);
  if (!sDecomp) return;
  return lastItem;
}
function compressPubkey(pubkey) {
  if (pubkey.length === 65) {
    const parity = pubkey[64] & 1;
    const newKey = pubkey.slice(0, 33);
    newKey[0] = 2 | parity;
    return newKey;
  }
  return pubkey.slice();
}
function isPubkeyLike(buf) {
  return buf.length === 33 && isCanonicalPubKey(buf);
}
function isSigLike(buf) {
  return isCanonicalScriptSignature(buf);
}
function getMeaningfulScript(script, index, ioType, redeemScript, witnessScript) {
  const isP2SH = isP2SHScript(script);
  const isP2SHP2WSH = isP2SH && redeemScript && isP2WSHScript(redeemScript);
  const isP2WSH = isP2WSHScript(script);
  if (isP2SH && redeemScript === void 0)
    throw new Error("scriptPubkey is P2SH but redeemScript missing");
  if ((isP2WSH || isP2SHP2WSH) && witnessScript === void 0)
    throw new Error(
      "scriptPubkey or redeemScript is P2WSH but witnessScript missing"
    );
  let meaningfulScript;
  if (isP2SHP2WSH) {
    meaningfulScript = witnessScript;
    checkRedeemScript(index, script, redeemScript, ioType);
    checkWitnessScript(index, redeemScript, witnessScript, ioType);
    checkInvalidP2WSH(meaningfulScript);
  } else if (isP2WSH) {
    meaningfulScript = witnessScript;
    checkWitnessScript(index, script, witnessScript, ioType);
    checkInvalidP2WSH(meaningfulScript);
  } else if (isP2SH) {
    meaningfulScript = redeemScript;
    checkRedeemScript(index, script, redeemScript, ioType);
  } else {
    meaningfulScript = script;
  }
  return {
    meaningfulScript,
    type: isP2SHP2WSH ? "p2sh-p2wsh" : isP2SH ? "p2sh" : isP2WSH ? "p2wsh" : "raw"
  };
}
function checkInvalidP2WSH(script) {
  if (isP2WPKH(script) || isP2SHScript(script)) {
    throw new Error("P2WPKH or P2SH can not be contained within P2WSH");
  }
}
function classifyScript(script) {
  if (isP2WPKH(script)) return "witnesspubkeyhash";
  if (isP2PKH(script)) return "pubkeyhash";
  if (isP2MS(script)) return "multisig";
  if (isP2PK(script)) return "pubkey";
  return "nonstandard";
}
function range4(n) {
  return [...Array(n).keys()];
}
var DEFAULT_OPTS, Psbt2, transactionFromBuffer, PsbtTransaction, checkRedeemScript, checkWitnessScript;
var init_psbt2 = __esm({
  "node_modules/bitcoinjs-lib/src/esm/psbt.js"() {
    init_psbt();
    init_esm4();
    init_psbt();
    init_address();
    init_bufferutils();
    init_networks();
    init_payments();
    init_bip341();
    init_script();
    init_transaction();
    init_bip371();
    init_psbtutils();
    init_browser();
    DEFAULT_OPTS = {
      /**
       * A bitcoinjs Network object. This is only used if you pass an `address`
       * parameter to addOutput. Otherwise it is not needed and can be left default.
       */
      network: bitcoin,
      /**
       * When extractTransaction is called, the fee rate is checked.
       * THIS IS NOT TO BE RELIED ON.
       * It is only here as a last ditch effort to prevent sending a 500 BTC fee etc.
       */
      maximumFeeRate: 5e3
      // satoshi per byte
    };
    Psbt2 = class _Psbt {
      data;
      static fromBase64(data, opts = {}) {
        const buffer = fromBase64(data);
        return this.fromBuffer(buffer, opts);
      }
      static fromHex(data, opts = {}) {
        const buffer = fromHex(data);
        return this.fromBuffer(buffer, opts);
      }
      static fromBuffer(buffer, opts = {}) {
        const psbtBase = Psbt.fromBuffer(buffer, transactionFromBuffer);
        const psbt = new _Psbt(opts, psbtBase);
        checkTxForDupeIns(psbt.__CACHE.__TX, psbt.__CACHE);
        return psbt;
      }
      __CACHE;
      opts;
      constructor(opts = {}, data = new Psbt(new PsbtTransaction())) {
        this.data = data;
        this.opts = Object.assign({}, DEFAULT_OPTS, opts);
        this.__CACHE = {
          __NON_WITNESS_UTXO_TX_CACHE: [],
          __NON_WITNESS_UTXO_BUF_CACHE: [],
          __TX_IN_CACHE: {},
          __TX: this.data.globalMap.unsignedTx.tx,
          // Psbt's predecessor (TransactionBuilder - now removed) behavior
          // was to not confirm input values  before signing.
          // Even though we highly encourage people to get
          // the full parent transaction to verify values, the ability to
          // sign non-segwit inputs without the full transaction was often
          // requested. So the only way to activate is to use @ts-ignore.
          // We will disable exporting the Psbt when unsafe sign is active.
          // because it is not BIP174 compliant.
          __UNSAFE_SIGN_NONSEGWIT: false
        };
        if (this.data.inputs.length === 0) this.setVersion(2);
        const dpew = (obj, attr, enumerable, writable) => Object.defineProperty(obj, attr, {
          enumerable,
          writable
        });
        dpew(this, "__CACHE", false, true);
        dpew(this, "opts", false, true);
      }
      get inputCount() {
        return this.data.inputs.length;
      }
      get version() {
        return this.__CACHE.__TX.version;
      }
      set version(version) {
        this.setVersion(version);
      }
      get locktime() {
        return this.__CACHE.__TX.locktime;
      }
      set locktime(locktime) {
        this.setLocktime(locktime);
      }
      get txInputs() {
        return this.__CACHE.__TX.ins.map((input) => ({
          hash: cloneBuffer(input.hash),
          index: input.index,
          sequence: input.sequence
        }));
      }
      get txOutputs() {
        return this.__CACHE.__TX.outs.map((output) => {
          let address;
          try {
            address = fromOutputScript(output.script, this.opts.network);
          } catch (_) {
          }
          return {
            script: cloneBuffer(output.script),
            value: output.value,
            address
          };
        });
      }
      combine(...those) {
        this.data.combine(...those.map((o) => o.data));
        const c = this.__CACHE;
        c.__FEE = void 0;
        c.__FEE_RATE = void 0;
        c.__EXTRACTED_TX = void 0;
        return this;
      }
      clone() {
        const res = _Psbt.fromBuffer(this.data.toBuffer());
        res.opts = JSON.parse(JSON.stringify(this.opts));
        return res;
      }
      setMaximumFeeRate(satoshiPerByte) {
        check32Bit(satoshiPerByte);
        this.opts.maximumFeeRate = satoshiPerByte;
      }
      setVersion(version) {
        check32Bit(version);
        checkInputsForPartialSig(this.data.inputs, "setVersion");
        const c = this.__CACHE;
        c.__TX.version = version;
        c.__EXTRACTED_TX = void 0;
        return this;
      }
      setLocktime(locktime) {
        check32Bit(locktime);
        checkInputsForPartialSig(this.data.inputs, "setLocktime");
        const c = this.__CACHE;
        c.__TX.locktime = locktime;
        c.__EXTRACTED_TX = void 0;
        return this;
      }
      setInputSequence(inputIndex, sequence) {
        check32Bit(sequence);
        checkInputsForPartialSig(this.data.inputs, "setInputSequence");
        const c = this.__CACHE;
        if (c.__TX.ins.length <= inputIndex) {
          throw new Error("Input index too high");
        }
        c.__TX.ins[inputIndex].sequence = sequence;
        c.__EXTRACTED_TX = void 0;
        return this;
      }
      addInputs(inputDatas) {
        inputDatas.forEach((inputData) => this.addInput(inputData));
        return this;
      }
      addInput(inputData) {
        if (arguments.length > 1 || !inputData || inputData.hash === void 0 || inputData.index === void 0) {
          throw new Error(
            `Invalid arguments for Psbt.addInput. Requires single object with at least [hash] and [index]`
          );
        }
        checkTaprootInputFields(inputData, inputData, "addInput");
        checkInputsForPartialSig(this.data.inputs, "addInput");
        if (inputData.witnessScript) checkInvalidP2WSH(inputData.witnessScript);
        const c = this.__CACHE;
        this.data.addInput(inputData);
        const txIn = c.__TX.ins[c.__TX.ins.length - 1];
        checkTxInputCache(c, txIn);
        const inputIndex = this.data.inputs.length - 1;
        const input = this.data.inputs[inputIndex];
        if (input.nonWitnessUtxo) {
          addNonWitnessTxCache(this.__CACHE, input, inputIndex);
        }
        c.__FEE = void 0;
        c.__FEE_RATE = void 0;
        c.__EXTRACTED_TX = void 0;
        return this;
      }
      addOutputs(outputDatas) {
        outputDatas.forEach((outputData) => this.addOutput(outputData));
        return this;
      }
      addOutput(outputData) {
        if (arguments.length > 1 || !outputData || outputData.value === void 0 || outputData.address === void 0 && outputData.script === void 0) {
          throw new Error(
            `Invalid arguments for Psbt.addOutput. Requires single object with at least [script or address] and [value]`
          );
        }
        checkInputsForPartialSig(this.data.inputs, "addOutput");
        const { address } = outputData;
        if (typeof address === "string") {
          const { network } = this.opts;
          const script = toOutputScript(address, network);
          outputData = Object.assign({}, outputData, { script });
        }
        checkTaprootOutputFields(outputData, outputData, "addOutput");
        const c = this.__CACHE;
        this.data.addOutput(outputData);
        c.__FEE = void 0;
        c.__FEE_RATE = void 0;
        c.__EXTRACTED_TX = void 0;
        return this;
      }
      extractTransaction(disableFeeCheck) {
        if (!this.data.inputs.every(isFinalized)) throw new Error("Not finalized");
        const c = this.__CACHE;
        if (!disableFeeCheck) {
          checkFees(this, c, this.opts);
        }
        if (c.__EXTRACTED_TX) return c.__EXTRACTED_TX;
        const tx = c.__TX.clone();
        inputFinalizeGetAmts(this.data.inputs, tx, c, true);
        return tx;
      }
      getFeeRate() {
        return getTxCacheValue(
          "__FEE_RATE",
          "fee rate",
          this.data.inputs,
          this.__CACHE
        );
      }
      getFee() {
        return getTxCacheValue("__FEE", "fee", this.data.inputs, this.__CACHE);
      }
      finalizeAllInputs() {
        checkForInput(this.data.inputs, 0);
        range4(this.data.inputs.length).forEach((idx) => this.finalizeInput(idx));
        return this;
      }
      finalizeInput(inputIndex, finalScriptsFunc) {
        const input = checkForInput(this.data.inputs, inputIndex);
        if (isTaprootInput(input))
          return this._finalizeTaprootInput(
            inputIndex,
            input,
            void 0,
            finalScriptsFunc
          );
        return this._finalizeInput(inputIndex, input, finalScriptsFunc);
      }
      finalizeTaprootInput(inputIndex, tapLeafHashToFinalize, finalScriptsFunc = tapScriptFinalizer) {
        const input = checkForInput(this.data.inputs, inputIndex);
        if (isTaprootInput(input))
          return this._finalizeTaprootInput(
            inputIndex,
            input,
            tapLeafHashToFinalize,
            finalScriptsFunc
          );
        throw new Error(`Cannot finalize input #${inputIndex}. Not Taproot.`);
      }
      _finalizeInput(inputIndex, input, finalScriptsFunc = getFinalScripts) {
        const { script, isP2SH, isP2WSH, isSegwit } = getScriptFromInput(
          inputIndex,
          input,
          this.__CACHE
        );
        if (!script) throw new Error(`No script found for input #${inputIndex}`);
        checkPartialSigSighashes(input);
        const { finalScriptSig, finalScriptWitness } = finalScriptsFunc(
          inputIndex,
          input,
          script,
          isSegwit,
          isP2SH,
          isP2WSH
        );
        if (finalScriptSig) this.data.updateInput(inputIndex, { finalScriptSig });
        if (finalScriptWitness)
          this.data.updateInput(inputIndex, { finalScriptWitness });
        if (!finalScriptSig && !finalScriptWitness)
          throw new Error(`Unknown error finalizing input #${inputIndex}`);
        this.data.clearFinalizedInput(inputIndex);
        return this;
      }
      _finalizeTaprootInput(inputIndex, input, tapLeafHashToFinalize, finalScriptsFunc = tapScriptFinalizer) {
        if (!input.witnessUtxo)
          throw new Error(
            `Cannot finalize input #${inputIndex}. Missing withness utxo.`
          );
        if (input.tapKeySig) {
          const payment = p2tr({
            output: input.witnessUtxo.script,
            signature: input.tapKeySig
          });
          const finalScriptWitness = witnessStackToScriptWitness(payment.witness);
          this.data.updateInput(inputIndex, { finalScriptWitness });
        } else {
          const { finalScriptWitness } = finalScriptsFunc(
            inputIndex,
            input,
            tapLeafHashToFinalize
          );
          this.data.updateInput(inputIndex, { finalScriptWitness });
        }
        this.data.clearFinalizedInput(inputIndex);
        return this;
      }
      getInputType(inputIndex) {
        const input = checkForInput(this.data.inputs, inputIndex);
        const script = getScriptFromUtxo(inputIndex, input, this.__CACHE);
        const result = getMeaningfulScript(
          script,
          inputIndex,
          "input",
          input.redeemScript || redeemFromFinalScriptSig(input.finalScriptSig),
          input.witnessScript || redeemFromFinalWitnessScript(input.finalScriptWitness)
        );
        const type = result.type === "raw" ? "" : result.type + "-";
        const mainType = classifyScript(result.meaningfulScript);
        return type + mainType;
      }
      inputHasPubkey(inputIndex, pubkey) {
        const input = checkForInput(this.data.inputs, inputIndex);
        return pubkeyInInput(pubkey, input, inputIndex, this.__CACHE);
      }
      inputHasHDKey(inputIndex, root) {
        const input = checkForInput(this.data.inputs, inputIndex);
        const derivationIsMine = bip32DerivationIsMine(root);
        return !!input.bip32Derivation && input.bip32Derivation.some(derivationIsMine);
      }
      outputHasPubkey(outputIndex, pubkey) {
        const output = checkForOutput(this.data.outputs, outputIndex);
        return pubkeyInOutput(pubkey, output, outputIndex, this.__CACHE);
      }
      outputHasHDKey(outputIndex, root) {
        const output = checkForOutput(this.data.outputs, outputIndex);
        const derivationIsMine = bip32DerivationIsMine(root);
        return !!output.bip32Derivation && output.bip32Derivation.some(derivationIsMine);
      }
      validateSignaturesOfAllInputs(validator) {
        checkForInput(this.data.inputs, 0);
        const results = range4(this.data.inputs.length).map(
          (idx) => this.validateSignaturesOfInput(idx, validator)
        );
        return results.reduce((final, res) => res === true && final, true);
      }
      validateSignaturesOfInput(inputIndex, validator, pubkey) {
        const input = this.data.inputs[inputIndex];
        if (isTaprootInput(input))
          return this.validateSignaturesOfTaprootInput(
            inputIndex,
            validator,
            pubkey
          );
        return this._validateSignaturesOfInput(inputIndex, validator, pubkey);
      }
      _validateSignaturesOfInput(inputIndex, validator, pubkey) {
        const input = this.data.inputs[inputIndex];
        const partialSig = (input || {}).partialSig;
        if (!input || !partialSig || partialSig.length < 1)
          throw new Error("No signatures to validate");
        if (typeof validator !== "function")
          throw new Error("Need validator function to validate signatures");
        const mySigs = pubkey ? partialSig.filter((sig) => compare(sig.pubkey, pubkey) === 0) : partialSig;
        if (mySigs.length < 1) throw new Error("No signatures for this pubkey");
        const results = [];
        let hashCache;
        let scriptCache;
        let sighashCache;
        for (const pSig of mySigs) {
          const sig = signature.decode(pSig.signature);
          const { hash, script } = sighashCache !== sig.hashType ? getHashForSig(
            inputIndex,
            Object.assign({}, input, { sighashType: sig.hashType }),
            this.__CACHE,
            true
          ) : { hash: hashCache, script: scriptCache };
          sighashCache = sig.hashType;
          hashCache = hash;
          scriptCache = script;
          checkScriptForPubkey(pSig.pubkey, script, "verify");
          results.push(validator(pSig.pubkey, hash, sig.signature));
        }
        return results.every((res) => res === true);
      }
      validateSignaturesOfTaprootInput(inputIndex, validator, pubkey) {
        const input = this.data.inputs[inputIndex];
        const tapKeySig = (input || {}).tapKeySig;
        const tapScriptSig = (input || {}).tapScriptSig;
        if (!input && !tapKeySig && !(tapScriptSig && !tapScriptSig.length))
          throw new Error("No signatures to validate");
        if (typeof validator !== "function")
          throw new Error("Need validator function to validate signatures");
        pubkey = pubkey && toXOnly(pubkey);
        const allHashses = pubkey ? getTaprootHashesForSigValidation(
          inputIndex,
          input,
          this.data.inputs,
          pubkey,
          this.__CACHE
        ) : getAllTaprootHashesForSigValidation(
          inputIndex,
          input,
          this.data.inputs,
          this.__CACHE
        );
        if (!allHashses.length) throw new Error("No signatures for this pubkey");
        const tapKeyHash = allHashses.find((h) => !h.leafHash);
        let validationResultCount = 0;
        if (tapKeySig && tapKeyHash) {
          const isValidTapkeySig = validator(
            tapKeyHash.pubkey,
            tapKeyHash.hash,
            trimTaprootSig(tapKeySig)
          );
          if (!isValidTapkeySig) return false;
          validationResultCount++;
        }
        if (tapScriptSig) {
          for (const tapSig of tapScriptSig) {
            const tapSigHash = allHashses.find(
              (h) => compare(h.pubkey, tapSig.pubkey) === 0
            );
            if (tapSigHash) {
              const isValidTapScriptSig = validator(
                tapSig.pubkey,
                tapSigHash.hash,
                trimTaprootSig(tapSig.signature)
              );
              if (!isValidTapScriptSig) return false;
              validationResultCount++;
            }
          }
        }
        return validationResultCount > 0;
      }
      signAllInputsHD(hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
        if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) {
          throw new Error("Need HDSigner to sign input");
        }
        const results = [];
        for (const i of range4(this.data.inputs.length)) {
          try {
            this.signInputHD(i, hdKeyPair, sighashTypes);
            results.push(true);
          } catch (err) {
            results.push(false);
          }
        }
        if (results.every((v) => v === false)) {
          throw new Error("No inputs were signed");
        }
        return this;
      }
      signAllInputsHDAsync(hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
        return new Promise((resolve, reject) => {
          if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) {
            return reject(new Error("Need HDSigner to sign input"));
          }
          const results = [];
          const promises = [];
          for (const i of range4(this.data.inputs.length)) {
            promises.push(
              this.signInputHDAsync(i, hdKeyPair, sighashTypes).then(
                () => {
                  results.push(true);
                },
                () => {
                  results.push(false);
                }
              )
            );
          }
          return Promise.all(promises).then(() => {
            if (results.every((v) => v === false)) {
              return reject(new Error("No inputs were signed"));
            }
            resolve();
          });
        });
      }
      signInputHD(inputIndex, hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
        if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) {
          throw new Error("Need HDSigner to sign input");
        }
        const signers = getSignersFromHD(inputIndex, this.data.inputs, hdKeyPair);
        signers.forEach((signer) => this.signInput(inputIndex, signer, sighashTypes));
        return this;
      }
      signInputHDAsync(inputIndex, hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
        return new Promise((resolve, reject) => {
          if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) {
            return reject(new Error("Need HDSigner to sign input"));
          }
          const signers = getSignersFromHD(inputIndex, this.data.inputs, hdKeyPair);
          const promises = signers.map(
            (signer) => this.signInputAsync(inputIndex, signer, sighashTypes)
          );
          return Promise.all(promises).then(() => {
            resolve();
          }).catch(reject);
        });
      }
      signAllInputs(keyPair, sighashTypes) {
        if (!keyPair || !keyPair.publicKey)
          throw new Error("Need Signer to sign input");
        const results = [];
        for (const i of range4(this.data.inputs.length)) {
          try {
            this.signInput(i, keyPair, sighashTypes);
            results.push(true);
          } catch (err) {
            results.push(false);
          }
        }
        if (results.every((v) => v === false)) {
          throw new Error("No inputs were signed");
        }
        return this;
      }
      signAllInputsAsync(keyPair, sighashTypes) {
        return new Promise((resolve, reject) => {
          if (!keyPair || !keyPair.publicKey)
            return reject(new Error("Need Signer to sign input"));
          const results = [];
          const promises = [];
          for (const [i] of this.data.inputs.entries()) {
            promises.push(
              this.signInputAsync(i, keyPair, sighashTypes).then(
                () => {
                  results.push(true);
                },
                () => {
                  results.push(false);
                }
              )
            );
          }
          return Promise.all(promises).then(() => {
            if (results.every((v) => v === false)) {
              return reject(new Error("No inputs were signed"));
            }
            resolve();
          });
        });
      }
      signInput(inputIndex, keyPair, sighashTypes) {
        if (!keyPair || !keyPair.publicKey)
          throw new Error("Need Signer to sign input");
        const input = checkForInput(this.data.inputs, inputIndex);
        if (isTaprootInput(input)) {
          return this._signTaprootInput(
            inputIndex,
            input,
            keyPair,
            void 0,
            sighashTypes
          );
        }
        return this._signInput(inputIndex, keyPair, sighashTypes);
      }
      signTaprootInput(inputIndex, keyPair, tapLeafHashToSign, sighashTypes) {
        if (!keyPair || !keyPair.publicKey)
          throw new Error("Need Signer to sign input");
        const input = checkForInput(this.data.inputs, inputIndex);
        if (isTaprootInput(input))
          return this._signTaprootInput(
            inputIndex,
            input,
            keyPair,
            tapLeafHashToSign,
            sighashTypes
          );
        throw new Error(`Input #${inputIndex} is not of type Taproot.`);
      }
      _signInput(inputIndex, keyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
        const { hash, sighashType } = getHashAndSighashType(
          this.data.inputs,
          inputIndex,
          keyPair.publicKey,
          this.__CACHE,
          sighashTypes
        );
        const partialSig = [
          {
            pubkey: keyPair.publicKey,
            signature: signature.encode(keyPair.sign(hash), sighashType)
          }
        ];
        this.data.updateInput(inputIndex, { partialSig });
        return this;
      }
      _signTaprootInput(inputIndex, input, keyPair, tapLeafHashToSign, allowedSighashTypes = [Transaction.SIGHASH_DEFAULT]) {
        const hashesForSig = this.checkTaprootHashesForSig(
          inputIndex,
          input,
          keyPair,
          tapLeafHashToSign,
          allowedSighashTypes
        );
        const tapKeySig = hashesForSig.filter((h) => !h.leafHash).map(
          (h) => serializeTaprootSignature(
            keyPair.signSchnorr(h.hash),
            input.sighashType
          )
        )[0];
        const tapScriptSig = hashesForSig.filter((h) => !!h.leafHash).map((h) => ({
          pubkey: toXOnly(keyPair.publicKey),
          signature: serializeTaprootSignature(
            keyPair.signSchnorr(h.hash),
            input.sighashType
          ),
          leafHash: h.leafHash
        }));
        if (tapKeySig) {
          this.data.updateInput(inputIndex, { tapKeySig });
        }
        if (tapScriptSig.length) {
          this.data.updateInput(inputIndex, { tapScriptSig });
        }
        return this;
      }
      signInputAsync(inputIndex, keyPair, sighashTypes) {
        return Promise.resolve().then(() => {
          if (!keyPair || !keyPair.publicKey)
            throw new Error("Need Signer to sign input");
          const input = checkForInput(this.data.inputs, inputIndex);
          if (isTaprootInput(input))
            return this._signTaprootInputAsync(
              inputIndex,
              input,
              keyPair,
              void 0,
              sighashTypes
            );
          return this._signInputAsync(inputIndex, keyPair, sighashTypes);
        });
      }
      signTaprootInputAsync(inputIndex, keyPair, tapLeafHash, sighashTypes) {
        return Promise.resolve().then(() => {
          if (!keyPair || !keyPair.publicKey)
            throw new Error("Need Signer to sign input");
          const input = checkForInput(this.data.inputs, inputIndex);
          if (isTaprootInput(input))
            return this._signTaprootInputAsync(
              inputIndex,
              input,
              keyPair,
              tapLeafHash,
              sighashTypes
            );
          throw new Error(`Input #${inputIndex} is not of type Taproot.`);
        });
      }
      _signInputAsync(inputIndex, keyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
        const { hash, sighashType } = getHashAndSighashType(
          this.data.inputs,
          inputIndex,
          keyPair.publicKey,
          this.__CACHE,
          sighashTypes
        );
        return Promise.resolve(keyPair.sign(hash)).then((signature2) => {
          const partialSig = [
            {
              pubkey: keyPair.publicKey,
              signature: signature.encode(signature2, sighashType)
            }
          ];
          this.data.updateInput(inputIndex, { partialSig });
        });
      }
      async _signTaprootInputAsync(inputIndex, input, keyPair, tapLeafHash, sighashTypes = [Transaction.SIGHASH_DEFAULT]) {
        const hashesForSig = this.checkTaprootHashesForSig(
          inputIndex,
          input,
          keyPair,
          tapLeafHash,
          sighashTypes
        );
        const signaturePromises = [];
        const tapKeyHash = hashesForSig.filter((h) => !h.leafHash)[0];
        if (tapKeyHash) {
          const tapKeySigPromise = Promise.resolve(
            keyPair.signSchnorr(tapKeyHash.hash)
          ).then((sig) => {
            return { tapKeySig: serializeTaprootSignature(sig, input.sighashType) };
          });
          signaturePromises.push(tapKeySigPromise);
        }
        const tapScriptHashes = hashesForSig.filter((h) => !!h.leafHash);
        if (tapScriptHashes.length) {
          const tapScriptSigPromises = tapScriptHashes.map((tsh) => {
            return Promise.resolve(keyPair.signSchnorr(tsh.hash)).then(
              (signature2) => {
                const tapScriptSig = [
                  {
                    pubkey: toXOnly(keyPair.publicKey),
                    signature: serializeTaprootSignature(
                      signature2,
                      input.sighashType
                    ),
                    leafHash: tsh.leafHash
                  }
                ];
                return { tapScriptSig };
              }
            );
          });
          signaturePromises.push(...tapScriptSigPromises);
        }
        return Promise.all(signaturePromises).then((results) => {
          results.forEach((v) => this.data.updateInput(inputIndex, v));
        });
      }
      checkTaprootHashesForSig(inputIndex, input, keyPair, tapLeafHashToSign, allowedSighashTypes) {
        if (typeof keyPair.signSchnorr !== "function")
          throw new Error(
            `Need Schnorr Signer to sign taproot input #${inputIndex}.`
          );
        const hashesForSig = getTaprootHashesForSigning(
          inputIndex,
          input,
          this.data.inputs,
          keyPair.publicKey,
          this.__CACHE,
          tapLeafHashToSign,
          allowedSighashTypes
        );
        if (!hashesForSig || !hashesForSig.length)
          throw new Error(
            `Can not sign for input #${inputIndex} with the key ${toHex(keyPair.publicKey)}`
          );
        return hashesForSig;
      }
      toBuffer() {
        checkCache(this.__CACHE);
        return this.data.toBuffer();
      }
      toHex() {
        checkCache(this.__CACHE);
        return this.data.toHex();
      }
      toBase64() {
        checkCache(this.__CACHE);
        return this.data.toBase64();
      }
      updateGlobal(updateData) {
        this.data.updateGlobal(updateData);
        return this;
      }
      updateInput(inputIndex, updateData) {
        if (updateData.witnessScript) checkInvalidP2WSH(updateData.witnessScript);
        checkTaprootInputFields(
          this.data.inputs[inputIndex],
          updateData,
          "updateInput"
        );
        this.data.updateInput(inputIndex, updateData);
        if (updateData.nonWitnessUtxo) {
          addNonWitnessTxCache(
            this.__CACHE,
            this.data.inputs[inputIndex],
            inputIndex
          );
        }
        if (updateData.nonWitnessUtxo || updateData.witnessUtxo) {
          const c = this.__CACHE;
          c.__FEE = void 0;
          c.__FEE_RATE = void 0;
          c.__EXTRACTED_TX = void 0;
        }
        return this;
      }
      updateOutput(outputIndex, updateData) {
        const outputData = this.data.outputs[outputIndex];
        checkTaprootOutputFields(outputData, updateData, "updateOutput");
        this.data.updateOutput(outputIndex, updateData);
        return this;
      }
      addUnknownKeyValToGlobal(keyVal) {
        this.data.addUnknownKeyValToGlobal(keyVal);
        return this;
      }
      addUnknownKeyValToInput(inputIndex, keyVal) {
        this.data.addUnknownKeyValToInput(inputIndex, keyVal);
        return this;
      }
      addUnknownKeyValToOutput(outputIndex, keyVal) {
        this.data.addUnknownKeyValToOutput(outputIndex, keyVal);
        return this;
      }
      clearFinalizedInput(inputIndex) {
        this.data.clearFinalizedInput(inputIndex);
        return this;
      }
    };
    transactionFromBuffer = (buffer) => new PsbtTransaction(buffer);
    PsbtTransaction = class {
      tx;
      constructor(buffer = Uint8Array.from([2, 0, 0, 0, 0, 0, 0, 0, 0, 0])) {
        this.tx = Transaction.fromBuffer(buffer);
        checkTxEmpty(this.tx);
        Object.defineProperty(this, "tx", {
          enumerable: false,
          writable: true
        });
      }
      getInputOutputCounts() {
        return {
          inputCount: this.tx.ins.length,
          outputCount: this.tx.outs.length
        };
      }
      addInput(input) {
        if (input.hash === void 0 || input.index === void 0 || !(input.hash instanceof Uint8Array) && typeof input.hash !== "string" || typeof input.index !== "number") {
          throw new Error("Error adding input.");
        }
        const hash = typeof input.hash === "string" ? reverseBuffer(fromHex(input.hash)) : input.hash;
        this.tx.addInput(hash, input.index, input.sequence);
      }
      addOutput(output) {
        if (output.script === void 0 || output.value === void 0 || !(output.script instanceof Uint8Array) || typeof output.value !== "bigint") {
          throw new Error("Error adding output.");
        }
        this.tx.addOutput(output.script, output.value);
      }
      toBuffer() {
        return this.tx.toBuffer();
      }
    };
    checkRedeemScript = scriptCheckerFactory(p2sh, "Redeem script");
    checkWitnessScript = scriptCheckerFactory(
      p2wsh,
      "Witness script"
    );
  }
});

// node_modules/bitcoinjs-lib/src/esm/index.js
var init_esm5 = __esm({
  "node_modules/bitcoinjs-lib/src/esm/index.js"() {
    init_address();
    init_crypto();
    init_networks();
    init_payments();
    init_script();
    init_block();
    init_psbt2();
    init_ops();
    init_transaction();
    init_ecc_lib();
  }
});

// node_modules/@noble/hashes/utils.js
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes3(value2, length2, title = "") {
  if (isBytes3(value2) && (length2 === void 0 || value2.length === length2))
    return value2;
  if (length2 !== void 0)
    anumber(length2, "length");
  const bytes = isBytes3(value2);
  const ofLen = length2 !== void 0 ? ` of length ${length2}` : "";
  const got = bytes ? `length=${value2.length}` : `type=${typeof value2}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("expected hash wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
  if (h.outputLen < 1 || h.blockLen < 1)
    throw new Error("hash blockLen / outputLen must be >= 1");
}
function aexists3(instance2, checkFinished = true) {
  if (instance2.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance2.finished)
    throw new Error("digest() was already called");
}
function aoutput3(out, instance2) {
  abytes3(out, void 0, "output");
  const min = instance2.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function clean3(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView3(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr3(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl2(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
function bytesToHex(bytes) {
  abytes3(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex2 = "";
  for (let i = 0; i < bytes.length; i++) {
    hex2 += hexes[bytes[i]];
  }
  return hex2;
}
function asciiToBase16(ch) {
  return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - (65 - 10) : ch >= 97 && ch <= 102 ? ch - (97 - 10) : void 0;
}
function hexToBytes(hex2) {
  if (typeof hex2 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex2);
  if (hasHexBuiltin) {
    try {
      return Uint8Array.fromHex(hex2);
    } catch (error) {
      if (error instanceof SyntaxError)
        throw new RangeError(error.message);
      throw error;
    }
  }
  const hl = hex2.length;
  const al = hl / 2;
  if (hl % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex2.charCodeAt(hi));
    const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex2[hi] + hex2[hi + 1];
      throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function utf8ToBytes3(str) {
  if (typeof str !== "string")
    throw new TypeError("string expected");
  const encoded = new TextEncoder().encode(str);
  try {
    return new Uint8Array(encoded);
  } finally {
    clean3(encoded);
  }
}
function kdfInputToBytes(data, errorTitle = "") {
  if (typeof data === "string")
    return utf8ToBytes3(data);
  return abytes3(data, void 0, errorTitle);
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes3(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher3(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  anumber(bytesLength, "bytesLength");
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (bytesLength > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var atitle, aobject, aopts, hasHexBuiltin, hexes, oidNist;
var init_utils4 = __esm({
  "node_modules/@noble/hashes/utils.js"() {
    atitle = (title) => title ? `"${title}" ` : "";
    aobject = (value2, label) => {
      if (value2 === null || typeof value2 !== "object" || Array.isArray(value2))
        throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value2);
    };
    aopts = (value2, label) => {
      aobject(value2, label);
      const proto = Object.getPrototypeOf(value2);
      if (proto !== Object.prototype && proto !== null)
        throw new TypeError(`"${label}" expected plain object`);
      if (Object.hasOwn(value2, "__proto__"))
        throw new TypeError(`"${label}.__proto__" is not allowed`);
    };
    hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    oidNist = (suffix) => ({
      // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
      // Larger suffix values would need base-128 OID encoding and a different length byte.
      oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
    });
  }
});

// node_modules/@noble/hashes/hmac.js
var _HMAC, hmac;
var init_hmac = __esm({
  "node_modules/@noble/hashes/hmac.js"() {
    init_utils4();
    _HMAC = class {
      oHash;
      iHash;
      blockLen;
      outputLen;
      canXOF = false;
      finished = false;
      destroyed = false;
      constructor(hash, key) {
        ahash(hash);
        abytes3(key, void 0, "key");
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("expected Hash instance");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        clean3(pad);
      }
      update(buf) {
        aexists3(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        aexists3(this);
        aoutput3(out, this);
        this.finished = true;
        const buf = out.subarray(0, this.outputLen);
        this.iHash.digestInto(buf);
        this.oHash.update(buf);
        this.oHash.digestInto(buf);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to ||= Object.create(Object.getPrototypeOf(this), {});
        const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.canXOF = canXOF;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = /* @__PURE__ */ (() => {
      const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
      hmac_.create = (hash, key) => new _HMAC(hash, key);
      return hmac_;
    })();
  }
});

// node_modules/@noble/hashes/pbkdf2.js
function pbkdf2Init(hash, _password, _salt, _opts) {
  ahash(hash);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber(c, "c");
  anumber(dkLen, "dkLen");
  anumber(asyncTick, "asyncTick");
  if (c < 1)
    throw new Error('"c" (iterations) must be >= 1');
  if (dkLen < 1)
    throw new Error('"dkLen" must be >= 1');
  if (dkLen > (2 ** 32 - 1) * hash.outputLen)
    throw new Error("derived key too long");
  const p = kdfInputToBytes(_password, "password");
  try {
    const s = kdfInputToBytes(_salt, "salt");
    try {
      const DK = new Uint8Array(dkLen);
      const { iHash, oHash, outputLen } = hmac.create(hash, p);
      const u = new Uint8Array(outputLen);
      const eng = pbkdf2Engine(iHash, oHash, s, u);
      return { c, dkLen, asyncTick, DK, outputLen, eng };
    } finally {
      if (typeof _salt === "string")
        clean3(s);
    }
  } finally {
    if (typeof _password === "string")
      clean3(p);
  }
}
function pbkdf2Engine(iHash, oHash, salt, u) {
  const counter = new Uint8Array(4);
  const view = createView3(counter);
  const salted = iHash._cloneInto().update(salt);
  const work = oHash._cloneInto();
  const iClone = iHash._cloneInto;
  const oClone = oHash._cloneInto;
  return {
    u1: (ti, Ti) => {
      view.setInt32(0, ti, false);
      salted._cloneInto(work).update(counter).digestInto(u);
      oHash._cloneInto(work).update(u).digestInto(u);
      Ti.set(u.subarray(0, Ti.length));
    },
    // Whole `F` inner loop for the sync variant: one optimized function owns the hot loop.
    rounds: (c, Ti) => {
      for (let ui = 1; ui < c; ui++) {
        iClone.call(iHash, work).update(u).digestInto(u);
        oClone.call(oHash, work).update(u).digestInto(u);
        for (let i = 0; i < Ti.length; i++)
          Ti[i] ^= u[i];
      }
    },
    output: (DK) => {
      iHash.destroy();
      oHash.destroy();
      salted.destroy();
      work.destroy();
      clean3(u);
      return DK;
    }
  };
}
function pbkdf2(hash, password, salt, opts) {
  const { c, dkLen, DK, outputLen, eng } = pbkdf2Init(hash, password, salt, opts);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += outputLen) {
    const Ti = DK.subarray(pos, pos + outputLen);
    eng.u1(ti, Ti);
    eng.rounds(c, Ti);
  }
  return eng.output(DK);
}
var init_pbkdf2 = __esm({
  "node_modules/@noble/hashes/pbkdf2.js"() {
    init_hmac();
    init_utils4();
  }
});

// node_modules/@noble/hashes/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function setU64FromNum(view, byteOffset, n, isLE) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE ? l : h, isLE);
  view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK64, _32n, fromNumH, fromNumL, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
var init_u64 = __esm({
  "node_modules/@noble/hashes/_u64.js"() {
    U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
    _32n = /* @__PURE__ */ BigInt(32);
    fromNumH = (n) => n / 2 ** 32 | 0;
    fromNumL = (n) => n >>> 0;
    shrSH = (h, _l, s) => h >>> s;
    shrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  }
});

// node_modules/@noble/hashes/_md.js
function Chi3(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj3(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD3, SHA256_IV3, SHA512_IV3;
var init_md3 = __esm({
  "node_modules/@noble/hashes/_md.js"() {
    init_u64();
    init_utils4();
    HashMD3 = class {
      blockLen;
      outputLen;
      canXOF = false;
      padOffset;
      isLE;
      // For partial updates less than block size
      buffer;
      view;
      finished = false;
      length = 0;
      pos = 0;
      destroyed = false;
      constructor(blockLen, outputLen, padOffset, isLE) {
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView3(this.buffer);
      }
      update(data) {
        aexists3(this);
        abytes3(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        let processed = false;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView3(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            processed = true;
            continue;
          }
          buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
            processed = true;
          }
        }
        this.length += data.length;
        if (processed)
          this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists3(this);
        aoutput3(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        buffer.fill(0, pos);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          buffer.fill(0);
        }
        setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
        this.process(view, 0);
        this.roundClean();
        const oview = out === buffer ? view : createView3(out);
        const len = this.outputLen;
        const outLen = len / 4;
        const state = this.get();
        if (len % 4 || outLen > state.length)
          throw new Error("invalid outputLen");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneIntoMeta(to) {
        const { buffer, length: length2, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length2;
        to.pos = pos;
        if (pos)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV3 = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    SHA512_IV3 = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// node_modules/@noble/hashes/sha2.js
var SHA256_K3, SHA256_W3, SHA2_32B, _SHA256, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, sha2565, sha512;
var init_sha23 = __esm({
  "node_modules/@noble/hashes/sha2.js"() {
    init_md3();
    init_u64();
    init_utils4();
    SHA256_K3 = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W3 = /* @__PURE__ */ new Uint32Array(64);
    SHA2_32B = class extends HashMD3 {
      // We cannot use array here since array allows indexing by variable
      // which means optimizer/compiler cannot use registers.
      // Numeric initializers matter: starting the fields as `undefined` changes
      // V8's field representation and makes sha256 3x slower (measured).
      A = 0;
      B = 0;
      C = 0;
      D = 0;
      E = 0;
      F = 0;
      G = 0;
      H = 0;
      constructor(outputLen, IV) {
        super(64, outputLen, 8, false);
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W3[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W3[i - 15];
          const W2 = SHA256_W3[i - 2];
          const s0 = rotr3(W15, 7) ^ rotr3(W15, 18) ^ W15 >>> 3;
          const s1 = rotr3(W2, 17) ^ rotr3(W2, 19) ^ W2 >>> 10;
          SHA256_W3[i] = s1 + SHA256_W3[i - 7] + s0 + SHA256_W3[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr3(E, 6) ^ rotr3(E, 11) ^ rotr3(E, 25);
          const T1 = H + sigma1 + Chi3(E, F, G) + SHA256_K3[i] + SHA256_W3[i] | 0;
          const sigma0 = rotr3(A, 2) ^ rotr3(A, 13) ^ rotr3(A, 22);
          const T2 = sigma0 + Maj3(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean3(SHA256_W3);
      }
      destroy() {
        this.destroyed = true;
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean3(this.buffer);
      }
    };
    _SHA256 = class extends SHA2_32B {
      constructor() {
        super(32, SHA256_IV3);
      }
    };
    K512 = /* @__PURE__ */ (() => split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    SHA2_64B = class extends HashMD3 {
      // We cannot use array here since array allows indexing by variable
      // which means optimizer/compiler cannot use registers.
      // h -- high 32 bits, l -- low 32 bits
      // Numeric initializers matter: starting the fields as `undefined` changes
      // V8's field representation and slows hashing down (measured on sha256).
      Ah = 0;
      Al = 0;
      Bh = 0;
      Bl = 0;
      Ch = 0;
      Cl = 0;
      Dh = 0;
      Dl = 0;
      Eh = 0;
      El = 0;
      Fh = 0;
      Fl = 0;
      Gh = 0;
      Gl = 0;
      Hh = 0;
      Hl = 0;
      constructor(outputLen, IV) {
        super(128, outputLen, 16, false);
        this.Ah = IV[0] | 0;
        this.Al = IV[1] | 0;
        this.Bh = IV[2] | 0;
        this.Bl = IV[3] | 0;
        this.Ch = IV[4] | 0;
        this.Cl = IV[5] | 0;
        this.Dh = IV[6] | 0;
        this.Dl = IV[7] | 0;
        this.Eh = IV[8] | 0;
        this.El = IV[9] | 0;
        this.Fh = IV[10] | 0;
        this.Fl = IV[11] | 0;
        this.Gh = IV[12] | 0;
        this.Gl = IV[13] | 0;
        this.Hh = IV[14] | 0;
        this.Hl = IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
          const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
          const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
          const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
          const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
          const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = add3L(T1l, sigma0l, MAJl);
          Ah = add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        clean3(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        this.destroyed = true;
        clean3(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    _SHA512 = class extends SHA2_64B {
      constructor() {
        super(64, SHA512_IV3);
      }
    };
    sha2565 = /* @__PURE__ */ createHasher3(
      () => new _SHA256(),
      /* @__PURE__ */ oidNist(1)
    );
    sha512 = /* @__PURE__ */ createHasher3(
      () => new _SHA512(),
      /* @__PURE__ */ oidNist(3)
    );
  }
});

// node_modules/@scure/bip39/index.js
function isWellFormedUnicode(value2) {
  for (let i = 0; i < value2.length; i++) {
    const current = value2.charCodeAt(i);
    if (current >= 55296 && current <= 56319) {
      if (i + 1 >= value2.length)
        return false;
      const next = value2.charCodeAt(++i);
      if (next < 56320 || next > 57343)
        return false;
    } else if (current >= 56320 && current <= 57343) {
      return false;
    }
  }
  return true;
}
function nfkd(str) {
  if (typeof str !== "string")
    throw new TypeError("invalid mnemonic type: " + typeof str);
  if (!isWellFormedUnicode(str))
    throw new TypeError("expected well-formed Unicode string");
  return str.normalize("NFKD");
}
function normalize(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![12, 15, 18, 21, 24].includes(words.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: norm, words };
}
function aentropy(ent) {
  abytes3(ent);
  if (![16, 20, 24, 28, 32].includes(ent.length))
    throw new RangeError("invalid entropy length");
}
function generateMnemonic(wordlist2, strength = 128) {
  anumber(strength);
  if (strength % 32 !== 0 || strength > 256)
    throw new RangeError("Invalid entropy");
  return entropyToMnemonic(randomBytes(strength / 8), wordlist2);
}
function awordlist(wordlist2) {
  if (!Array.isArray(wordlist2) || wordlist2.length !== 2048 || typeof wordlist2[0] !== "string")
    throw new TypeError("Wordlist: expected array of 2048 strings");
  wordlist2.forEach((i) => {
    if (typeof i !== "string")
      throw new TypeError("wordlist: non-string element: " + i);
    if (!isWellFormedUnicode(i))
      throw new TypeError("wordlist: expected well-formed Unicode string");
  });
}
function encodeWords(entropy, wordlist2) {
  awordlist(wordlist2);
  const bytes = new Uint8Array(entropy.length + 1);
  bytes.set(entropy);
  bytes[entropy.length] = calcChecksum(entropy);
  const words = [];
  let carry = 0;
  let bits = 0;
  for (const byte of bytes) {
    carry = carry << 8 | byte;
    bits += 8;
    if (bits >= 11) {
      bits -= 11;
      words.push(wordlist2[carry >>> bits & 2047]);
      carry &= (1 << bits) - 1;
    }
  }
  return words;
}
function decodeWords(words, wordlist2) {
  awordlist(wordlist2);
  const entLen = words.length / 3 * 4;
  const bytes = new Uint8Array(entLen + 1);
  let carry = 0;
  let bits = 0;
  let pos = 0;
  for (const word of words) {
    const index = wordlist2.indexOf(word);
    if (index === -1)
      throw new Error("Unknown word: " + word);
    carry = carry << 11 | index;
    bits += 11;
    while (bits >= 8) {
      bits -= 8;
      bytes[pos++] = carry >>> bits & 255;
    }
    carry &= (1 << bits) - 1;
  }
  if (bits > 0)
    bytes[pos] = carry << 8 - bits;
  const entropy = bytes.subarray(0, entLen);
  if (bytes[entLen] !== calcChecksum(entropy))
    throw new Error("Invalid checksum");
  return Uint8Array.from(entropy);
}
function mnemonicToEntropy(mnemonic2, wordlist2) {
  const { words } = normalize(mnemonic2);
  const entropy = decodeWords(words, wordlist2);
  aentropy(entropy);
  return entropy;
}
function entropyToMnemonic(entropy, wordlist2) {
  aentropy(entropy);
  const words = encodeWords(entropy, wordlist2);
  return words.join(isJapanese(wordlist2) ? "\u3000" : " ");
}
function validateMnemonic(mnemonic2, wordlist2) {
  try {
    mnemonicToEntropy(mnemonic2, wordlist2);
  } catch (e) {
    return false;
  }
  return true;
}
function mnemonicToSeedSync(mnemonic2, passphrase = "") {
  return pbkdf2(sha512, normalize(mnemonic2).nfkd, psalt(passphrase), {
    c: 2048,
    dkLen: 64
  });
}
var isJapanese, calcChecksum, psalt;
var init_bip39 = __esm({
  "node_modules/@scure/bip39/index.js"() {
    init_pbkdf2();
    init_sha23();
    init_utils4();
    isJapanese = (wordlist2) => wordlist2[0] === "\u3042\u3044\u3053\u304F\u3057\u3093";
    calcChecksum = (entropy) => {
      const bitsLeft = 8 - entropy.length / 4;
      return sha2565(entropy)[0] >> bitsLeft << bitsLeft;
    };
    psalt = (passphrase) => {
      if (typeof passphrase !== "string")
        throw new TypeError("invalid passphrase type: " + typeof passphrase);
      return nfkd("mnemonic" + passphrase);
    };
  }
});

// node_modules/@scure/bip39/wordlists/english.js
var wordlist;
var init_english = __esm({
  "node_modules/@scure/bip39/wordlists/english.js"() {
    wordlist = /* @__PURE__ */ Object.freeze(`abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split("\n"));
  }
});

// node_modules/@noble/curves/utils.js
function aarray(item, title, inner = () => {
}) {
  if (!Array.isArray(item))
    throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
  for (let i = 0; i < item.length; i++)
    inner(item[i], `${title}[${i}]`);
  return item;
}
function astring(value2, title = "") {
  if (typeof value2 !== "string") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected string, got type=" + typeof value2);
  }
  return value2;
}
function aobject2(value2, title = "object") {
  if (value2 === null || typeof value2 !== "object" || Array.isArray(value2))
    throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value2}`);
  return value2;
}
function afunction(value2, title) {
  if (typeof value2 !== "function")
    throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value2}`);
  return value2;
}
function abool(value2, title = "") {
  if (typeof value2 !== "boolean")
    throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value2);
  return value2;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new RangeError("positive bigint expected, got " + n);
  } else
    anumber2(n);
  return n;
}
function asafenumber(value2, title = "") {
  if (typeof value2 !== "number") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected number, got type=" + typeof value2);
  }
  if (!Number.isSafeInteger(value2)) {
    const prefix = title && `"${title}" `;
    throw new RangeError(prefix + "expected safe integer, got " + value2);
  }
}
function numberToHexUnpadded(num) {
  const hex2 = abignumber(num).toString(16);
  return hex2.length & 1 ? "0" + hex2 : hex2;
}
function hexToNumber(hex2) {
  if (typeof hex2 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex2);
  return hex2 === "" ? _0n : BigInt("0x" + hex2);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex(copyBytes(abytes3(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber(len);
  if (len === 0)
    throw new Error("zero output length is invalid");
  n = abignumber(n);
  const expectedLen = len * 2;
  const hex2 = n.toString(16);
  if (hex2.length > expectedLen)
    throw new RangeError("number is too large");
  return hexToBytes(hex2.padStart(expectedLen, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes4(bytes));
}
function isPosBig(n) {
  return typeof n === "bigint" && _0n <= n;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  if (n < _0n)
    throw new Error("expected non-negative bigint, got " + n);
  return n === _0n ? 0 : n.toString(2).length;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber(hashLen, "hashLen");
  anumber(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function")
    throw new TypeError("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const NULL = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...msgs) => hmacFn(k, concatBytes2(v, ...msgs));
  const reseed = (seed = NULL) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(byte1, seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= _maxDrbgIters)
      throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while ((res = pred(gen())) === void 0)
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object2, fields = {}, optFields = {}, title = "object") {
  aobject2(object2, title);
  aobject2(fields, "fields");
  aobject2(optFields, "optFields");
  function checkField(fieldName, expectedType, isOpt) {
    const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
    const val = object2[fieldName];
    if (!Object.hasOwn(object2, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
      throw new TypeError(`${label} is invalid: expected own property`);
    }
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}
var abytes4, anumber2, bytesToHex2, concatBytes2, hexToBytes2, isBytes4, randomBytes2, _0n, _1n, atitle2, bitMask;
var init_utils5 = __esm({
  "node_modules/@noble/curves/utils.js"() {
    init_utils4();
    abytes4 = (value2, length2, title) => abytes3(value2, length2, title);
    anumber2 = anumber;
    bytesToHex2 = bytesToHex;
    concatBytes2 = (...arrays) => concatBytes(...arrays);
    hexToBytes2 = (hex2) => hexToBytes(hex2);
    isBytes4 = isBytes3;
    randomBytes2 = (bytesLength) => randomBytes(bytesLength);
    _0n = /* @__PURE__ */ BigInt(0);
    _1n = /* @__PURE__ */ BigInt(1);
    atitle2 = (title) => title ? `"${title}" ` : "";
    bitMask = (n) => {
      asafenumber(n, "n");
      return (_1n << BigInt(n)) - _1n;
    };
  }
});

// node_modules/@noble/curves/abstract/modular.js
function mod(a, b) {
  if (b <= _0n2)
    throw new Error("mod: expected positive modulus, got " + b);
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _1n2)
    throw new Error("pow: expected modulus > 1, got " + modulo);
  if (typeof power !== "bigint")
    throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return _1n2;
  if (power === _1n2)
    return num;
  let d = num % modulo;
  if (d < _0n2)
    d += modulo;
  if (power < POW_WINDOWED_MIN) {
    let p2 = _1n2;
    while (power > _0n2) {
      if (power & _1n2)
        p2 = p2 * d % modulo;
      d = d * d % modulo;
      power >>= _1n2;
    }
    return p2;
  }
  const digits = [];
  while (power > _0n2) {
    digits.push(Number(power & _15n));
    power >>= _4n;
  }
  const table = new Array(16);
  table[0] = _1n2;
  table[1] = d;
  for (let i = 2; i < 16; i++)
    table[i] = table[i - 1] * d % modulo;
  let p = table[digits[digits.length - 1]];
  for (let w = digits.length - 2; w >= 0; w--) {
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    const digit = digits[w];
    if (digit !== 0)
      p = p * table[digit] % modulo;
  }
  return p;
}
function pow2(x, power, modulo) {
  if (modulo <= _1n2)
    throw new Error("pow2: expected modulus > 1, got " + modulo);
  if (power < _0n2)
    throw new Error("pow2: expected non-negative exponent, got " + power);
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number3, modulo) {
  if (number3 === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _1n2)
    throw new Error("invert: expected modulus > 1, got " + modulo);
  let a = mod(number3, modulo);
  let b = modulo;
  let x = _0n2, u = _1n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b - a * q;
    const m = x - u * q;
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function invertCt(a, prime) {
  if (prime <= _1n2)
    throw new Error("invertCt: expected prime modulus > 1, got " + prime);
  const an = mod(a, prime);
  if (an === _0n2)
    throw new Error("invertCt: expected non-zero number");
  const inverse = pow(an, prime - _2n, prime);
  if (mod(an * inverse, prime) !== _1n2)
    throw new Error("invertCt: does not exist");
  return inverse;
}
function assertIsSquare(Fp, root, n) {
  const F = Fp;
  if (!F.eql(F.sqr(root), n))
    throw new Error("Cannot find square root");
}
function aoddModulus(order, fnName) {
  if ((order & _1n2) === _0n2)
    throw new Error(fnName + ": expected odd modulus, got " + order);
}
function sqrt3mod4(Fp, n) {
  const F = Fp;
  const p1div4 = (F.ORDER + _1n2) / _4n;
  const root = F.pow(n, p1div4);
  assertIsSquare(F, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const F = Fp;
  const p5div8 = (F.ORDER - _5n) / _8n;
  const n2 = F.mul(n, _2n);
  const v = F.pow(n2, p5div8);
  const nv = F.mul(n, v);
  const i = F.mul(F.mul(nv, _2n), v);
  const root = F.mul(nv, F.sub(i, F.ONE));
  assertIsSquare(F, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return ((Fp, n) => {
    const F = Fp;
    let tv1 = F.pow(n, c4);
    let tv2 = F.mul(tv1, c1);
    const tv3 = F.mul(tv1, c2);
    const tv4 = F.mul(tv1, c3);
    const e1 = F.eql(F.sqr(tv2), n);
    const e2 = F.eql(F.sqr(tv3), n);
    tv1 = F.cmov(tv1, tv2, e1);
    tv2 = F.cmov(tv4, tv3, e2);
    const e3 = F.eql(F.sqr(tv2), n);
    const root = F.cmov(tv1, tv2, e3);
    assertIsSquare(F, root, n);
    return root;
  });
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  aoddModulus(P, "tonelliShanks");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    const F = Fp;
    if (F.is0(n))
      return n;
    if (FpLegendre(F, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = F.mul(F.ONE, cc);
    let t = F.pow(n, Q);
    let R = F.pow(n, Q1div2);
    while (!F.eql(t, F.ONE)) {
      if (F.is0(t))
        throw new Error("Cannot find square root: probably non-prime P");
      let i = 1;
      let t_tmp = F.sqr(t);
      while (!F.eql(t_tmp, F.ONE)) {
        i++;
        t_tmp = F.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = F.pow(c, exponent);
      M = i;
      c = F.sqr(b);
      t = F.mul(t, c);
      R = F.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  aoddModulus(P, "Fp.sqrt");
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
function validateField(field) {
  aobject2(field, "field");
  if (typeof field.ORDER !== "bigint")
    throw new TypeError('param "ORDER" is invalid: expected bigint, got ' + typeof field.ORDER);
  asafenumber(field.BYTES, "BYTES");
  asafenumber(field.BITS, "BITS");
  for (const name of FIELD_FIELDS)
    afunction(field[name], "field." + name);
  if (field.BYTES < 1 || field.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (field.ORDER <= _1n2)
    throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
  return field;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  validateField(Fp);
  aarray(nums, "nums");
  abool(passZero, "passZero");
  const F = Fp;
  const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (F.is0(num))
      return acc;
    inverted[i] = acc;
    return F.mul(acc, num);
  }, F.ONE);
  const invertedAcc = F.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (F.is0(num))
      return acc;
    inverted[i] = F.mul(acc, inverted[i]);
    return F.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  validateField(Fp);
  const F = Fp;
  aoddModulus(F.ORDER, "FpLegendre");
  const p1mod2 = (F.ORDER - _1n2) / _2n;
  const powered = F.pow(n, p1mod2);
  const yes = F.eql(powered, F.ONE);
  const zero = F.eql(powered, F.ZERO);
  const no = F.eql(powered, F.neg(F.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber2(nBitLength);
  if (n <= _0n2)
    throw new Error("invalid n length: expected positive n, got " + n);
  if (nBitLength !== void 0 && nBitLength < 1)
    throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
  const bits = bitLen(n);
  if (nBitLength !== void 0 && nBitLength < bits)
    throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, opts = {}) {
  Object.freeze(_Field.prototype);
  return new _Field(ORDER, opts);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  if (fieldOrder <= _1n2)
    throw new Error("field order must be greater than 1");
  const bitLength = bitLen(fieldOrder - _1n2);
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length2 = getFieldBytesLength(fieldOrder);
  return length2 + Math.ceil(length2 / 2);
}
function mapHashToField(key, fieldOrder, isLE = false) {
  abytes4(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = Math.max(getMinHashLength(fieldOrder), 16);
  if (len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n2, _1n2, _2n, _3n, _4n, _5n, _7n, _8n, _9n, _15n, _16n, POW_WINDOWED_MIN, FIELD_FIELDS, FIELD_SQRT, _Field;
var init_modular = __esm({
  "node_modules/@noble/curves/abstract/modular.js"() {
    init_utils5();
    _0n2 = /* @__PURE__ */ BigInt(0);
    _1n2 = /* @__PURE__ */ BigInt(1);
    _2n = /* @__PURE__ */ BigInt(2);
    _3n = /* @__PURE__ */ BigInt(3);
    _4n = /* @__PURE__ */ BigInt(4);
    _5n = /* @__PURE__ */ BigInt(5);
    _7n = /* @__PURE__ */ BigInt(7);
    _8n = /* @__PURE__ */ BigInt(8);
    _9n = /* @__PURE__ */ BigInt(9);
    _15n = /* @__PURE__ */ BigInt(15);
    _16n = /* @__PURE__ */ BigInt(16);
    POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
    FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
    FIELD_SQRT = /* @__PURE__ */ new WeakMap();
    _Field = class {
      ORDER;
      BITS;
      BYTES;
      isLE;
      ZERO = _0n2;
      ONE = _1n2;
      _lengths;
      _mod;
      constructor(ORDER, opts = {}) {
        if (ORDER <= _1n2)
          throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
        let _nbitLength = void 0;
        this.isLE = false;
        if (opts != null && typeof opts === "object") {
          if (typeof opts.BITS === "number")
            _nbitLength = opts.BITS;
          if (typeof opts.sqrt === "function")
            Object.defineProperty(this, "sqrt", { value: opts.sqrt, enumerable: true });
          if (typeof opts.isLE === "boolean")
            this.isLE = opts.isLE;
          if (opts.allowedLengths)
            this._lengths = Object.freeze(opts.allowedLengths.slice());
          if (typeof opts.modFromBytes === "boolean")
            this._mod = opts.modFromBytes;
        }
        const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
        if (nByteLength > 2048)
          throw new Error("invalid field: expected ORDER of <= 2048 bytes");
        this.ORDER = ORDER;
        this.BITS = nBitLength;
        this.BYTES = nByteLength;
        Object.freeze(this);
      }
      create(num) {
        return mod(num, this.ORDER);
      }
      isValid(num) {
        if (typeof num !== "bigint")
          throw new TypeError("invalid field element: expected bigint, got " + typeof num);
        return _0n2 <= num && num < this.ORDER;
      }
      is0(num) {
        return num === _0n2;
      }
      // is valid and invertible
      isValidNot0(num) {
        return !this.is0(num) && this.isValid(num);
      }
      isOdd(num) {
        return (num & _1n2) === _1n2;
      }
      neg(num) {
        return mod(-num, this.ORDER);
      }
      eql(lhs, rhs) {
        return lhs === rhs;
      }
      sqr(num) {
        return mod(num * num, this.ORDER);
      }
      add(lhs, rhs) {
        return mod(lhs + rhs, this.ORDER);
      }
      sub(lhs, rhs) {
        return mod(lhs - rhs, this.ORDER);
      }
      mul(lhs, rhs) {
        return mod(lhs * rhs, this.ORDER);
      }
      pow(num, power) {
        return pow(num, power, this.ORDER);
      }
      div(lhs, rhs) {
        return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
      }
      // Same as above, but doesn't normalize
      sqrN(num) {
        return num * num;
      }
      addN(lhs, rhs) {
        return lhs + rhs;
      }
      subN(lhs, rhs) {
        return lhs - rhs;
      }
      mulN(lhs, rhs) {
        return lhs * rhs;
      }
      inv(num) {
        return invert(num, this.ORDER);
      }
      sqrt(num) {
        let sqrt = FIELD_SQRT.get(this);
        if (!sqrt)
          FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
        return sqrt(this, num);
      }
      toBytes(num) {
        return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
      }
      fromBytes(bytes, skipValidation = false) {
        abytes4(bytes);
        const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
        if (allowedLengths) {
          if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
            throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
          }
          const padded = new Uint8Array(BYTES);
          padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
          bytes = padded;
        }
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
        if (modFromBytes)
          scalar = mod(scalar, ORDER);
        if (!skipValidation) {
          if (!this.isValid(scalar))
            throw new Error("invalid field element: outside of range 0..ORDER");
        }
        return scalar;
      }
      // TODO: we don't need it here, move out to separate fn
      invertBatch(lst) {
        return FpInvertBatch(this, lst, true);
      }
      // We can't move this out because Fp6, Fp12 implement it
      // and it's unclear what to return in there.
      cmov(a, b, condition) {
        abool(condition, "condition");
        return condition ? b : a;
      }
    };
  }
});

// node_modules/@noble/curves/abstract/curve.js
function validatePointCons(Point2) {
  const pc = Point2;
  if (typeof pc !== "function")
    throw new TypeError('"Point" expected constructor, got type=' + typeof Point2);
  afunction(pc.fromAffine, "Point.fromAffine");
  afunction(pc.fromBytes, "Point.fromBytes");
  afunction(pc.fromHex, "Point.fromHex");
  aobject2(pc.BASE, "Point.BASE");
  aobject2(pc.ZERO, "Point.ZERO");
  validateField(pc.Fp);
  validateField(pc.Fn);
}
function normalizeZ(c, points) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits, min = 1) {
  if (!Number.isSafeInteger(W) || W < min || W > bits)
    throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
}
function validateTableBytes(numPoints, fpBytes) {
  const bytes = numPoints * (4 * fpBytes + 128);
  if (bytes > TABLE_BYTES_MAX)
    throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
}
function probeRandomBytes(randomBytes3, length2) {
  if (randomBytes3 === void 0)
    return void 0;
  afunction(randomBytes3, "randomBytes");
  try {
    const probe = randomBytes3(length2);
    if (!isBytes4(probe) || probe.length !== length2)
      return void 0;
  } catch {
    return void 0;
  }
  return randomBytes3;
}
function validateMSMPoints(points, c) {
  aarray(points, "points");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field, maxScalar) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    const ok = maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar;
    if (!ok)
      throw new Error("invalid scalar at index " + i);
  });
}
function getWindowSize(P) {
  return pointWindowSizes.get(P) || 1;
}
function oddMultiples(p, size) {
  const dbl = p.double();
  const t = [p];
  for (let j = 1; j < size; j++)
    t.push(t[j - 1].add(dbl));
  return t;
}
function wnafDigits(n, W) {
  const size = 2 ** W;
  const half = size / 2;
  const mask = BigInt(size - 1);
  const d = [];
  while (n > _0n3) {
    let w = 0;
    if (n & _1n3) {
      w = Number(n & mask);
      if (w >= half)
        w -= size;
      n -= BigInt(w);
    }
    d.push(w);
    n >>= _1n3;
  }
  return d;
}
function signedWindowDigits(n, W, windows) {
  const size = 2 ** W;
  const half = size / 2;
  const mask = BigInt(size - 1);
  const shiftBy = BigInt(W);
  const d = [];
  for (let w = 0; w < windows; w++) {
    let v = Number(n & mask);
    n >>= shiftBy;
    if (v > half) {
      v -= size;
      n += _1n3;
    }
    d.push(v);
  }
  if (n !== _0n3)
    throw new Error("invalid wnaf");
  return d;
}
function wnafWalk(zero, tables, digits) {
  let max = 0;
  for (const d of digits)
    max = Math.max(max, d.length);
  let acc = zero;
  for (let bit = max - 1; bit >= 0; bit--) {
    if (bit !== max - 1)
      acc = acc.double();
    for (let i = 0; i < digits.length; i++) {
      const w = digits[i][bit];
      if (w) {
        const item = tables[i][Math.abs(w) - 1 >> 1];
        acc = acc.add(w < 0 ? item.negate() : item);
      }
    }
  }
  return acc;
}
function mulAddUnsafe(c, points, scalars, allowOversized = false) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  abool(allowOversized, "allowOversized");
  validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n2 : void 0);
  if (points.length !== scalars.length)
    throw new Error("arrays of points and scalars must have equal length");
  const tables = points.map((p) => oddMultiples(p, 4));
  const digits = scalars.map((n) => wnafDigits(n, 4));
  return wnafWalk(c.ZERO, tables, digits);
}
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE });
  }
}
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (type !== "weierstrass" && type !== "edwards")
    throw new Error('expected curve type "weierstrass" or "edwards"');
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  validateObject(curveOpts);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(isPosBig(val) && val !== _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn: Fn2 };
}
function createKeygen(randomSecretKey, getPublicKey) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  };
}
var _0n3, _1n3, _4n2, BLIND_BYTES, BLIND_BITS, FW_WINDOW, TABLE_BYTES_MAX, pointWindowSizes, ScalarMultiplier;
var init_curve = __esm({
  "node_modules/@noble/curves/abstract/curve.js"() {
    init_utils5();
    init_modular();
    _0n3 = /* @__PURE__ */ BigInt(0);
    _1n3 = /* @__PURE__ */ BigInt(1);
    _4n2 = /* @__PURE__ */ BigInt(4);
    BLIND_BYTES = 16;
    BLIND_BITS = 128;
    FW_WINDOW = 5;
    TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
    pointWindowSizes = /* @__PURE__ */ new WeakMap();
    ScalarMultiplier = class {
      Point;
      BASE;
      ZERO;
      randomBytes;
      wnafPrecomputes = /* @__PURE__ */ new WeakMap();
      baseCanBeBlinded;
      bits;
      // Parametrized with a given Point class (not individual point)
      constructor(Point2, randomBytes3) {
        validatePointCons(Point2);
        this.randomBytes = probeRandomBytes(randomBytes3, BLIND_BYTES);
        this.Point = Point2;
        this.BASE = Point2.BASE;
        this.ZERO = Point2.ZERO;
        this.bits = Point2.Fn.BITS;
      }
      /**
       * Creates a signed fixed-window wNAF precomputation table: for every window w, the
       * multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
       * so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
       * window absorbs the final carry of signed-digit recoding.
       * For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
       * @param point - Point instance
       * @param W - window size
       * @param bits - scalar bitlength the table must cover
       */
      buildWnafTable(point, W, bits) {
        const windows = Math.ceil(bits / W) + 1;
        const half = 2 ** (W - 1);
        const comp = [];
        let base2 = point;
        for (let w = 0; w < windows; w++) {
          let acc = base2;
          for (let i = 0; i < half; i++) {
            comp.push(acc);
            acc = acc.add(base2);
          }
          base2 = comp[comp.length - 1].double();
        }
        return { W, bits, windows, comp };
      }
      /**
       * Implements ec multiplication using precomputed signed fixed-window wNAF tables.
       * Constant-time: fixed window count with one table addition per window — zero digits feed
       * the fake accumulator — and no doublings; the lookup scans the whole window slice.
       * Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
       * {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
       * signedWindowDigits throws if `n` exceeds the table.
       * @returns real and fake (for const-time) points
       */
      wnafCachedCT(precomputes, n) {
        const { W, windows, comp } = precomputes;
        const half = 2 ** (W - 1);
        const digits = signedWindowDigits(n, W, windows);
        let p = this.ZERO;
        let f = this.BASE;
        for (let w = 0; w < windows; w++) {
          const digit = digits[w];
          const start = w * half;
          const idx = Math.abs(digit) - 1;
          let sel = comp[start];
          for (let i = 1; i < half; i++)
            sel = i === idx ? comp[start + i] : sel;
          const neg = sel.negate();
          if (digit === 0)
            f = f.add(comp[start]);
          else
            p = p.add(digit < 0 ? neg : sel);
        }
        return { p, f };
      }
      // Cache key is point identity plus (W, bits); at most two entries exist per point (public-width
      // `Fn.BITS` and blinded `Fn.BITS + BLIND_BITS`). Callers must not reuse the same point with
      // incompatible `transform(...)` layouts and expect a separate cache entry.
      getWnafPrecomputes(W, point, bits, transform) {
        let entries = this.wnafPrecomputes.get(point);
        let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
        if (!comp) {
          comp = this.buildWnafTable(point, W, bits);
          if (typeof transform === "function")
            comp = { ...comp, comp: transform(comp.comp) };
          if (!entries) {
            entries = [];
            this.wnafPrecomputes.set(point, entries);
          }
          entries.push(comp);
        }
        return comp;
      }
      assertPoint(point) {
        if (!(point instanceof this.Point))
          throw new TypeError('"point" expected Point instance, got type=' + typeof point);
      }
      // Shared prologue of the constant-time entry points. Rejects scalar 0: in key/signature-style
      // callers a zero scalar means broken upstream plumbing, and concrete Points already reject it.
      // Uses inRange instead of Fn.isValidNot0: validateField() only certifies the arithmetic subset.
      validateMulInput(point, scalar) {
        this.assertPoint(point);
        if (!inRange(scalar, _1n3, this.Point.Fn.ORDER))
          throw new Error("invalid scalar");
      }
      // Constant-time dispatch shared by mulCT / mulCTBlinded. Un-precomputed points (W===1, e.g.
      // ECDH peer keys) skip building a throwaway cached table in favor of a small fixed-window
      // multiply. `n` must be < 2^bits.
      runCT(point, n, bits, transform) {
        const W = getWindowSize(point);
        if (W === 1)
          return this.fixedWindowCT(point, n, bits);
        return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
      }
      mulCT(point, scalar, transform) {
        this.validateMulInput(point, scalar);
        return this.runCT(point, scalar, this.bits, transform);
      }
      mulCTBlinded(point, scalar, transform) {
        this.validateMulInput(point, scalar);
        if (this.randomBytes === void 0)
          throw new Error("randomBytes is required for scalar blinding");
        const bits = this.Point.Fn.BITS + BLIND_BITS;
        const blind = this.randomBytes(BLIND_BYTES);
        if (!isBytes4(blind) || blind.length !== BLIND_BYTES)
          throw new Error("randomBytes returned invalid byte array");
        blind[0] = blind[0] & 63 | 128;
        const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
        return this.runCT(point, n, bits, transform);
      }
      /**
       * Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
       * A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
       * far cheaper to build for a single use. The point-operation sequence is independent of `n`:
       * build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
       * every table entry, and one addition (adds the identity when the window digit is 0 — never
       * skipped).
       *
       * `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
       * add), which holds for the Weierstrass/Edwards point types used here. The table is left in
       * projective form (no normalizeZ): normalizing this small a table costs more than the
       * mixed-add savings it would buy for a single multiply.
       * @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
       * (this path needs no fake accumulator — its op-count is already scalar-independent).
       */
      fixedWindowCT(point, n, bits) {
        const W = FW_WINDOW;
        const size = 1 << W;
        const mask = bitMask(W);
        const table = new Array(size);
        table[0] = this.ZERO;
        for (let i = 1; i < size; i++)
          table[i] = table[i - 1].add(point);
        const windows = Math.ceil(bits / W);
        let acc = this.ZERO;
        for (let window = windows - 1; window >= 0; window--) {
          if (window !== windows - 1)
            for (let d = 0; d < W; d++)
              acc = acc.double();
          const digit = Number(n >> BigInt(window * W) & mask);
          let sel = table[0];
          for (let i = 1; i < size; i++)
            sel = i === digit ? table[i] : sel;
          acc = acc.add(sel);
        }
        return { p: acc, f: acc };
      }
      shouldBlind(point, cofactor) {
        if (this.randomBytes === void 0)
          return false;
        if (cofactor === _1n3)
          return true;
        if (point !== this.BASE)
          return false;
        if (this.baseCanBeBlinded === void 0)
          this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
        return this.baseCanBeBlinded;
      }
      mulSecret(point, scalar, cofactor, transform) {
        return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
      }
      mulUnsafe(point, scalar, transform) {
        this.assertPoint(point);
        if (!isPosBig(scalar))
          throw new Error("invalid scalar");
        const W = getWindowSize(point);
        if (W === 1 || scalar >= this.Point.Fn.ORDER)
          return mulAddUnsafe(this.Point, [point], [scalar], true);
        const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
        return this.wnafCachedCT(precomputes, scalar).p;
      }
      // Remembers the window size used for precomputed wNAF multiplication of the given point
      // and drops any previously built tables. Usually only the base point is precomputed.
      // W=1 resets the point to the un-precomputed (table-less) paths.
      // W is additionally capped so tables stay under ~2 GiB ({@link TABLE_BYTES_MAX}).
      setWindowSize(point, W) {
        this.assertPoint(point);
        validateW(W, this.bits);
        const windows = Math.ceil((this.bits + BLIND_BITS) / W) + 1;
        validateTableBytes(windows * 2 ** (W - 1), this.Point.Fp.BYTES);
        pointWindowSizes.set(point, W);
        this.wnafPrecomputes.delete(point);
      }
      // True when a window size is set: tables themselves are built lazily on first multiply.
      hasWindowSize(point) {
        return getWindowSize(point) !== 1;
      }
    };
  }
});

// node_modules/@noble/curves/abstract/der.js
var _0n4, DERErr, _DER, DER;
var init_der = __esm({
  "node_modules/@noble/curves/abstract/der.js"() {
    init_utils5();
    _0n4 = /* @__PURE__ */ BigInt(0);
    DERErr = class extends Error {
      constructor(m = "") {
        super(m);
      }
    };
    _DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = _DER;
          asafenumber(tag, "tag");
          if (tag < 0 || tag > 255)
            throw new E("tlv.encode: wrong tag");
          astring(data, "data");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = _DER;
          data = abytes4(data, void 0, "DER data");
          let pos = 0;
          if (tag < 0 || tag > 255)
            throw new E("tlv.decode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length2 = 0;
          if (!isLong)
            length2 = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length2 = length2 << 8 | b;
            pos += lenLen;
            if (length2 < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length2);
          if (v.length !== length2)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length2) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E } = _DER;
          abignumber(num);
          if (num < _0n4)
            throw new E("integer: negative integers are not allowed");
          let hex2 = numberToHexUnpadded(num);
          if (Number.parseInt(hex2[0], 16) & 8)
            hex2 = "00" + hex2;
          if (hex2.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex2;
        },
        decode(data) {
          const { Err: E } = _DER;
          if (data.length < 1)
            throw new E("invalid signature integer: empty");
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data.length > 1 && data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return bytesToNumberBE(data);
        }
      },
      toSig(bytes, maxScalarBytes) {
        const { Err: E, _int: int, _tlv: tlv } = _DER;
        if (maxScalarBytes !== void 0) {
          asafenumber(maxScalarBytes, "maxScalarBytes");
          if (maxScalarBytes < 1)
            throw new E("invalid signature: maxScalarBytes must be positive");
        }
        const data = abytes4(bytes, void 0, "signature");
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        if (maxScalarBytes !== void 0 && (rBytes.length > maxScalarBytes || sBytes.length > maxScalarBytes))
          throw new E("invalid signature: integer too large");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = _DER;
        validateObject(sig, { r: "bigint", s: "bigint" }, {}, "sig");
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    DER = /* @__PURE__ */ (() => {
      Object.freeze(_DER._tlv);
      Object.freeze(_DER._int);
      return Object.freeze(_DER);
    })();
  }
});

// node_modules/@noble/curves/abstract/weierstrass.js
function _splitEndoScalar(k, basis, n) {
  aInRange("scalar", k, _0n5, n);
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n5;
  const k2neg = k2 < _0n5;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
  if (k1 < _0n5 || k1 >= MAX_NUM || k2 < _0n5 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed for k");
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  validateObject(opts);
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const Fp = validated.Fp;
  const Fn2 = validated.Fn;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    randomBytes: "function"
  });
  const { endo: endoOpts, allowInfinityPoint, clearCofactor, isTorsionFree, fromBytes, toBytes: toBytes3 } = extraOpts;
  const randomBytes3 = extraOpts.randomBytes === void 0 ? randomBytes2 : extraOpts.randomBytes;
  if (endoOpts) {
    if (!Fp.is0(CURVE.a) || typeof endoOpts.beta !== "bigint" || !Array.isArray(endoOpts.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const endo = endoOpts ? {
    beta: endoOpts.beta,
    basises: endoOpts.basises.map((basis) => [...basis])
  } : void 0;
  const lengths = getWLengths(Fp, Fn2);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes(_c, point, isCompressed) {
    if (point.is0()) {
      if (!allowInfinityPoint)
        throw new Error("bad point: ZERO");
      return Uint8Array.of(0);
    }
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes2(pprefix(hasEvenY), bx);
    } else {
      return concatBytes2(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    abytes4(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length2 = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (allowInfinityPoint && length2 === 1 && head === 0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (length2 === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY)
        y = Fp.neg(y);
      return { x, y };
    } else if (length2 === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length2}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = toBytes3 === void 0 ? pointToBytes : toBytes3;
  const decodePoint = fromBytes === void 0 ? pointFromBytes : fromBytes;
  const b3 = Fp.mul(CURVE.b, _3n2);
  const mulA = Fp.is0(CURVE.a) ? (_) => Fp.ZERO : (x) => Fp.mul(CURVE.a, x);
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n3);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return typeof n === "object" && n !== null ? Fp.create(n) : n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point2))
      throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn2.ORDER);
  }
  function pushWnafPair(points, scalars, p, k) {
    if (!Fn2.isValid(k))
      throw new RangeError("invalid scalar: out of range");
    if (endo) {
      const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(k);
      const psi = new Point2(Fp.mul(p.X, endo.beta), p.Y, p.Z);
      points.push(k1neg ? p.negate() : p, k2neg ? psi.negate() : psi);
      scalars.push(k1, k2);
    } else {
      points.push(p);
      scalars.push(k);
    }
  }
  const validityCache = /* @__PURE__ */ new WeakSet();
  class Point2 {
    static BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp.ONE);
    static ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
    static Fp = Fp;
    static Fn = Fn2;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point2.ZERO;
      return new Point2(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point2.fromAffine(decodePoint(abytes4(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex2) {
      return Point2.fromBytes(hexToBytes2(hex2));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * @param isLazy - true will defer table computation until the first multiplication
     */
    precompute(windowSize = 6, isLazy = true) {
      wnaf.setWindowSize(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      const p = this;
      if (p.is0()) {
        if (allowInfinityPoint && Fp.is0(p.X) && Fp.eql(p.Y, Fp.ONE) && Fp.is0(p.Z))
          return;
        throw new Error("bad point: ZERO");
      }
      if (validityCache.has(p))
        return;
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      validityCache.add(p);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point2(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = mulA(Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = mulA(t2);
      t3 = Fp.sub(t0, t2);
      t3 = mulA(t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point2(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = mulA(t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = mulA(t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = mulA(t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point2(X3, Y3, Z3);
    }
    subtract(other) {
      aprjpoint(other);
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses precomputed tables (signed fixed-window wNAF) when available.
     * Uses scalar blinding and avoids endomorphism splitting in the secret-scalar path.
     * @param scalar - by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      if (!Fn2.isValidNot0(scalar))
        throw new RangeError("invalid scalar: out of range");
      const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize2);
      return normalize2([p, f])[0];
    }
    /**
     * Non-constant-time multiplication. Uses width-4 wNAF with GLV endomorphism splitting
     * when available (two half-width scalars sharing one halved doubling chain).
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(scalar) {
      const p = this;
      const sc = scalar;
      if (!Fn2.isValid(sc))
        throw new RangeError("invalid scalar: out of range");
      if (sc === _0n5 || p.is0())
        return Point2.ZERO;
      if (sc === _1n4)
        return p;
      if (wnaf.hasWindowSize(this))
        return wnaf.mulUnsafe(p, sc, normalize2);
      const points = [];
      const scalars = [];
      pushWnafPair(points, scalars, p, sc);
      return mulAddUnsafe(Point2, points, scalars);
    }
    /**
     * Non-constant-time double-scalar multiplication `a⋅this + b⋅other` (Strauss–Shamir).
     * Both walks share one doubling chain via {@link mulAddUnsafe}, and GLV endomorphism
     * (when available) halves the chain again by splitting each scalar into two half-width
     * parts. Used by ECDSA verification and public-key recovery for `R = u1⋅G + u2⋅P`.
     * Only for public scalars.
     */
    mulAddUnsafe(a, other, b) {
      aprjpoint(other);
      const points = [];
      const scalars = [];
      pushWnafPair(points, scalars, this, a);
      pushWnafPair(points, scalars, other, b);
      return mulAddUnsafe(Point2, points, scalars);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * (X, Y, Z) ∋ (x=X/Z, y=Y/Z).
     * @param invertedZ - Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      const p = this;
      let iz = invertedZ;
      if (iz != null && !Fp.isValid(iz))
        throw new RangeError('"invertedZ" expected valid field element');
      const { X, Y, Z } = p;
      if (Fp.eql(Z, Fp.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(Z);
      const x = Fp.mul(X, iz);
      const y = Fp.mul(Y, iz);
      const zz = Fp.mul(Z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point2, this);
      return wnaf.mulUnsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point2, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      if (cofactor === _1n4)
        return this.is0();
      return this.clearCofactor().is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point2, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex2(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const normalize2 = (points) => normalizeZ(Point2, points);
  const wnaf = new ScalarMultiplier(Point2, randomBytes3);
  if (wnaf.bits >= 6)
    Point2.BASE.precompute(6);
  Object.freeze(Point2.prototype);
  Object.freeze(Point2);
  return Point2;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn2) {
  return {
    secretKey: Fn2.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    // Raw compact `(r || s)` signature width; DER and recovered signatures use
    // different lengths outside this helper.
    signature: 2 * Fn2.BYTES
  };
}
function ecdh(Point2, ecdhOpts = {}) {
  validatePointCons(Point2);
  const { Fn: Fn2 } = Point2;
  const randomBytes_ = ecdhOpts.randomBytes === void 0 ? randomBytes2 : ecdhOpts.randomBytes;
  const lengths = Object.assign(getWLengths(Point2.Fp, Fn2), {
    seed: Math.max(getMinHashLength(Fn2.ORDER), 16)
  });
  function isValidSecretKey(secretKey) {
    try {
      const num = Fn2.fromBytes(secretKey);
      return Fn2.isValidNot0(num);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !Point2.fromBytes(publicKey).is0();
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey(seed) {
    seed = seed === void 0 ? randomBytes_(lengths.seed) : seed;
    return mapHashToField(abytes4(seed, lengths.seed, "seed"), Fn2.ORDER);
  }
  function getPublicKey(secretKey, isCompressed = true) {
    return Point2.BASE.multiply(Fn2.fromBytes(secretKey)).toBytes(isCompressed);
  }
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    const allowedLengths = Fn2._lengths;
    if (!isBytes4(item))
      return void 0;
    const l = abytes4(item, void 0, "key").length;
    const isPub = l === publicKey || l === publicKeyUncompressed;
    const isSec = l === secretKey || !!allowedLengths?.includes(l);
    if (isPub && isSec)
      return void 0;
    return isPub;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = Fn2.fromBytes(secretKeyA);
    const b = Point2.fromBytes(publicKeyB);
    if (b.is0())
      throw new Error("invalid public key: point at infinity");
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey);
  Object.freeze(utils);
  Object.freeze(lengths);
  return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point: Point2, utils, lengths });
}
function ecdsa(Point2, hash, ecdsaOpts = {}) {
  validatePointCons(Point2);
  const hash_ = hash;
  ahash(hash_);
  validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  const opts = Object.assign({}, ecdsaOpts);
  const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
  const hmac2 = opts.hmac === void 0 ? (key, msg) => hmac(hash_, key, msg) : opts.hmac;
  const { Fp, Fn: Fn2 } = Point2;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn2;
  const blindLength = getMinHashLength(CURVE_ORDER);
  const csprng = probeRandomBytes(randomBytes3, blindLength);
  const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point2, opts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof opts.lowS === "boolean" ? opts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeRecoveryLifts = CURVE_ORDER * _2n2 + _1n4 < Fp.ORDER;
  function isBiggerThanHalfOrder(number3) {
    const HALF = CURVE_ORDER >> _1n4;
    return number3 > HALF;
  }
  function validateRS(title, num) {
    if (!Fn2.isValidNot0(num))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num;
  }
  function assertFieldSignIsSupported() {
    if (!Fp.isOdd)
      throw new Error("Field doesn't support isOdd");
  }
  function getRecoveryBit(x, y, r) {
    assertFieldSignIsSupported();
    return (x === r ? 0 : 2) | Number(Fp.isOdd(y));
  }
  function assertRecoverableCurve() {
    if (hasLargeRecoveryLifts)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size = lengths.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return abytes4(bytes, sizer);
  }
  class Signature {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertRecoverableCurve();
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts.format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        if (bytes.length > 2 * Fn2.BYTES + 16)
          throw new DER.Err("invalid signature: DER signature too long");
        const { r: r2, s: s2 } = DER.toSig(abytes4(bytes), Fn2.BYTES + 1);
        return new Signature(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn2.fromBytes(r), Fn2.fromBytes(s), recid);
    }
    static fromHex(hex2, format) {
      return this.fromBytes(hexToBytes2(hex2), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null)
        throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    // Unlike the top-level helper below, this method expects a digest that has
    // already been hashed to the curve's message representative.
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point2.fromBytes(concatBytes2(pprefix((recovery & 1) === 0), x));
      const ir = Fn2.inv(radj);
      const h = bits2int_modN(abytes4(messageHash, void 0, "msgHash"));
      const u1 = Fn2.create(-h * ir);
      const u2 = Fn2.create(s * ir);
      const Q = Point2.BASE.mulAddUnsafe(u1, R, u2);
      if (Q.is0())
        throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der")
        return hexToBytes2(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn2.toBytes(r);
      const sb = Fn2.toBytes(s);
      if (format === "recovered") {
        assertRecoverableCurve();
        return concatBytes2(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes2(rb, sb);
    }
    toHex(format) {
      return bytesToHex2(this.toBytes(format));
    }
  }
  Object.freeze(Signature.prototype);
  Object.freeze(Signature);
  const bits2int = opts.bits2int === void 0 ? function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num >> BigInt(delta) : num;
  } : opts.bits2int;
  const bits2int_modN = opts.bits2int_modN === void 0 ? function bits2int_modN_def(bytes) {
    return Fn2.create(bits2int(bytes));
  } : opts.bits2int_modN;
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num) {
    aInRange("num < 2^" + fnBits, num, _0n5, ORDER_MASK);
    return Fn2.toBytes(num);
  }
  function validateMsgAndHash(message, prehash) {
    abytes4(message, void 0, "message");
    return prehash ? abytes4(hash_(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, secretKey, opts2) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts2, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d = Fn2.fromBytes(secretKey);
    if (!Fn2.isValidNot0(d))
      throw new Error("invalid private key");
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes4(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn2.isValidNot0(k))
        return;
      const q = Point2.BASE.multiply(k).toAffine();
      const r = Fn2.create(q.x);
      if (r === _0n5)
        return;
      let s;
      if (csprng !== void 0) {
        const b = bytesToNumberBE(mapHashToField(csprng(blindLength), CURVE_ORDER));
        const ibk = Fn2.inv(Fn2.mul(b, k));
        const bm = Fn2.mul(b, m);
        const bd = Fn2.mul(b, d);
        s = Fn2.create(ibk * Fn2.create(bm + bd * r));
      } else {
        const ik = invertCt(k, CURVE_ORDER);
        s = Fn2.create(ik * Fn2.create(m + r * d));
      }
      if (s === _0n5)
        return;
      let recovery = getRecoveryBit(q.x, q.y, r);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn2.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, hasLargeRecoveryLifts ? void 0 : recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts2 = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts2);
    const drbg = createHmacDrbg(hash_.outputLen, Fn2.BYTES, hmac2);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts2.format);
  }
  function verify(signature2, message, publicKey, opts2 = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts2, defaultSigOpts);
    publicKey = abytes4(publicKey, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes4(signature2)) {
      const end = signature2 instanceof Signature ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature2, format);
    try {
      const sig = Signature.fromBytes(signature2, format);
      const P = Point2.fromBytes(publicKey);
      if (P.is0())
        return false;
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is2 = Fn2.inv(s);
      const u1 = Fn2.create(h * is2);
      const u2 = Fn2.create(r * is2);
      const R = Point2.BASE.mulAddUnsafe(u1, P, u2);
      if (R.is0())
        return false;
      const q = R.toAffine();
      const v = Fn2.create(q.x);
      if (v !== r)
        return false;
      if (format === "recovered" && sig.recovery !== getRecoveryBit(q.x, q.y, r))
        return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature2, message, opts2 = {}) {
    const { prehash } = validateSigOpts(opts2, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature2, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey,
    getSharedSecret,
    utils,
    lengths,
    Point: Point2,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash: hash_
  });
}
var divNearest, _0n5, _1n4, _2n2, _3n2, _4n3;
var init_weierstrass = __esm({
  "node_modules/@noble/curves/abstract/weierstrass.js"() {
    init_hmac();
    init_utils4();
    init_utils5();
    init_curve();
    init_der();
    init_modular();
    divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n2) / den;
    _0n5 = /* @__PURE__ */ BigInt(0);
    _1n4 = /* @__PURE__ */ BigInt(1);
    _2n2 = /* @__PURE__ */ BigInt(2);
    _3n2 = /* @__PURE__ */ BigInt(3);
    _4n3 = /* @__PURE__ */ BigInt(4);
  }
});

// node_modules/@noble/curves/secp256k1.js
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n3, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n3, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var secp256k1_CURVE, secp256k1_ENDO, _2n3, Fpk1, Pointk1, secp256k1;
var init_secp256k1 = __esm({
  "node_modules/@noble/curves/secp256k1.js"() {
    init_sha23();
    init_modular();
    init_weierstrass();
    secp256k1_CURVE = {
      p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
      n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
      h: BigInt(1),
      a: BigInt(0),
      b: BigInt(7),
      Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
      Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
    };
    secp256k1_ENDO = {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      basises: [
        [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
        [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
      ]
    };
    _2n3 = /* @__PURE__ */ BigInt(2);
    Fpk1 = /* @__PURE__ */ Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
    Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
      Fp: Fpk1,
      endo: secp256k1_ENDO
    });
    secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha2565);
  }
});

// node_modules/@noble/hashes/legacy.js
function ripemd_f2(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
var Rho1602, Id1602, Pi1602, idxLR2, idxL2, idxR2, shifts1602, shiftsL1602, shiftsR1602, Kl1602, Kr1602, BUF_1602, _RIPEMD160, ripemd1603;
var init_legacy2 = __esm({
  "node_modules/@noble/hashes/legacy.js"() {
    init_md3();
    init_utils4();
    Rho1602 = /* @__PURE__ */ Uint8Array.from([
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8
    ]);
    Id1602 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
    Pi1602 = /* @__PURE__ */ (() => Id1602.map((i) => (9 * i + 5) % 16))();
    idxLR2 = /* @__PURE__ */ (() => {
      const L = [Id1602];
      const R = [Pi1602];
      const res = [L, R];
      for (let i = 0; i < 4; i++)
        for (let j of res)
          j.push(j[i].map((k) => Rho1602[k]));
      return res;
    })();
    idxL2 = /* @__PURE__ */ (() => idxLR2[0])();
    idxR2 = /* @__PURE__ */ (() => idxLR2[1])();
    shifts1602 = /* @__PURE__ */ [
      [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
      [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
      [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
      [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
      [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
    ].map((i) => Uint8Array.from(i));
    shiftsL1602 = /* @__PURE__ */ idxL2.map((idx, i) => idx.map((j) => shifts1602[i][j]));
    shiftsR1602 = /* @__PURE__ */ idxR2.map((idx, i) => idx.map((j) => shifts1602[i][j]));
    Kl1602 = /* @__PURE__ */ Uint32Array.from([
      0,
      1518500249,
      1859775393,
      2400959708,
      2840853838
    ]);
    Kr1602 = /* @__PURE__ */ Uint32Array.from([
      1352829926,
      1548603684,
      1836072691,
      2053994217,
      0
    ]);
    BUF_1602 = /* @__PURE__ */ new Uint32Array(16);
    _RIPEMD160 = class extends HashMD3 {
      h0 = 1732584193 | 0;
      h1 = 4023233417 | 0;
      h2 = 2562383102 | 0;
      h3 = 271733878 | 0;
      h4 = 3285377520 | 0;
      constructor() {
        super(64, 20, 8, true);
      }
      get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
      }
      set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          BUF_1602[i] = view.getUint32(offset, true);
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        for (let group = 0; group < 5; group++) {
          const rGroup = 4 - group;
          const hbl = Kl1602[group], hbr = Kr1602[group];
          const rl = idxL2[group], rr = idxR2[group];
          const sl = shiftsL1602[group], sr = shiftsR1602[group];
          for (let i = 0; i < 16; i++) {
            const tl = rotl2(al + ripemd_f2(group, bl, cl, dl) + BUF_1602[rl[i]] + hbl, sl[i]) + el | 0;
            al = el, el = dl, dl = rotl2(cl, 10) | 0, cl = bl, bl = tl;
          }
          for (let i = 0; i < 16; i++) {
            const tr = rotl2(ar + ripemd_f2(rGroup, br, cr, dr) + BUF_1602[rr[i]] + hbr, sr[i]) + er | 0;
            ar = er, er = dr, dr = rotl2(cr, 10) | 0, cr = br, br = tr;
          }
        }
        this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
      }
      roundClean() {
        clean3(BUF_1602);
      }
      destroy() {
        this.destroyed = true;
        clean3(this.buffer);
        this.set(0, 0, 0, 0, 0);
      }
    };
    ripemd1603 = /* @__PURE__ */ createHasher3(() => new _RIPEMD160());
  }
});

// node_modules/@scure/base/index.js
function isBytes5(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abytes5(b) {
  if (!isBytes5(b))
    throw new TypeError("Uint8Array expected");
}
function afn(input) {
  if (typeof input !== "function")
    throw new TypeError("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new TypeError(`${label}: string expected`);
  return true;
}
function anumber3(n, title = "number") {
  if (typeof n !== "number")
    throw new TypeError(`${title}: expected number, got ${typeof n}`);
  if (!Number.isSafeInteger(n))
    throw new RangeError(`${title}: expected safe integer, got ${n}`);
}
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode20 = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode19 = args.map((x) => x.decode).reduce(wrap, id);
  return { encode: encode20, decode: decode19 };
}
function charcodesToString(codes) {
  const len = codes.length;
  if (asciiDecoder !== void 0 && len >= 12)
    return asciiDecoder.decode(codes);
  if (len <= B2S_CHUNK)
    return String.fromCharCode.apply(null, codes);
  let res = "";
  for (let i = 0; i < len; i += B2S_CHUNK)
    res += String.fromCharCode.apply(null, codes.subarray(i, i + B2S_CHUNK));
  return res;
}
function alphabet(letters, aliases) {
  const len = letters.length;
  if (len > 128)
    throw new Error("alphabet: max 128 letters");
  const encTable = new Uint8Array(len);
  const decTable = new Int8Array(128).fill(-1);
  for (let i = 0; i < len; i++) {
    const code = letters.charCodeAt(i);
    if (letters.codePointAt(i) !== code || code > 127)
      throw new Error("alphabet: single-char ASCII letters only");
    encTable[i] = code;
    decTable[code] = i;
  }
  if (aliases !== void 0) {
    for (const alias of Object.keys(aliases)) {
      const code = alias.charCodeAt(0);
      const target = decTable[aliases[alias].charCodeAt(0)];
      if (alias.length !== 1 || code > 127 || target === void 0 || target === -1)
        throw new Error(`alphabet: invalid alias ${alias}`);
      decTable[code] = target;
    }
  }
  return {
    encode: (digits) => {
      const codes = new Uint8Array(digits.length);
      for (let i = 0; i < digits.length; i++) {
        const d = digits[i];
        const code = encTable[d];
        if (code === void 0)
          throw new Error(`alphabet.encode: invalid digit ${d}`);
        codes[i] = code;
      }
      return charcodesToString(codes);
    },
    decode: (input) => {
      astr("decode", input);
      const slen = input.length;
      const digits = new Uint8Array(slen);
      for (let i = 0; i < slen; i++) {
        const code = input.charCodeAt(i);
        const digit = code < 128 ? decTable[code] : -1;
        if (digit === -1)
          throw new Error(`Unknown letter "${input[i]}". Allowed: ${letters}`);
        digits[i] = digit;
      }
      return digits;
    }
  };
}
function checksum(len, fn) {
  anumber3(len);
  if (len <= 0)
    throw new RangeError(`checksum length must be positive: ${len}`);
  afn(fn);
  const _fn = fn;
  return {
    encode(data) {
      abytes5(data);
      const sum = _fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      abytes5(data);
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = _fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var freeze, asciiDecoder, B2S_CHUNK, B58_GROUP, RADIX_BASE_N_MAX_LENGTH, BASE_N_MAX_BYTES, BASE_N_MAX_CHARS, radixBaseN, genBaseN, radix58, genBase58, base58, createBase58check;
var init_base2 = __esm({
  "node_modules/@scure/base/index.js"() {
    freeze = (fn) => Object.freeze(fn());
    asciiDecoder = /* @__PURE__ */ (() => {
      try {
        const decoder = new TextDecoder();
        return decoder.decode(Uint8Array.of(65, 48, 43, 127)) === "A0+\x7F" ? decoder : void 0;
      } catch (e) {
        return void 0;
      }
    })();
    B2S_CHUNK = 8192;
    B58_GROUP = 656356768;
    RADIX_BASE_N_MAX_LENGTH = 65536;
    BASE_N_MAX_BYTES = 2048;
    BASE_N_MAX_CHARS = 4096;
    radixBaseN = (BASE, GROUP) => ({
      encode: (bytes) => {
        abytes5(bytes);
        const blen = bytes.length;
        if (blen === 0)
          return new Uint8Array(0);
        if (blen >= RADIX_BASE_N_MAX_LENGTH)
          throw new Error("invalid length");
        let zeros = 0;
        while (zeros < blen - 1 && bytes[zeros] === 0)
          zeros++;
        const nlimbs = Math.ceil(blen / 2);
        const limbs = new Uint16Array(nlimbs);
        const odd = blen & 1;
        if (odd)
          limbs[0] = bytes[0];
        for (let i = odd, j2 = odd; i < blen; i += 2, j2++)
          limbs[j2] = bytes[i] << 8 | bytes[i + 1];
        const groups = [];
        let pos = 0;
        while (pos < nlimbs) {
          let carry = 0;
          for (let i = pos; i < nlimbs; i++) {
            const cur = carry * 65536 + limbs[i];
            const q = Math.floor(cur / GROUP);
            carry = cur - q * GROUP;
            limbs[i] = q;
            if (q === 0 && i === pos)
              pos++;
          }
          groups.push(carry);
        }
        const top = groups.length - 1;
        let sig = top * 5;
        for (let v = groups[top]; ; v = Math.floor(v / BASE)) {
          sig++;
          if (v < BASE)
            break;
        }
        const res = new Uint8Array(zeros + sig);
        let j = res.length - 1;
        for (let g = 0; g < top; g++) {
          let v = groups[g];
          for (let k = 0; k < 5; k++) {
            res[j--] = v % BASE;
            v = Math.floor(v / BASE);
          }
        }
        for (let v = groups[top]; j >= zeros; v = Math.floor(v / BASE))
          res[j--] = v % BASE;
        return res;
      },
      decode: (digits) => {
        abytes5(digits);
        const dlen = digits.length;
        if (dlen === 0)
          return new Uint8Array(0);
        if (dlen >= RADIX_BASE_N_MAX_LENGTH)
          throw new Error("invalid length");
        let zeros = 0;
        while (zeros < dlen - 1 && digits[zeros] === 0)
          zeros++;
        const limbs = new Uint16Array(Math.ceil(dlen * 6 / 16) + 1);
        let used = 0;
        let i = 0;
        let group = dlen % 5 || 5;
        while (i < dlen) {
          let gval = 0;
          let factor = 1;
          for (const end = i + group; i < end; i++) {
            const d = digits[i];
            if (d >= BASE)
              throw new Error(`invalid integer: ${d}`);
            gval = gval * BASE + d;
            factor *= BASE;
          }
          group = 5;
          let carry = gval;
          for (let k = 0; k < used; k++) {
            const cur = limbs[k] * factor + carry;
            carry = Math.floor(cur / 65536);
            limbs[k] = cur - carry * 65536;
          }
          for (; carry > 0; carry = Math.floor(carry / 65536))
            limbs[used++] = carry % 65536;
        }
        const valueBytes = used === 0 ? 1 : used * 2 - (limbs[used - 1] < 256 ? 1 : 0);
        const res = new Uint8Array(zeros + valueBytes);
        let j = res.length - 1;
        for (let k = 0; k < used; k++) {
          const limb = limbs[k];
          res[j--] = limb & 255;
          if (j >= zeros)
            res[j--] = limb >> 8;
        }
        return res;
      }
    });
    genBaseN = (radix, abc) => {
      const letters = alphabet(abc);
      return {
        encode(bytes) {
          abytes5(bytes);
          if (bytes.length > BASE_N_MAX_BYTES)
            throw new Error("invalid length");
          return letters.encode(radix.encode(bytes));
        },
        decode(str) {
          astr("baseN.decode", str);
          if (str.length > BASE_N_MAX_CHARS)
            throw new Error("invalid length");
          return radix.decode(letters.decode(str));
        }
      };
    };
    radix58 = /* @__PURE__ */ radixBaseN(58, B58_GROUP);
    genBase58 = (abc) => genBaseN(radix58, abc);
    base58 = /* @__PURE__ */ freeze(() => genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
    createBase58check = (sha2566) => {
      afn(sha2566);
      const _sha256 = sha2566;
      return chain(checksum(4, (data) => _sha256(_sha256(data))), base58);
    };
  }
});

// node_modules/@scure/bip32/index.js
var Point, Fn, base58check, MASTER_SECRET, BITCOIN_VERSIONS, HARDENED_OFFSET, MAX_DEPTH, hash1602, fromU32, toU32, validateVersions, HDKey;
var init_bip32 = __esm({
  "node_modules/@scure/bip32/index.js"() {
    init_secp256k1();
    init_hmac();
    init_legacy2();
    init_sha23();
    init_utils4();
    init_base2();
    Point = /* @__PURE__ */ (() => secp256k1.Point)();
    Fn = /* @__PURE__ */ (() => Point.Fn)();
    base58check = /* @__PURE__ */ createBase58check(sha2565);
    MASTER_SECRET = /* @__PURE__ */ (() => {
      return Uint8Array.from("Bitcoin seed".split(""), (char) => char.charCodeAt(0));
    })();
    BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
    HARDENED_OFFSET = 2147483648;
    MAX_DEPTH = 255;
    hash1602 = (data) => ripemd1603(sha2565(data));
    fromU32 = (data) => createView3(data).getUint32(0, false);
    toU32 = (n, title = "number") => {
      if (typeof n !== "number")
        throw new TypeError(`"${title}" expected number, got type=${typeof n}`);
      if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1)
        throw new RangeError(`"${title}" expected integer in range 0..2**32-1, got ${n}`);
      const buf = new Uint8Array(4);
      createView3(buf).setUint32(0, n, false);
      return buf;
    };
    validateVersions = (versions, title = "versions") => {
      if (!(typeof versions === "object" && versions !== null))
        throw new Error("versions must be an object");
      toU32(versions.private, `${title}.private`);
      toU32(versions.public, `${title}.public`);
      return versions;
    };
    HDKey = class _HDKey {
      get fingerprint() {
        if (!this._pubHash) {
          throw new Error("No publicKey set!");
        }
        return fromU32(this._pubHash);
      }
      get identifier() {
        return this._pubHash ? Uint8Array.from(this._pubHash) : void 0;
      }
      get pubKeyHash() {
        return this._pubHash ? Uint8Array.from(this._pubHash) : void 0;
      }
      get privateKey() {
        return this._privateKey ? Uint8Array.from(this._privateKey) : null;
      }
      get publicKey() {
        return this._publicKey ? Uint8Array.from(this._publicKey) : null;
      }
      get chainCode() {
        return this._chainCode ? Uint8Array.from(this._chainCode) : null;
      }
      get privateExtendedKey() {
        const priv = this._privateKey;
        if (!priv) {
          throw new Error("No private key");
        }
        return base58check.encode(this.serialize(this.versions.private, concatBytes(Uint8Array.of(0), priv)));
      }
      get publicExtendedKey() {
        if (!this._publicKey) {
          throw new Error("No public key");
        }
        return base58check.encode(this.serialize(this.versions.public, this._publicKey));
      }
      static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
        abytes3(seed);
        versions = validateVersions(versions);
        if (8 * seed.length < 128 || 8 * seed.length > 512) {
          throw new RangeError("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
        }
        const I = hmac(sha512, MASTER_SECRET, seed);
        const privateKey = I.slice(0, 32);
        const chainCode = I.slice(32);
        return new _HDKey({ versions, chainCode, privateKey });
      }
      static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
        versions = validateVersions(versions);
        const keyBuffer = base58check.decode(base58key);
        if (keyBuffer.length !== 78) {
          throw new Error(`HDKey: invalid extended key length: expected 78 bytes, got ${keyBuffer.length}`);
        }
        const keyView = createView3(keyBuffer);
        const version = keyView.getUint32(0, false);
        const opt = {
          versions,
          depth: keyBuffer[4],
          parentFingerprint: keyView.getUint32(5, false),
          index: keyView.getUint32(9, false),
          chainCode: keyBuffer.slice(13, 45)
        };
        const key = keyBuffer.slice(45);
        const isPriv = key[0] === 0;
        if (version !== versions[isPriv ? "private" : "public"]) {
          throw new Error("Version mismatch");
        }
        if (isPriv) {
          return new _HDKey({ ...opt, privateKey: key.slice(1) });
        } else {
          return new _HDKey({ ...opt, publicKey: key });
        }
      }
      static fromJSON(json) {
        return _HDKey.fromExtendedKey("xpriv" in json ? json.xpriv : json.xpub);
      }
      versions;
      depth = 0;
      index = 0;
      parentFingerprint = 0;
      _chainCode = null;
      _privateKey;
      _publicKey;
      _pubHash;
      constructor(opt) {
        if (!opt || typeof opt !== "object") {
          throw new Error("HDKey.constructor must not be called directly");
        }
        const depth = opt.depth ?? 0;
        const index = opt.index ?? 0;
        const parentFingerprint = opt.parentFingerprint ?? 0;
        if (!Number.isSafeInteger(depth) || depth < 0 || depth > MAX_DEPTH) {
          throw new RangeError("HDKey: depth must be an integer in range 0..255");
        }
        toU32(index, "index");
        toU32(parentFingerprint, "parentFingerprint");
        if (depth === 0 && (index !== 0 || parentFingerprint !== 0)) {
          throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
        }
        this.versions = opt.versions ? validateVersions(opt.versions) : BITCOIN_VERSIONS;
        this.depth = depth;
        if (opt.chainCode)
          abytes3(opt.chainCode, 32);
        this._chainCode = opt.chainCode ? Uint8Array.from(opt.chainCode) : null;
        this.index = index;
        this.parentFingerprint = parentFingerprint;
        if (opt.publicKey && opt.privateKey) {
          throw new Error("HDKey: publicKey and privateKey at same time.");
        }
        if (opt.privateKey) {
          if (!secp256k1.utils.isValidSecretKey(opt.privateKey))
            throw new Error("Invalid private key");
          this._privateKey = Uint8Array.from(opt.privateKey);
          this._publicKey = secp256k1.getPublicKey(this._privateKey, true);
        } else if (opt.publicKey) {
          this._publicKey = Point.fromBytes(opt.publicKey).toBytes(true);
        } else {
          throw new Error("HDKey: no public or private key provided");
        }
        this._pubHash = hash1602(this._publicKey);
      }
      derive(path) {
        if (!/^[mM]'?/.test(path)) {
          throw new Error('Path must start with "m" or "M"');
        }
        if (/^[mM]'?$/.test(path)) {
          return this;
        }
        const parts = path.replace(/^[mM]'?\//, "").split("/");
        if (parts.length > MAX_DEPTH - this.depth) {
          throw new Error("HDKey: path exceeds the serializable depth 255");
        }
        let child = this;
        for (const c of parts) {
          const m = /^(\d+)('?)$/.exec(c);
          const m1 = m && m[1];
          if (!m || m.length !== 3 || typeof m1 !== "string")
            throw new Error("invalid child index: " + c);
          let idx = +m1;
          if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
            throw new Error("Invalid index");
          }
          if (m[2] === "'") {
            idx += HARDENED_OFFSET;
          }
          child = child.deriveChild(idx);
        }
        return child;
      }
      deriveChild(index) {
        return this._deriveChild(index);
      }
      /** Test-only implementation seam. Production callers must use deriveChild(). */
      _deriveChild(index, _I) {
        if (!this._publicKey || !this._chainCode) {
          throw new Error("No publicKey or chainCode set");
        }
        let data = toU32(index, "index");
        if (index >= HARDENED_OFFSET) {
          const priv = this._privateKey;
          if (!priv) {
            throw new Error("Could not derive hardened child key");
          }
          data = concatBytes(Uint8Array.of(0), priv, data);
        } else {
          data = concatBytes(this._publicKey, data);
        }
        const out = _I || hmac(sha512, this._chainCode, data);
        abytes3(out, 64);
        const childTweak = out.slice(0, 32);
        const chainCode = out.slice(32);
        const opt = {
          versions: this.versions,
          chainCode,
          depth: this.depth + 1,
          parentFingerprint: this.fingerprint,
          index
        };
        if (opt.depth > MAX_DEPTH) {
          throw new Error("HDKey: depth exceeds the serializable value 255");
        }
        const retry = () => {
          const maxIndex = this._privateKey ? 2 ** 32 - 1 : HARDENED_OFFSET - 1;
          if (index >= maxIndex) {
            throw new Error(`HDKey: cannot retry child derivation at index ${index}`);
          }
          return this.deriveChild(index + 1);
        };
        const ctweak = Fn.fromBytes(childTweak, true);
        if (!Fn.isValid(ctweak))
          return retry();
        if (this._privateKey) {
          const added = Fn.create(Fn.fromBytes(this._privateKey) + ctweak);
          if (!Fn.isValidNot0(added))
            return retry();
          opt.privateKey = Fn.toBytes(added);
        } else {
          const point = Point.fromBytes(this._publicKey);
          const added = ctweak === 0n ? point : point.add(Point.BASE.multiply(ctweak));
          if (added.equals(Point.ZERO))
            return retry();
          opt.publicKey = added.toBytes(true);
        }
        return new _HDKey(opt);
      }
      sign(hash) {
        if (!this._privateKey) {
          throw new Error("No privateKey set!");
        }
        abytes3(hash, 32);
        return secp256k1.sign(hash, this._privateKey, { prehash: false });
      }
      verify(hash, signature2) {
        abytes3(hash, 32);
        abytes3(signature2, 64);
        if (!this._publicKey) {
          throw new Error("No publicKey set!");
        }
        return secp256k1.verify(signature2, hash, this._publicKey, { prehash: false });
      }
      wipePrivateData() {
        if (this._privateKey) {
          this._privateKey.fill(0);
          this._privateKey = void 0;
        }
        return this;
      }
      // TODO(v3): Make automatic JSON serialization public-only so JSON.stringify cannot expose xpriv.
      toJSON() {
        return this.toPrivateJSON();
      }
      /**
       * Explicitly exports private key material. Treat the returned value as a secret.
       */
      toPrivateJSON() {
        return {
          xpriv: this.privateExtendedKey,
          xpub: this.publicExtendedKey
        };
      }
      serialize(version, key) {
        if (!this._chainCode) {
          throw new Error("No chainCode set");
        }
        abytes3(key, 33);
        return concatBytes(toU32(version, "version"), new Uint8Array([this.depth]), toU32(this.parentFingerprint, "parentFingerprint"), toU32(this.index, "index"), this._chainCode, key);
      }
    };
  }
});

// src/core.js
var core_exports = {};
__export(core_exports, {
  L1_NETWORK: () => L1_NETWORK,
  L1_PATH: () => L1_PATH,
  NETWORK: () => NETWORK,
  PATH: () => PATH,
  account: () => account,
  chainNetwork: () => chainNetwork,
  checkRecovery: () => checkRecovery,
  concat: () => concat2,
  decimal: () => decimal,
  decryptVault: () => decryptVault,
  depositAddress: () => depositAddress,
  encryptVault: () => encryptVault,
  hex: () => hex,
  newMnemonic: () => newMnemonic,
  parseUri: () => parseUri,
  paymentPlan: () => paymentPlan,
  publicAccount: () => publicAccount,
  publicAccounts: () => publicAccounts,
  recoveryChallenge: () => recoveryChallenge,
  signPlan: () => signPlan,
  tradePlan: () => tradePlan,
  unhex: () => unhex,
  units: () => units,
  varint: () => varint
});
function chainNetwork(chain2 = "flush") {
  if (chain2 === "flush") return NETWORK;
  if (chain2 === "ecash") return L1_NETWORK;
  throw Error("Unknown chain");
}
function newMnemonic() {
  return generateMnemonic(wordlist, 128);
}
function recoveryChallenge() {
  const choices = Array.from({ length: 12 }, (_, i) => i);
  for (let i = 11; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices.slice(0, 3).sort((a, b) => a - b);
}
function checkRecovery(mnemonic2, indices, answers) {
  const words = mnemonic2.trim().split(/\s+/);
  return Array.isArray(indices) && indices.length === 3 && new Set(indices).size === 3 && indices.every((i) => Number.isInteger(i) && i >= 0 && i < words.length) && Array.isArray(answers) && answers.length === 3 && indices.every((i, n) => typeof answers[n] === "string" && answers[n].trim().toLowerCase() === words[i]);
}
function account(mnemonic2, chain2 = "flush") {
  const network = chainNetwork(chain2), path = chain2 === "ecash" ? L1_PATH : PATH;
  mnemonic2 = mnemonic2.trim().normalize("NFKD").split(/\s+/).join(" ");
  if (!validateMnemonic(mnemonic2, wordlist)) throw Error("Invalid recovery phrase");
  const seed = mnemonicToSeedSync(mnemonic2), root = HDKey.fromMasterSeed(seed), child = root.derive(path);
  seed.fill(0);
  const publicKey = child.publicKey, privateKey = child.privateKey, pay = payments_exports.p2wpkh({ pubkey: publicKey, network });
  root.wipePrivateData();
  child.wipePrivateData();
  return { address: pay.address, publicKey, privateKey, script: pay.output };
}
function publicAccount(m, chain2 = "flush") {
  const a = account(m, chain2);
  a.privateKey.fill(0);
  return { address: a.address, publicKey: hex(a.publicKey), path: chain2 === "ecash" ? L1_PATH : PATH };
}
function publicAccounts(m) {
  return { ecash: publicAccount(m, "ecash"), flush: publicAccount(m, "flush") };
}
async function passwordKey(password, salt, usage) {
  const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 6e5, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, usage);
}
async function encryptVault(mnemonic2, password) {
  if (typeof password !== "string" || password.length < 12) throw Error("Use a password of at least 12 characters");
  const pub = publicAccount(mnemonic2), salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await passwordKey(password, salt, ["encrypt"]);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode("flush-wallet-v1") }, key, enc.encode(mnemonic2));
  return { version: 1, ...pub, accounts: publicAccounts(mnemonic2), salt: hex(salt), iv: hex(iv), ciphertext: hex(new Uint8Array(ciphertext)) };
}
async function decryptVault(vault2, password) {
  try {
    if (vault2.version !== 1) throw Error();
    const key = await passwordKey(password, unhex(vault2.salt), ["decrypt"]);
    const text = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unhex(vault2.iv), additionalData: enc.encode("flush-wallet-v1") }, key, unhex(vault2.ciphertext));
    const bytes = new Uint8Array(text), m = dec.decode(bytes);
    bytes.fill(0);
    if (publicAccount(m).address !== vault2.address) throw Error();
    return m;
  } catch {
    throw Error("Wrong password or damaged wallet");
  }
}
function units(text, places = 8) {
  text = String(text);
  if (!Number.isInteger(places) || places < 0 || places > 12 || !new RegExp("^(0|[1-9][0-9]{0,14})(\\.[0-9]{1," + Math.max(1, places) + "})?$").test(text) || places === 0 && text.includes(".")) throw Error("Invalid amount");
  const [a, b = ""] = text.split("."), n = BigInt(a) * 10n ** BigInt(places) + BigInt(b.padEnd(places, "0") || "0");
  if (n <= 0n || n > 9223372036854775807n) throw Error("Amount out of range");
  return n;
}
function decimal(n, places = 8) {
  n = BigInt(n);
  const s = n.toString().padStart(places + 1, "0");
  const f = places ? s.slice(-places).replace(/0+$/, "") : "";
  return places ? s.slice(0, -places) + (f ? "." + f : "") : s;
}
function depositAddress(addr) {
  address_exports.toOutputScript(addr, NETWORK);
  const prefix = "s99_" + addr + "_";
  return prefix + hex(sha2565(enc.encode(prefix))).slice(0, 6);
}
function varint(n) {
  n = BigInt(n);
  if (n < 0n || n > 0xffffffffffffffffn) throw Error("Varint range");
  const a = [];
  while (true) {
    a.push(Number(n & 127n) | (a.length ? 128 : 0));
    if (n <= 127n) break;
    n = (n >> 7n) - 1n;
  }
  return Uint8Array.from(a.reverse());
}
function compact(n) {
  if (n < 253) return Uint8Array.of(n);
  if (n <= 65535) return Uint8Array.of(253, n & 255, n >> 8);
  throw Error("Oversize vector");
}
function marker(operation, outputs2) {
  const data = concat2(enc.encode("BAST"), [0], operation, compact(outputs2.length), ...outputs2.map((o) => o.token ? concat2(varint(o.n), [o.token.kind], idBytes(o.token.id), varint(o.token.amount_units)) : concat2(varint(o.n), [255])));
  return script_exports.compile([script_exports.OPS.OP_RETURN, data]);
}
function paymentPlan({ from, to, amount, asset = "ECX", decimals = 8, utxos, feeRate = 2, chain: chain2 = "flush" }) {
  const network = chainNetwork(chain2);
  let mine, target;
  try {
    mine = address_exports.toOutputScript(from, network);
    target = address_exports.toOutputScript(to, network);
  } catch {
    throw Error(chain2 === "ecash" ? "Use an eCash betanet address" : "Use a Flush betanet address (bflx1\u2026)");
  }
  const value2 = units(amount, decimals);
  if (chain2 === "flush" && !to.startsWith("bflx1")) throw Error("Use a Flush betanet address (bflx1\u2026)");
  if (chain2 === "ecash" && asset !== "ECX") throw Error("Flush tokens can only be sent on Flush");
  if (!Number.isFinite(feeRate) || feeRate < 1 || feeRate > 50) throw Error("Fee must be between 1 and 50 sat/vB");
  let inputs2 = [], outputs2 = [], tokens = [];
  if (asset === "ECX") {
    outputs2.push({ script: target, value: value2 });
  } else {
    if (!/^[a-f0-9]{64}$/.test(asset)) throw Error("Invalid asset ID");
    let got = 0n;
    for (const u of utxos.filter((u2) => u2.token?.kind === 0 && u2.token.id === asset)) {
      inputs2.push(u);
      got += BigInt(u.token.amount_units);
      if (got >= value2) break;
    }
    if (got < value2) throw Error("Insufficient token balance");
    outputs2.push({ script: target, value: 0n });
    tokens.push({ n: 0, token: { kind: 0, id: asset, amount_units: value2.toString() } });
    if (got > value2) {
      tokens.push({ n: outputs2.length, token: { kind: 0, id: asset, amount_units: (got - value2).toString() } });
      outputs2.push({ script: mine, value: 0n });
    }
    outputs2.push({ script: marker([0], tokens), value: 0n });
  }
  return fund({ from, inputs: inputs2, outputs: outputs2, utxos, feeRate, chain: chain2, summary: { type: "send", to, amount, asset, decimals, chain: chain2 } });
}
function fund({ from, inputs: inputs2 = [], outputs: outputs2, utxos, feeRate = 2, summary, chain: chain2 = "flush" }) {
  const network = chainNetwork(chain2), mine = address_exports.toOutputScript(from, network), chosen = new Set(inputs2.map((u) => u.txid + ":" + u.vout));
  const coins = utxos.filter((u) => !u.token && BigInt(u.value_sat) > 0n && !chosen.has(u.txid + ":" + u.vout)).sort((a, b) => Number(BigInt(b.value_sat) - BigInt(a.value_sat)));
  let total = inputs2.reduce((s, u) => s + BigInt(u.value_sat), 0n), spend = outputs2.reduce((s, o) => s + o.value, 0n), fee;
  function estimated() {
    return BigInt(Math.ceil((12 + inputs2.length * 69 + 31 + outputs2.reduce((s, o) => s + 9 + o.script.length, 0) + (summary.type === "swap" ? 750 : 0)) * feeRate));
  }
  fee = estimated();
  for (const u of coins) {
    if (total >= spend + fee) break;
    inputs2.push(u);
    total += BigInt(u.value_sat);
    fee = estimated();
  }
  if (total < spend + fee) throw Error("Insufficient ECX for amount and network fee");
  const change = total - spend - fee;
  if (change >= 294n) outputs2.push({ script: mine, value: change });
  else fee += change;
  if (fee > 100000n) throw Error("Network fee exceeds 0.001 ECX");
  for (const u of inputs2) {
    if (u.scriptPubKey !== hex(mine)) throw Error("Server returned an input owned by another address");
    if (u.coinbase && u.confirmations < 100) throw Error("Immature coinbase");
  }
  const psbt = new Psbt2({ network });
  psbt.setVersion(2);
  if (chain2 === "ecash") psbt.setLocktime(499999999);
  for (const u of inputs2) psbt.addInput({ hash: u.txid, index: u.vout, sequence: 4294967293, witnessUtxo: { script: unhex(u.scriptPubKey), value: BigInt(u.value_sat) } });
  for (const o of outputs2) psbt.addOutput(o);
  return { id: crypto.randomUUID(), chain: chain2, psbt: psbt.toBase64(), inputs: inputs2.map((u) => ({ txid: u.txid, vout: u.vout, value_sat: u.value_sat })), fee_sat: fee.toString(), summary, created: Date.now() };
}
function signPlan(plan2, mnemonic2) {
  const chain2 = plan2.chain || "flush", a = account(mnemonic2, chain2), psbt = Psbt2.fromBase64(plan2.psbt, { network: chainNetwork(chain2) });
  try {
    for (let i = 0; i < psbt.inputCount; i++) psbt.signInput(i, { publicKey: a.publicKey, sign: (h) => secp256k1.sign(h, a.privateKey, { prehash: false, lowS: true, format: "compact" }) }, [Transaction.SIGHASH_ALL]);
    if (!psbt.validateSignaturesOfAllInputs((pub, h, sig) => secp256k1.verify(sig, h, pub, { prehash: false, lowS: true, format: "compact" }))) throw Error("Signature verification failed");
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction();
    return { hex: tx.toHex(), txid: tx.getId() };
  } finally {
    a.privateKey.fill(0);
  }
}
function tradePlan({ from, assetIn, assetOut, amount, decimalsIn, decimalsOut, minOut, pools, utxos, feeRate = 2 }) {
  if (!Array.isArray(pools) || pools.length < 1 || pools.length > 4 || pools.some((p) => !/^[a-f0-9]{64}$/.test(p))) throw Error("Invalid pool route");
  const zero = "0".repeat(64), inId = assetIn === "ECX" ? zero : assetIn;
  if (!/^[a-f0-9]{64}$/.test(inId)) throw Error("Invalid input asset");
  const value2 = units(amount, decimalsIn), floor = units(minOut, decimalsOut), mine = address_exports.toOutputScript(from, NETWORK);
  const inputs2 = [], outputs2 = [], tokens = [];
  if (assetIn !== "ECX") {
    let got = 0n;
    for (const u of utxos.filter((u2) => u2.token?.kind === 0 && u2.token.id === assetIn)) {
      inputs2.push(u);
      got += BigInt(u.token.amount_units);
      if (got >= value2) break;
    }
    if (got < value2) throw Error("Insufficient token balance");
    if (got > value2) {
      tokens.push({ n: outputs2.length, token: { kind: 0, id: assetIn, amount_units: (got - value2).toString() } });
      outputs2.push({ script: mine, value: 0n });
    }
  }
  tokens.push({ n: outputs2.length });
  outputs2.push({ script: mine, value: 0n });
  const op = concat2([21], idBytes(inId), compact(pools.length), ...pools.map(idBytes), varint(value2), varint(floor), vector(mine));
  outputs2.push({ script: marker(op, tokens), value: assetIn === "ECX" ? value2 : 0n });
  return fund({ from, inputs: inputs2, outputs: outputs2, utxos, feeRate, summary: { type: "swap", assetIn, assetOut, amount, minOut, decimalsIn, decimalsOut, pools } });
}
function parseUri(uri, now = Math.floor(Date.now() / 1e3)) {
  if (typeof uri !== "string" || uri.length > 4096 || !/^flush:[a-z]+\?/.test(uri) || /[+\s#]/.test(uri)) throw Error("Invalid Flush request");
  const q = uri.indexOf("?"), verb = uri.slice(6, q), p = new URLSearchParams(uri.slice(q + 1));
  const fields = { connect: ["origin", "callback", "nonce"], buy: ["launch", "asset", "ecx", "min_tokens", "slippage_bps"], sell: ["launch", "asset", "tokens", "min_ecx", "slippage_bps"], swap: ["pool", "from", "to", "amount", "min_out", "slippage_bps"], route: ["pools", "from", "to", "amount", "min_out", "slippage_bps"] };
  if (!fields[verb]) throw Error("This action is not supported by the browser wallet yet");
  const raw = uri.slice(q + 1).split("&");
  for (const part of raw) {
    const pair = part.split("=");
    if (pair.length !== 2 || !pair.every((x) => /^(?:[A-Za-z0-9_.~-]|%[a-fA-F0-9]{2})+$/.test(x))) throw Error("Malformed URI encoding");
    for (const value2 of pair) decodeURIComponent(value2);
  }
  for (const field of fields[verb].filter((f) => f !== "slippage_bps")) if (!p.has(field)) throw Error("Missing " + field);
  for (const field of ["asset", "pool"]) if (p.has(field) && !/^([0-9a-f]{64})$/.test(p.get(field))) throw Error("Invalid " + field);
  if (p.has("pools") && (!/^([0-9a-f]{64})(,[0-9a-f]{64}){1,3}$/.test(p.get("pools")) || new Set(p.get("pools").split(",")).size !== p.get("pools").split(",").length)) throw Error("Invalid pool route");
  for (const field of ["launch", "from", "to"]) if (p.has(field) && !/^[A-Z0-9]{2,12}$/.test(p.get(field))) throw Error("Invalid ticker");
  for (const field of ["ecx", "min_tokens", "tokens", "min_ecx", "amount", "min_out"]) if (p.has(field)) units(p.get(field), 8);
  if (p.has("slippage_bps") && (!/^\d{1,4}$/.test(p.get("slippage_bps")) || Number(p.get("slippage_bps")) > 5e3)) throw Error("Invalid slippage");
  const seen = /* @__PURE__ */ new Set();
  for (const [k, v] of p) {
    if (seen.has(k) || !["v", "network", "exp", ...fields[verb]].includes(k) || /[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u.test(v)) throw Error("Invalid request parameter");
    seen.add(k);
  }
  const exp = Number(p.get("exp"));
  if (p.get("v") !== "1" || p.get("network") !== "ecashbeta" || !/^\d+$/.test(p.get("exp") || "") || exp < now || exp > now + 86400) throw Error("Wrong network or expired request");
  if (verb === "connect" && (p.get("origin") !== "https://flush.markets" || p.get("callback") !== "https://flush.markets/connect" || !/^[A-Za-z0-9_-]{16,64}$/.test(p.get("nonce") || ""))) throw Error("Invalid connection request");
  return { verb, ...Object.fromEntries(p) };
}
var NETWORK, PATH, L1_NETWORK, L1_PATH, hex, unhex, concat2, enc, dec, idBytes, vector;
var init_core = __esm({
  "src/core.js"() {
    init_bip39();
    init_english();
    init_bip32();
    init_secp256k1();
    init_sha23();
    init_esm5();
    NETWORK = { messagePrefix: "Bitcoin Signed Message:\n", bech32: "bflx", bip32: { public: 76067358, private: 76066276 }, pubKeyHash: 28, scriptHash: 88, wif: 156 };
    PATH = "m/84'/1'/0'/0/0";
    L1_NETWORK = { messagePrefix: "Bitcoin Signed Message:\n", bech32: "bc", bip32: { public: 76067358, private: 76066276 }, pubKeyHash: 0, scriptHash: 5, wif: 128 };
    L1_PATH = "m/84'/0'/0'/0/0";
    hex = (b) => Array.from(b, (v) => v.toString(16).padStart(2, "0")).join("");
    unhex = (s) => {
      if (typeof s !== "string" || s.length % 2 || !/^[0-9a-f]*$/i.test(s)) throw Error("Invalid hex");
      return Uint8Array.from(s.match(/../g) || [], (v) => parseInt(v, 16));
    };
    concat2 = (...b) => Uint8Array.from(b.flatMap((v) => [...v]));
    enc = new TextEncoder();
    dec = new TextDecoder();
    idBytes = (id) => unhex(id).reverse();
    vector = (b) => concat2(compact(b.length), b);
  }
});

// src/token.js
var kinds = ["asset", "control", "reservation", "lp", "receipt", "position", "order"];
function normalizeToken(token) {
  if (token === null) return null;
  const kind = typeof token?.kind === "string" ? kinds.indexOf(token.kind) : token?.kind, id = token?.id || token?.asset_id;
  const amount = token?.amount_units ?? ([1, 2, 4, 5, 6].includes(kind) ? "1" : void 0);
  if (!Number.isInteger(kind) || kind < 0 || kind > 6 || !/^[0-9a-f]{64}$/.test(id || "") || typeof amount !== "string" || !/^[1-9][0-9]{0,18}$/.test(amount) || BigInt(amount) > 9223372036854775807n) throw Error("Invalid token-output metadata");
  return { kind, id, amount_units: amount };
}

// src/api.js
init_esm5();
init_core();
var EXPLORERS = Object.freeze({ ecash: "https://explorer.blockfab.org/betanet", flush: "https://explorer.blockfab.org/betanet/flush" });
function explorerBase(chain2 = "flush") {
  const base2 = EXPLORERS[chain2];
  if (!base2) throw Error("Unknown chain");
  return base2;
}
async function request(url, options = {}, json = true) {
  const r = await fetch(url, { ...options, signal: AbortSignal.timeout(3e4) });
  const text = await r.text();
  let data = text;
  if (json) {
    try {
      data = JSON.parse(text);
    } catch {
      throw Error("Explorer returned an invalid response");
    }
  }
  if (!r.ok) throw Error(typeof data?.error === "string" ? data.error : data?.error?.message || String(text).slice(0, 180) || "Explorer unavailable");
  return data;
}
async function api(path, options = {}) {
  if (path.startsWith("/api/v1/")) return request(EXPLORERS.flush + "/api/v1/flush/market/" + path.slice("/api/v1/".length), options);
  throw Error("Unsupported explorer API path");
}
function tokenLogo(id) {
  if (!/^[a-f0-9]{64}$/.test(id)) return null;
  return EXPLORERS.flush + "/api/v1/flush/logo/" + id;
}
async function explorerStatus() {
  const [l1, l2, chain2] = await Promise.all([
    request(EXPLORERS.ecash + "/api/blocks/tip/height", {}, false),
    request(EXPLORERS.flush + "/api/v1/flush/rpc/getblockchaininfo"),
    request(EXPLORERS.ecash + "/api/v1/chain")
  ]);
  if (chain2.network !== "ecashbeta" || !chain2.mainchain || l2.chain !== "ecashbeta") throw Error("Explorer is on another network");
  return { network: "ecashbeta", slot: 99, height: l2.blocks, headers: l2.headers, syncing: l2.initialblockdownload, mainchain_height: Number(l1) };
}
var transactions = /* @__PURE__ */ new Map();
async function transaction(chain2, txid) {
  const key = chain2 + txid, cached = transactions.get(key);
  if (cached && Date.now() - cached.at < 15e3) return cached.data;
  const data = await request(explorerBase(chain2) + "/api/tx/" + txid);
  if (data.txid !== txid) throw Error("Explorer returned a different transaction");
  if (transactions.size >= 250) transactions.delete(transactions.keys().next().value);
  transactions.set(key, { at: Date.now(), data });
  return data;
}
async function explorerCoins(chain2, addr) {
  const network = chainNetwork(chain2), mine = hex(address_exports.toOutputScript(addr, network)), base2 = explorerBase(chain2);
  const [list, heightText, balances] = await Promise.all([
    request(base2 + "/api/address/" + addr + "/utxo"),
    request(base2 + "/api/blocks/tip/height", {}, false),
    request(base2 + "/api/address/" + addr)
  ]);
  if (!Array.isArray(list) || list.length > 1e3) throw Error("This address has too many outputs; consolidate it first");
  const height = Number(heightText);
  if (!Number.isSafeInteger(height)) throw Error("Invalid explorer height");
  const utxos = [];
  for (let start = 0; start < list.length; start += 5) {
    const group = await Promise.all(list.slice(start, start + 5).map(async (u) => {
      if (!/^[a-f0-9]{64}$/.test(u.txid) || !Number.isSafeInteger(u.vout) || u.vout < 0 || !Number.isSafeInteger(u.value) || u.value < 0) throw Error("Invalid explorer output");
      const tx = await transaction(chain2, u.txid), out = tx.vout?.[u.vout];
      if (!out || out.scriptpubkey !== mine || out.value !== u.value) throw Error("Explorer output does not match your address");
      const confirmations = u.status.confirmed ? Math.max(0, height - u.status.block_height + 1) : 0;
      return { txid: u.txid, vout: u.vout, value_sat: String(u.value), scriptPubKey: out.scriptpubkey, confirmations, coinbase: Boolean(tx.vin?.[0]?.is_coinbase), token: chain2 === "flush" ? Object.hasOwn(u, "token") ? normalizeToken(u.token) : u.value === 0 ? { kind: 255 } : null : null };
    }));
    utxos.push(...group);
  }
  const token_metadata_available = chain2 !== "flush" || !utxos.some((u) => u.token?.kind === 255);
  return { address: addr, height, chain: chain2, utxos: utxos.filter((u) => !u.spent), stats: balances, token_metadata_available };
}
async function explorerHoldings(addr) {
  return api("/api/v1/addresses/" + addr + "/holdings");
}
async function explorerHistory(chain2, addr) {
  const txs = await request(explorerBase(chain2) + "/api/address/" + addr + "/txs");
  if (!Array.isArray(txs)) throw Error("Invalid transaction history");
  return txs.map((tx) => {
    let input = 0n, output = 0n;
    for (const v of tx.vin || []) if (v.prevout?.scriptpubkey_address === addr) input += BigInt(v.prevout.value);
    for (const v of tx.vout || []) if (v.scriptpubkey_address === addr) output += BigInt(v.value);
    const net = output - input;
    return { txid: tx.txid, chain: chain2, type: net < 0n ? "send" : net > 0n ? "receive" : "asset", amount: decimal(net < 0n ? -net : net), ticker: "ECX", time: (tx.status.block_time || 0) * 1e3, confirmed: tx.status.confirmed };
  });
}
async function explorerBroadcast(chain2, raw) {
  const tx = Transaction.fromHex(raw), burn = tx.outs.filter((o) => o.script[0] === 106).reduce((s, o) => s + o.value, 0n);
  const query = new URLSearchParams({ maxfeerate: "0.001", maxburnamount: decimal(burn) });
  const result = await request(explorerBase(chain2) + "/api/tx?" + query, { method: "POST", headers: { "content-type": "text/plain" }, body: raw }, false);
  const txid = result.trim();
  if (!/^[a-f0-9]{64}$/.test(txid) || txid !== tx.getId()) throw Error("Explorer returned an unexpected transaction ID");
  return { txid };
}
function createExplorerBackend() {
  return { mode: "explorer", api, status: explorerStatus, coins: explorerCoins, holdings: explorerHoldings, broadcast: explorerBroadcast, history: explorerHistory, logo: async (id) => tokenLogo(id) };
}

// src/rpc.js
init_esm5();
init_core();
var BETANET_CHECKPOINT = { height: 967680, hash: "00000000000000030101ba5cfea54b22becc79f95dc6040beb76e01dd9d04042" };
var FLUSH_GENESIS = "04dfb01bef61e44d679132f9e830719c64241f7052880418a350ff6d3c90b561";
function rpcURL(value2) {
  let u;
  try {
    u = new URL(value2);
  } catch {
    throw Error("Enter a valid RPC URL");
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname);
  if (u.protocol !== "https:" && !(u.protocol === "http:" && loopback)) throw Error("Remote RPC nodes require HTTPS. HTTP is allowed on localhost only.");
  if (u.username || u.password || u.search || u.hash) throw Error("Put RPC credentials in the credentials field, not in the URL");
  if (!u.hostname) throw Error("Enter an RPC hostname");
  return u.href;
}
function rpcOrigin(url) {
  const u = new URL(rpcURL(url));
  return u.protocol + "//" + u.hostname + "/*";
}
function validateConnection(c) {
  const out = { mode: "rpc" };
  for (const chain2 of ["ecash", "flush"]) {
    const node = c?.[chain2];
    if (!node) throw Error("Enter both eCash and Flush RPC endpoints");
    const auth = node.auth || "";
    if (typeof auth !== "string" || auth.length > 4096 || /[\r\n]/.test(auth) || auth && !auth.includes(":")) throw Error("RPC credentials must be username:password, or the contents of the cookie file");
    out[chain2] = { url: rpcURL(node.url), auth };
  }
  return out;
}
var AMOUNTS = /* @__PURE__ */ new Set(["value", "amount", "amount_in", "amount_out", "quote", "min_out", "supply", "balance", "reserve_a", "reserve_b"]);
function parseRpcJSON(text) {
  let out = "", i = 0, key = null;
  while (i < text.length) {
    const c = text[i];
    if (c === '"') {
      const start = i++;
      while (i < text.length) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i++] === '"') break;
      }
      const segment = text.slice(start, i);
      out += segment;
      let n = i;
      while (/\s/.test(text[n] || "") && n < text.length) n++;
      if (text[n] === ":") key = JSON.parse(segment);
      continue;
    }
    if (c === "-" || /\d/.test(c)) {
      const match = text.slice(i).match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
      if (!match) throw Error("Invalid RPC JSON");
      const token = match[0];
      out += AMOUNTS.has(key) ? JSON.stringify(token) : token;
      i += token.length;
      key = null;
      continue;
    }
    if (c === "{" || c === "[" || c === "," || c === "}" || c === "]") key = null;
    out += c;
    i++;
  }
  return JSON.parse(out);
}
var READS = /* @__PURE__ */ new Set(["getblockchaininfo", "getmainchaininfo", "getblockhash", "scantxoutset", "gettxout", "getasset", "listassets", "getpool", "getlaunch", "quoteroute", "getassetlogo", "sendrawtransaction"]);
function createRpcBackend(input, { fetcher = fetch } = {}) {
  const config = validateConnection(input), scans = { ecash: Promise.resolve(), flush: Promise.resolve() }, coinCache = /* @__PURE__ */ new Map(), assets = /* @__PURE__ */ new Map();
  async function rpc(chain2, method, params = []) {
    if (!READS.has(method)) throw Error("RPC method is not allowed");
    const node = config[chain2];
    if (!node) throw Error("Unknown chain");
    const headers = { "content-type": "application/json" };
    if (node.auth) headers.Authorization = "Basic " + btoa(String.fromCharCode(...new TextEncoder().encode(node.auth)));
    let r;
    try {
      r = await fetcher(node.url, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: crypto.randomUUID(), method, params }), redirect: "error", cache: "no-store", signal: AbortSignal.timeout(3e4) });
    } catch {
      throw Error("Could not reach the " + (chain2 === "ecash" ? "eCash" : "Flush") + " RPC node");
    }
    if (r.status === 401 || r.status === 403) throw Error("RPC authentication or node access was refused");
    const text = await r.text();
    let j;
    try {
      j = parseRpcJSON(text);
    } catch {
      throw Error("Node returned an invalid RPC response");
    }
    if (j.error) throw Error("RPC " + method + ": " + String(j.error.message || "request failed").slice(0, 200));
    if (!r.ok) throw Error("RPC request failed (HTTP " + r.status + ")");
    return j.result;
  }
  async function status2() {
    const [l1, l2, l1hash, l2hash, main] = await Promise.all([rpc("ecash", "getblockchaininfo"), rpc("flush", "getblockchaininfo"), rpc("ecash", "getblockhash", [BETANET_CHECKPOINT.height]), rpc("flush", "getblockhash", [0]), rpc("flush", "getmainchaininfo")]);
    if (l1hash !== BETANET_CHECKPOINT.hash || !["main", "ecashbeta"].includes(l1.chain)) throw Error("The eCash RPC endpoint is not eCash betanet");
    if (l2hash !== FLUSH_GENESIS || l2.chain !== "ecashbeta" || main.slot !== 99) throw Error("The Flush RPC endpoint is not betanet slot 99");
    return { network: "ecashbeta", slot: 99, height: l2.blocks, headers: l2.headers, syncing: Boolean(l1.initialblockdownload || l2.initialblockdownload), mainchain_height: l1.blocks, mode: "rpc" };
  }
  function amountUnits(value2, places = 8) {
    const text = String(value2);
    if (/^0(?:\.0+)?$/.test(text)) return 0n;
    return units(text, places);
  }
  async function coins(chain2, addr) {
    const mine = hex(address_exports.toOutputScript(addr, chainNetwork(chain2))), cached = coinCache.get(chain2 + addr);
    if (cached && Date.now() - cached.at < 8e3) return cached.data;
    let release;
    const previous = scans[chain2];
    scans[chain2] = new Promise((r) => release = r);
    await previous;
    try {
      const fresh = coinCache.get(chain2 + addr);
      if (fresh && Date.now() - fresh.at < 8e3) return fresh.data;
      const scan = await rpc(chain2, "scantxoutset", ["start", ["addr(" + addr + ")"]]);
      if (!scan?.success) throw Error("The node UTXO scan was interrupted");
      if (scan.unspents.length > 1e3) throw Error("This address has too many outputs; consolidate it first");
      const utxos = [];
      for (let i = 0; i < scan.unspents.length; i += 5) utxos.push(...(await Promise.all(scan.unspents.slice(i, i + 5).map(async (u) => {
        const out = await rpc(chain2, "gettxout", [u.txid, u.vout, true]);
        if (!out) return null;
        if (out.scriptPubKey.hex !== mine) throw Error("Node returned an output owned by another address");
        const value_sat = amountUnits(out.value).toString();
        const token = chain2 === "flush" ? Object.hasOwn(out, "token") ? normalizeToken(out.token) : value_sat === "0" ? { kind: 255 } : null : null;
        return { txid: u.txid, vout: u.vout, value_sat, scriptPubKey: mine, coinbase: out.coinbase, confirmations: out.confirmations, token };
      }))).filter(Boolean));
      const data = { address: addr, height: scan.height, chain: chain2, utxos, token_metadata_available: !utxos.some((u) => u.token?.kind === 255) };
      coinCache.set(chain2 + addr, { at: Date.now(), data });
      return data;
    } finally {
      release();
    }
  }
  function ref(value2) {
    return /^[0-9a-f]{64}$/.test(value2) ? "0x" + value2 : value2;
  }
  function normalizeAsset(a) {
    return { id: a.asset, ticker: a.name || a.label, display_name: a.display_name || a.name || a.label, info: a.data?.info || "", decimals: a.decimals, supply: a.supply, fixed_supply: a.fixed, seq: a.seq, has_logo: Boolean(a.logo) };
  }
  async function asset(id) {
    if (id === "ECX") return { id: "ECX", ticker: "ECX", decimals: 8 };
    if (assets.has(id)) return assets.get(id);
    const a = normalizeAsset(await rpc("flush", "getasset", [ref(id)]));
    assets.set(a.id, a);
    return a;
  }
  async function api2(path) {
    const url = new URL(path, "https://wallet.invalid"), p = url.pathname.split("/").filter(Boolean).slice(2);
    if (p[0] === "assets" && !p[1]) {
      const list = await rpc("flush", "listassets", [Math.min(100, Number(url.searchParams.get("limit") || 100)), 0]);
      const items = list.map(normalizeAsset);
      for (const a of items) assets.set(a.id, a);
      return { items };
    }
    if (p[0] === "assets" && p[1]) return asset(p[1]);
    if (p[0] === "pools" && p[1]) {
      const pool = await rpc("flush", "getpool", [p[1]]);
      return { ...pool, asset_a_id: pool.asset_a_id === "0".repeat(64) ? null : pool.asset_a_id, asset_b_id: pool.asset_b_id === "0".repeat(64) ? null : pool.asset_b_id };
    }
    if (p[0] === "launches" && p[1]) {
      const l = await rpc("flush", "getlaunch", [ref(p[1])]);
      return { ...l, id: l.token, state: l.status, pool_id: l.pool };
    }
    if (p[0] === "quote" && p[1] === "swap") {
      const from = url.searchParams.get("from"), to = url.searchParams.get("to"), amount = url.searchParams.get("amount"), out = await asset(to), slippage = Number(url.searchParams.get("slippage_bps") || 100);
      if (!Number.isInteger(slippage) || slippage < 0 || slippage > 5e3) throw Error("Invalid slippage");
      const q = await rpc("flush", "quoteroute", [ref(from), amount, ref(to), 4, 5]);
      const best = q.routes?.[0];
      if (!best) throw Error("No pool route trades this pair");
      const exact = amountUnits(best.amount_out, out.decimals), min = exact * BigInt(1e4 - slippage) / 10000n;
      if (min <= 0n) throw Error("Trade is too small");
      return { amount_out: String(best.amount_out), amount_out_units: exact.toString(), min_out_units: min.toString(), best: { pools: best.pools, path_ids: best.path_ids } };
    }
    throw Error("This operation is not supported by the RPC connection");
  }
  async function holdings(addr) {
    const c = await coins("flush", addr), byId = /* @__PURE__ */ new Map();
    for (const u of c.utxos) if (u.token?.kind === 0) byId.set(u.token.id, (byId.get(u.token.id) || 0n) + BigInt(u.token.amount_units));
    return { items: [...byId].map(([asset_id, n]) => ({ asset_id, kind: "asset", amount_units: n.toString() })), unavailable: !c.token_metadata_available };
  }
  async function logo(id) {
    try {
      const l = await rpc("flush", "getassetlogo", [ref(id)]);
      if (!["image/png", "image/jpeg"].includes(l.mime) || l.base64?.length > 44e3 || !/^[A-Za-z0-9+/]*={0,2}$/.test(l.base64 || "")) return null;
      return "data:" + l.mime + ";base64," + l.base64;
    } catch {
      return null;
    }
  }
  async function broadcast(chain2, raw) {
    const tx = Transaction.fromHex(raw), burn = tx.outs.filter((o) => o.script[0] === 106).reduce((s, o) => s + o.value, 0n);
    const txid = await rpc(chain2, "sendrawtransaction", [raw, "0.001", decimal(burn)]);
    if (txid !== tx.getId()) throw Error("Node returned an unexpected transaction ID");
    coinCache.clear();
    return { txid };
  }
  return { mode: "rpc", status: status2, coins, api: api2, holdings, logo, broadcast, history: async () => [] };
}

// src/connection.js
init_bip39();
init_core();
var enc2 = new TextEncoder();
var dec2 = new TextDecoder();
var context = enc2.encode("flush-wallet-rpc-credentials-v1");
async function keyFor(phrase, salt, usage) {
  const seed = mnemonicToSeedSync(phrase);
  const material = await crypto.subtle.importKey("raw", seed, "HKDF", false, ["deriveKey"]);
  seed.fill(0);
  return crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt, info: context }, material, { name: "AES-GCM", length: 256 }, false, usage);
}
async function sealConnection(connection, phrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)), key = await keyFor(phrase, salt, ["encrypt"]);
  const bytes = enc2.encode(JSON.stringify(connection));
  try {
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: context }, key, bytes);
    return { version: 1, salt: hex(salt), iv: hex(iv), ciphertext: hex(new Uint8Array(data)) };
  } finally {
    bytes.fill(0);
  }
}
async function openConnection(envelope, phrase) {
  if (envelope?.version !== 1) throw Error("Invalid saved RPC connection");
  try {
    const key = await keyFor(phrase, unhex(envelope.salt), ["decrypt"]);
    const bytes = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unhex(envelope.iv), additionalData: context }, key, unhex(envelope.ciphertext)));
    try {
      return JSON.parse(dec2.decode(bytes));
    } finally {
      bytes.fill(0);
    }
  } catch {
    throw Error("Could not unlock the saved RPC credentials. Pair your node again.");
  }
}
function redactConnection(c) {
  if (!c || c.mode === "explorer") return { mode: "explorer" };
  return { mode: "rpc", ecash: { url: c.ecash.url, hasAuth: Boolean(c.ecash.auth) }, flush: { url: c.flush.url, hasAuth: Boolean(c.flush.auth) } };
}

// src/background.js
init_core();
var mnemonic = null;
var lockAt = 0;
var plan = null;
var pendingReply = null;
var pendingWindow = null;
var rpcBackend = null;
var rpcConfig = null;
var connectionGeneration = 0;
var lockTimer = null;
var store = chrome.storage.local;
async function protectStorage() {
  await store.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" });
  await chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" });
}
protectStorage();
chrome.runtime.onInstalled.addListener(protectStorage);
var vault = async () => (await store.get("vault")).vault;
var uriKey = async (s) => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))));
function lock() {
  mnemonic = null;
  rpcBackend = null;
  rpcConfig = null;
  plan = null;
  clearTimeout(lockTimer);
}
function setUnlocked(phrase) {
  mnemonic = phrase;
  lockAt = Date.now() + 12e4;
  clearTimeout(lockTimer);
  lockTimer = setTimeout(lock, 12e4);
}
var unlocked = () => {
  if (Date.now() > lockAt) lock();
  return Boolean(mnemonic);
};
async function status() {
  const v = await vault();
  return { account: v ? { address: v.address, publicKey: v.publicKey, path: v.path, accounts: v.accounts } : null, unlocked: unlocked(), connectionMode: (await store.get("connectionMode")).connectionMode || "explorer" };
}
var explorer = createExplorerBackend();
async function backend() {
  const { connectionMode, rpcConnection } = await store.get(["connectionMode", "rpcConnection"]);
  if (connectionMode !== "rpc") return explorer;
  if (!unlocked()) throw Error("Unlock the wallet to use your RPC connection");
  if (!rpcBackend) {
    rpcConfig = validateConnection(await openConnection(rpcConnection, mnemonic));
    rpcBackend = createRpcBackend(rpcConfig);
  }
  return rpcBackend;
}
async function connectionDetails() {
  const mode = (await store.get("connectionMode")).connectionMode;
  if (mode !== "rpc") return { mode: "explorer" };
  await backend();
  return redactConnection(rpcConfig);
}
async function saveConnection(input) {
  if (!unlocked()) throw Error("Unlock the wallet before pairing a node");
  const draft = validateConnection(input);
  if ((await store.get("connectionMode")).connectionMode === "rpc") {
    await backend();
    for (const chain2 of ["ecash", "flush"]) if (!draft[chain2].auth && draft[chain2].url === rpcConfig[chain2].url) draft[chain2].auth = rpcConfig[chain2].auth;
  }
  const config = validateConnection(draft), origins = [...new Set(["ecash", "flush"].map((c) => rpcOrigin(config[c].url)))];
  if (!await chrome.permissions.contains({ origins })) throw Error("Allow Chrome access to the selected node addresses before pairing");
  const candidate = createRpcBackend(config), report = await candidate.status();
  if (!unlocked()) throw Error("Wallet locked during pairing; unlock and try again");
  const encrypted = await sealConnection(config, mnemonic);
  await store.set({ connectionMode: "rpc", rpcConnection: encrypted });
  rpcConfig = config;
  rpcBackend = candidate;
  connectionGeneration++;
  plan = null;
  return { connection: redactConnection(config), report };
}
async function useExplorer() {
  const old = (await store.get("rpcConnection")).rpcConnection;
  let origins = [];
  if (old && unlocked()) {
    try {
      const config = rpcConfig || await openConnection(old, mnemonic);
      origins = [...new Set(["ecash", "flush"].map((c) => rpcOrigin(config[c].url)))];
    } catch {
    }
  }
  await store.remove("rpcConnection");
  await store.set({ connectionMode: "explorer" });
  rpcBackend = null;
  rpcConfig = null;
  connectionGeneration++;
  plan = null;
  for (const origin of origins) if (origin !== "https://explorer.blockfab.org/*") await chrome.permissions.remove({ origins: [origin] });
  return { mode: "explorer" };
}
async function updateAccounts(phrase) {
  const v = await vault();
  if (!v) throw Error("No wallet");
  await store.set({ vault: { ...v, accounts: publicAccounts(phrase) } });
}
async function myCoins(chain2 = "flush", b) {
  b ||= await backend();
  const v = await vault();
  if (!v) throw Error("Create or import a wallet");
  const addr = chain2 === "flush" ? v.address : v.accounts?.ecash.address;
  if (!addr) throw Error("Unlock this wallet to add its eCash address");
  return b.coins(chain2, addr);
}
async function resolveAsset(id, b) {
  b ||= await backend();
  if (id === "ECX") return { id: "ECX", ticker: "ECX", decimals: 8 };
  const a = await b.api("/api/v1/assets/" + encodeURIComponent(id));
  return a.asset || a;
}
async function prepareTrade(args, b) {
  b ||= await backend();
  const generation = connectionGeneration, v = await vault(), [inAsset, outAsset, coins] = await Promise.all([resolveAsset(args.from, b), resolveAsset(args.to, b), myCoins("flush", b)]);
  if (!coins.token_metadata_available && args.from !== "ECX") throw Error("Token signing metadata is temporarily unavailable; try again shortly");
  const quote = await b.api("/api/v1/quote/swap?" + new URLSearchParams({ from: args.from === "ECX" ? "ECX" : args.from, to: args.to === "ECX" ? "ECX" : args.to, amount: args.amount, slippage_bps: "100" }));
  const minOut = args.minOut || decimal(quote.min_out_units, outAsset.decimals), pools = args.pools || quote.best.pools;
  if (pools.some((p) => !/^[a-f0-9]{64}$/.test(p))) throw Error("Invalid route");
  let side = inAsset.id === "ECX" ? "" : inAsset.id;
  for (const id of pools) {
    const p = await b.api("/api/v1/pools/" + id);
    const a = p.asset_a_id || "", other = p.asset_b_id || "";
    if (side !== a && side !== other) throw Error("Pool does not match input asset");
    side = side === a ? other : a;
  }
  if (side !== (outAsset.id === "ECX" ? "" : outAsset.id)) throw Error("Pool does not match output asset");
  if (generation !== connectionGeneration) throw Error("Connection changed; review this transaction again");
  plan = tradePlan({ from: v.address, assetIn: inAsset.id, assetOut: outAsset.id, amount: args.amount, decimalsIn: inAsset.decimals, decimalsOut: outAsset.decimals, minOut, pools, utxos: coins.utxos.filter((u) => !u.coinbase || u.confirmations >= 100) });
  plan.connectionGeneration = generation;
  plan.summary.tickerIn = inAsset.ticker;
  plan.summary.tickerOut = outAsset.ticker;
  plan.summary.quote = quote.amount_out;
  return plan;
}
async function requestPlan(request2) {
  const b = await backend();
  if (request2.verb === "buy" || request2.verb === "sell") {
    const a = await resolveAsset(request2.asset, b);
    if (a.ticker !== request2.launch) throw Error("Ticker does not match asset ID");
    const l = await b.api("/api/v1/launches/" + request2.asset);
    if (l.state === "graduated") throw Error("Use the graduated pool");
    return prepareTrade({ from: request2.verb === "buy" ? "ECX" : request2.asset, to: request2.verb === "buy" ? request2.asset : "ECX", amount: request2.ecx || request2.tokens, minOut: request2.min_tokens || request2.min_ecx, pools: [l.pool_id] }, b);
  }
  if (request2.verb === "swap" || request2.verb === "route") {
    const refs = await b.api("/api/v1/assets?limit=100");
    const resolve = (t) => t === "ECX" ? "ECX" : refs.items.find((a) => a.ticker === t)?.id;
    const from = resolve(request2.from), to = resolve(request2.to);
    if (!from || !to) throw Error("Asset not found");
    return prepareTrade({ from, to, amount: request2.amount, minOut: request2.min_out, pools: (request2.pools || request2.pool).split(",") }, b);
  }
  throw Error("Unsupported action");
}
async function internal(m) {
  switch (m.type) {
    case "STATE":
      return status();
    case "CONNECTION":
      return connectionDetails();
    case "PAIR_RPC":
      return saveConnection(m.connection);
    case "USE_EXPLORER":
      return useExplorer();
    case "GENERATE":
      return { mnemonic: newMnemonic() };
    case "CREATE":
      if (await vault()) throw Error("Wallet already exists");
      {
        if (!m.imported && !checkRecovery(m.mnemonic, m.backupCheck?.indices, m.backupCheck?.answers)) throw Error("Recovery words do not match");
        const v = await encryptVault(m.mnemonic, m.password);
        await store.set({ vault: v });
        setUnlocked(m.mnemonic);
        return status();
      }
    case "UNLOCK": {
      const phrase = await decryptVault(await vault(), m.password);
      await updateAccounts(phrase);
      setUnlocked(phrase);
      return status();
    }
    case "LOCK":
      lock();
      return status();
    case "DASHBOARD": {
      const v = await vault();
      if (!v) throw Error("No wallet");
      const b = await backend(), [coinResults, network, assets, holdings] = await Promise.all([Promise.allSettled([myCoins("flush", b), myCoins("ecash", b)]), b.status(), b.api("/api/v1/assets?limit=100"), b.holdings(v.address)]);
      const coins = coinResults[0].status === "fulfilled" ? coinResults[0].value : null, l1coins = coinResults[1].status === "fulfilled" ? coinResults[1].value : null;
      const held = holdings.items.filter((h) => h.kind === "asset");
      const known = new Set(assets.items.map((a) => a.id));
      for (const h of held) {
        if (!known.has(h.asset_id)) {
          assets.items.push(await resolveAsset(h.asset_id, b));
          known.add(h.asset_id);
        }
      }
      const logos = Object.fromEntries(await Promise.all(held.map(async (h) => [h.asset_id, await b.logo(h.asset_id)])));
      const balance = coins ? coins.utxos.filter((u) => !u.token && (!u.coinbase || u.confirmations >= 100)).reduce((s, u) => s + BigInt(u.value_sat), 0n).toString() : null;
      const l1balance = l1coins ? l1coins.utxos.filter((u) => !u.coinbase || u.confirmations >= 100).reduce((s, u) => s + BigInt(u.value_sat), 0n).toString() : null;
      return { coins, l1coins, network, assets: assets.items, holdings: held, logos, connectionMode: b.mode, tokenMetadataAvailable: !holdings.unavailable, balance_sat: balance, l1_balance_sat: l1balance, deposit: depositAddress(v.address), history: (await store.get("history")).history || [] };
    }
    case "HISTORY": {
      const v = await vault();
      if (!v) throw Error("No wallet");
      const b = await backend(), results = await Promise.allSettled([b.history("ecash", v.accounts.ecash.address), b.history("flush", v.address)]);
      const entries = results.flatMap((r) => r.status === "fulfilled" ? r.value : []), merged = new Map(entries.map((t) => [t.chain + t.txid, t]));
      for (const t of (await store.get("history")).history || []) {
        const chain2 = t.chain || "flush", old = merged.get(chain2 + t.txid);
        merged.set(chain2 + t.txid, { ...old, ...t, chain: chain2 });
      }
      return { items: [...merged.values()].sort((a, b2) => b2.time - a.time), unavailableChains: results.flatMap((r, i) => r.status === "rejected" ? [i === 0 ? "eCash" : "Flush"] : []), localOnly: b.mode === "rpc" };
    }
    case "PREPARE_SEND": {
      const generation = connectionGeneration, b = await backend(), chain2 = m.chain || "flush", v = await vault(), coins = await myCoins(chain2, b), a = await resolveAsset(m.asset || "ECX", b);
      if (chain2 === "ecash" && a.id !== "ECX") throw Error("Tokens are sent on Flush");
      if (chain2 === "flush" && a.id !== "ECX" && !coins.token_metadata_available) throw Error("Token signing metadata is temporarily unavailable; try again shortly");
      if (generation !== connectionGeneration) throw Error("Connection changed; review this transaction again");
      plan = paymentPlan({ from: chain2 === "ecash" ? v.accounts.ecash.address : v.address, to: m.to, amount: m.amount, asset: a.id, decimals: a.decimals, utxos: coins.utxos.filter((u) => !u.coinbase || u.confirmations >= 100), chain: chain2 });
      plan.connectionGeneration = generation;
      plan.summary.ticker = a.ticker;
      return plan;
    }
    case "PREPARE_SWAP":
      return prepareTrade(m);
    case "APPROVE": {
      if (!unlocked()) throw Error("Unlock your wallet first");
      if (!plan || m.planId !== plan.id || plan.connectionGeneration !== connectionGeneration || Date.now() - plan.created > 12e4) throw Error("Quote expired or connection changed; review again");
      const approved = plan;
      plan = null;
      const b = await backend(), { signPlan: signPlan2 } = await Promise.resolve().then(() => (init_core(), core_exports));
      if (!unlocked()) throw Error("Unlock your wallet first");
      const signed = signPlan2(approved, mnemonic), result = await b.broadcast(approved.chain || "flush", signed.hex);
      if (result.txid !== signed.txid) throw Error("Broadcast returned an unexpected transaction ID");
      const old = (await store.get("history")).history || [];
      await store.set({ history: [{ ...approved.summary, chain: approved.chain || "flush", txid: result.txid, time: Date.now() }, ...old].slice(0, 100) });
      return result;
    }
    case "BACKUP":
      return { vault: await vault() };
    case "RECOVERY":
      return { mnemonic: await decryptVault(await vault(), m.password) };
    case "RESTORE": {
      if (await vault()) throw Error("A wallet already exists");
      const phrase = await decryptVault(m.vault, m.password);
      await store.set({ vault: { ...m.vault, accounts: publicAccounts(phrase) } });
      setUnlocked(phrase);
      return status();
    }
    case "PENDING":
      return (await chrome.storage.session.get("pending")).pending || null;
    case "PREPARE_PENDING": {
      const p = (await chrome.storage.session.get("pending")).pending;
      if (!p || Date.now() > p.expires) throw Error("Request expired");
      const r = parseUri(p.uri);
      if (r.verb === "connect") {
        const v = await vault();
        if (!v) throw Error("Create a wallet first");
        return { summary: { type: "connect", origin: p.origin, address: v.address }, request: r };
      }
      return requestPlan(r);
    }
    case "RESOLVE_PENDING": {
      const p = (await chrome.storage.session.get("pending")).pending;
      if (!p) throw Error("Request expired");
      let result;
      if (m.approved) {
        const r = parseUri(p.uri);
        if (r.verb === "connect") {
          const v = await vault();
          if (!v) throw Error("No wallet");
          result = { address: v.address, publicKey: v.publicKey, network: "ecashbeta" };
          if (!p.direct) await chrome.tabs.create({ url: "https://flush.markets/connect#" + new URLSearchParams({ address: v.address, nonce: r.nonce, network: "ecashbeta" }) });
        } else result = await internal({ type: "APPROVE", planId: m.planId });
      }
      if (m.approved) {
        const used = (await chrome.storage.session.get("usedUris")).usedUris || {};
        used[await uriKey(p.uri)] = Number(parseUri(p.uri).exp);
        for (const [k, v] of Object.entries(used)) if (v < Math.floor(Date.now() / 1e3)) delete used[k];
        await chrome.storage.session.set({ usedUris: used });
      }
      pendingReply?.(m.approved ? { ok: true, result } : { ok: false, error: "User rejected" });
      pendingReply = null;
      await chrome.storage.session.remove("pending");
      return result || { rejected: true };
    }
    default:
      throw Error("Unknown wallet command");
  }
}
chrome.runtime.onMessage.addListener((m, sender, reply) => {
  const trusted = sender.id === chrome.runtime.id && sender.url?.startsWith(chrome.runtime.getURL(""));
  if (trusted) {
    internal(m).then((result) => reply({ ok: true, result })).catch((e) => reply({ ok: false, error: e.message }));
    return true;
  }
  if (m.type !== "DAPP" || sender.frameId !== 0 || sender.origin !== "https://flush.markets") {
    reply({ ok: false, error: "Origin not allowed" });
    return false;
  }
  (async () => {
    if (m.method === "flush_requestAddress") m.uri = "flush:connect?" + new URLSearchParams({ v: "1", network: "ecashbeta", exp: String(Math.floor(Date.now() / 1e3) + 600), origin: "https://flush.markets", callback: "https://flush.markets/connect", nonce: crypto.randomUUID().replaceAll("-", "") });
    parseUri(m.uri);
    const used = (await chrome.storage.session.get("usedUris")).usedUris || {};
    if (used[await uriKey(m.uri)]) throw Error("This request was already completed");
    const old = (await chrome.storage.session.get("pending")).pending;
    if (old && old.expires > Date.now()) throw Error("Another wallet request is pending");
    await chrome.storage.session.set({ pending: { uri: m.uri, direct: m.method === "flush_requestAddress", origin: sender.origin, tabId: sender.tab.id, expires: Date.now() + 12e4 } });
    pendingReply = reply;
    const w = await chrome.windows.create({ url: chrome.runtime.getURL("popup.html") + "?approval=1", type: "popup", width: 420, height: 730 });
    pendingWindow = w.id;
  })().catch((e) => reply({ ok: false, error: e.message }));
  return true;
});
chrome.windows.onRemoved.addListener((id) => {
  if (id === pendingWindow) {
    pendingReply?.({ ok: false, error: "Wallet window closed" });
    pendingReply = null;
    pendingWindow = null;
    chrome.storage.session.remove("pending");
  }
});
/*! Bundled license information:

@noble/hashes/esm/utils.js:
@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip39/index.js:
  (*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/der.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip32/index.js:
  (*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)
*/
