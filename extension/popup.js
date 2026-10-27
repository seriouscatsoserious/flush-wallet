(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/qrcode/lib/can-promise.js
  var require_can_promise = __commonJS({
    "node_modules/qrcode/lib/can-promise.js"(exports, module) {
      module.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
      };
    }
  });

  // node_modules/qrcode/lib/core/utils.js
  var require_utils = __commonJS({
    "node_modules/qrcode/lib/core/utils.js"(exports) {
      var toSJISFunction;
      var CODEWORDS_COUNT = [
        0,
        // Not used
        26,
        44,
        70,
        100,
        134,
        172,
        196,
        242,
        292,
        346,
        404,
        466,
        532,
        581,
        655,
        733,
        815,
        901,
        991,
        1085,
        1156,
        1258,
        1364,
        1474,
        1588,
        1706,
        1828,
        1921,
        2051,
        2185,
        2323,
        2465,
        2611,
        2761,
        2876,
        3034,
        3196,
        3362,
        3532,
        3706
      ];
      exports.getSymbolSize = function getSymbolSize(version) {
        if (!version) throw new Error('"version" cannot be null or undefined');
        if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
        return version * 4 + 17;
      };
      exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
        return CODEWORDS_COUNT[version];
      };
      exports.getBCHDigit = function(data) {
        let digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      };
      exports.setToSJISFunction = function setToSJISFunction(f) {
        if (typeof f !== "function") {
          throw new Error('"toSJISFunc" is not a valid function.');
        }
        toSJISFunction = f;
      };
      exports.isKanjiModeEnabled = function() {
        return typeof toSJISFunction !== "undefined";
      };
      exports.toSJIS = function toSJIS(kanji) {
        return toSJISFunction(kanji);
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-level.js
  var require_error_correction_level = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
      exports.L = { bit: 1 };
      exports.M = { bit: 0 };
      exports.Q = { bit: 3 };
      exports.H = { bit: 2 };
      function fromString(string2) {
        if (typeof string2 !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string2.toLowerCase();
        switch (lcStr) {
          case "l":
          case "low":
            return exports.L;
          case "m":
          case "medium":
            return exports.M;
          case "q":
          case "quartile":
            return exports.Q;
          case "h":
          case "high":
            return exports.H;
          default:
            throw new Error("Unknown EC Level: " + string2);
        }
      }
      exports.isValid = function isValid(level) {
        return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
      };
      exports.from = function from(value2, defaultValue) {
        if (exports.isValid(value2)) {
          return value2;
        }
        try {
          return fromString(value2);
        } catch (e2) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/bit-buffer.js
  var require_bit_buffer = __commonJS({
    "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
      function BitBuffer() {
        this.buffer = [];
        this.length = 0;
      }
      BitBuffer.prototype = {
        get: function(index) {
          const bufIndex = Math.floor(index / 8);
          return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
        },
        put: function(num, length2) {
          for (let i = 0; i < length2; i++) {
            this.putBit((num >>> length2 - i - 1 & 1) === 1);
          }
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(bit) {
          const bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) {
            this.buffer.push(0);
          }
          if (bit) {
            this.buffer[bufIndex] |= 128 >>> this.length % 8;
          }
          this.length++;
        }
      };
      module.exports = BitBuffer;
    }
  });

  // node_modules/qrcode/lib/core/bit-matrix.js
  var require_bit_matrix = __commonJS({
    "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
      function BitMatrix(size) {
        if (!size || size < 1) {
          throw new Error("BitMatrix size must be defined and greater than 0");
        }
        this.size = size;
        this.data = new Uint8Array(size * size);
        this.reservedBit = new Uint8Array(size * size);
      }
      BitMatrix.prototype.set = function(row, col, value2, reserved) {
        const index = row * this.size + col;
        this.data[index] = value2;
        if (reserved) this.reservedBit[index] = true;
      };
      BitMatrix.prototype.get = function(row, col) {
        return this.data[row * this.size + col];
      };
      BitMatrix.prototype.xor = function(row, col, value2) {
        this.data[row * this.size + col] ^= value2;
      };
      BitMatrix.prototype.isReserved = function(row, col) {
        return this.reservedBit[row * this.size + col];
      };
      module.exports = BitMatrix;
    }
  });

  // node_modules/qrcode/lib/core/alignment-pattern.js
  var require_alignment_pattern = __commonJS({
    "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      exports.getRowColCoords = function getRowColCoords(version) {
        if (version === 1) return [];
        const posCount = Math.floor(version / 7) + 2;
        const size = getSymbolSize(version);
        const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
        const positions = [size - 7];
        for (let i = 1; i < posCount - 1; i++) {
          positions[i] = positions[i - 1] - intervals;
        }
        positions.push(6);
        return positions.reverse();
      };
      exports.getPositions = function getPositions(version) {
        const coords = [];
        const pos = exports.getRowColCoords(version);
        const posLength = pos.length;
        for (let i = 0; i < posLength; i++) {
          for (let j = 0; j < posLength; j++) {
            if (i === 0 && j === 0 || // top-left
            i === 0 && j === posLength - 1 || // bottom-left
            i === posLength - 1 && j === 0) {
              continue;
            }
            coords.push([pos[i], pos[j]]);
          }
        }
        return coords;
      };
    }
  });

  // node_modules/qrcode/lib/core/finder-pattern.js
  var require_finder_pattern = __commonJS({
    "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      var FINDER_PATTERN_SIZE = 7;
      exports.getPositions = function getPositions(version) {
        const size = getSymbolSize(version);
        return [
          // top-left
          [0, 0],
          // top-right
          [size - FINDER_PATTERN_SIZE, 0],
          // bottom-left
          [0, size - FINDER_PATTERN_SIZE]
        ];
      };
    }
  });

  // node_modules/qrcode/lib/core/mask-pattern.js
  var require_mask_pattern = __commonJS({
    "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
      exports.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var PenaltyScores = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
      };
      exports.isValid = function isValid(mask) {
        return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
      };
      exports.from = function from(value2) {
        return exports.isValid(value2) ? parseInt(value2, 10) : void 0;
      };
      exports.getPenaltyN1 = function getPenaltyN1(data) {
        const size = data.size;
        let points = 0;
        let sameCountCol = 0;
        let sameCountRow = 0;
        let lastCol = null;
        let lastRow = null;
        for (let row = 0; row < size; row++) {
          sameCountCol = sameCountRow = 0;
          lastCol = lastRow = null;
          for (let col = 0; col < size; col++) {
            let module2 = data.get(row, col);
            if (module2 === lastCol) {
              sameCountCol++;
            } else {
              if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
              lastCol = module2;
              sameCountCol = 1;
            }
            module2 = data.get(col, row);
            if (module2 === lastRow) {
              sameCountRow++;
            } else {
              if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
              lastRow = module2;
              sameCountRow = 1;
            }
          }
          if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
          if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        }
        return points;
      };
      exports.getPenaltyN2 = function getPenaltyN2(data) {
        const size = data.size;
        let points = 0;
        for (let row = 0; row < size - 1; row++) {
          for (let col = 0; col < size - 1; col++) {
            const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
            if (last === 4 || last === 0) points++;
          }
        }
        return points * PenaltyScores.N2;
      };
      exports.getPenaltyN3 = function getPenaltyN3(data) {
        const size = data.size;
        let points = 0;
        let bitsCol = 0;
        let bitsRow = 0;
        for (let row = 0; row < size; row++) {
          bitsCol = bitsRow = 0;
          for (let col = 0; col < size; col++) {
            bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
            if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
            bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
            if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
          }
        }
        return points * PenaltyScores.N3;
      };
      exports.getPenaltyN4 = function getPenaltyN4(data) {
        let darkCount = 0;
        const modulesCount = data.data.length;
        for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
        const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
        return k * PenaltyScores.N4;
      };
      function getMaskAt(maskPattern, i, j) {
        switch (maskPattern) {
          case exports.Patterns.PATTERN000:
            return (i + j) % 2 === 0;
          case exports.Patterns.PATTERN001:
            return i % 2 === 0;
          case exports.Patterns.PATTERN010:
            return j % 3 === 0;
          case exports.Patterns.PATTERN011:
            return (i + j) % 3 === 0;
          case exports.Patterns.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case exports.Patterns.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case exports.Patterns.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case exports.Patterns.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      }
      exports.applyMask = function applyMask(pattern, data) {
        const size = data.size;
        for (let col = 0; col < size; col++) {
          for (let row = 0; row < size; row++) {
            if (data.isReserved(row, col)) continue;
            data.xor(row, col, getMaskAt(pattern, row, col));
          }
        }
      };
      exports.getBestMask = function getBestMask(data, setupFormatFunc) {
        const numPatterns = Object.keys(exports.Patterns).length;
        let bestPattern = 0;
        let lowerPenalty = Infinity;
        for (let p = 0; p < numPatterns; p++) {
          setupFormatFunc(p);
          exports.applyMask(p, data);
          const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
          exports.applyMask(p, data);
          if (penalty < lowerPenalty) {
            lowerPenalty = penalty;
            bestPattern = p;
          }
        }
        return bestPattern;
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-code.js
  var require_error_correction_code = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
      var ECLevel = require_error_correction_level();
      var EC_BLOCKS_TABLE = [
        // L  M  Q  H
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        2,
        2,
        4,
        1,
        2,
        4,
        4,
        2,
        4,
        4,
        4,
        2,
        4,
        6,
        5,
        2,
        4,
        6,
        6,
        2,
        5,
        8,
        8,
        4,
        5,
        8,
        8,
        4,
        5,
        8,
        11,
        4,
        8,
        10,
        11,
        4,
        9,
        12,
        16,
        4,
        9,
        16,
        16,
        6,
        10,
        12,
        18,
        6,
        10,
        17,
        16,
        6,
        11,
        16,
        19,
        6,
        13,
        18,
        21,
        7,
        14,
        21,
        25,
        8,
        16,
        20,
        25,
        8,
        17,
        23,
        25,
        9,
        17,
        23,
        34,
        9,
        18,
        25,
        30,
        10,
        20,
        27,
        32,
        12,
        21,
        29,
        35,
        12,
        23,
        34,
        37,
        12,
        25,
        34,
        40,
        13,
        26,
        35,
        42,
        14,
        28,
        38,
        45,
        15,
        29,
        40,
        48,
        16,
        31,
        43,
        51,
        17,
        33,
        45,
        54,
        18,
        35,
        48,
        57,
        19,
        37,
        51,
        60,
        19,
        38,
        53,
        63,
        20,
        40,
        56,
        66,
        21,
        43,
        59,
        70,
        22,
        45,
        62,
        74,
        24,
        47,
        65,
        77,
        25,
        49,
        68,
        81
      ];
      var EC_CODEWORDS_TABLE = [
        // L  M  Q  H
        7,
        10,
        13,
        17,
        10,
        16,
        22,
        28,
        15,
        26,
        36,
        44,
        20,
        36,
        52,
        64,
        26,
        48,
        72,
        88,
        36,
        64,
        96,
        112,
        40,
        72,
        108,
        130,
        48,
        88,
        132,
        156,
        60,
        110,
        160,
        192,
        72,
        130,
        192,
        224,
        80,
        150,
        224,
        264,
        96,
        176,
        260,
        308,
        104,
        198,
        288,
        352,
        120,
        216,
        320,
        384,
        132,
        240,
        360,
        432,
        144,
        280,
        408,
        480,
        168,
        308,
        448,
        532,
        180,
        338,
        504,
        588,
        196,
        364,
        546,
        650,
        224,
        416,
        600,
        700,
        224,
        442,
        644,
        750,
        252,
        476,
        690,
        816,
        270,
        504,
        750,
        900,
        300,
        560,
        810,
        960,
        312,
        588,
        870,
        1050,
        336,
        644,
        952,
        1110,
        360,
        700,
        1020,
        1200,
        390,
        728,
        1050,
        1260,
        420,
        784,
        1140,
        1350,
        450,
        812,
        1200,
        1440,
        480,
        868,
        1290,
        1530,
        510,
        924,
        1350,
        1620,
        540,
        980,
        1440,
        1710,
        570,
        1036,
        1530,
        1800,
        570,
        1064,
        1590,
        1890,
        600,
        1120,
        1680,
        1980,
        630,
        1204,
        1770,
        2100,
        660,
        1260,
        1860,
        2220,
        720,
        1316,
        1950,
        2310,
        750,
        1372,
        2040,
        2430
      ];
      exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/galois-field.js
  var require_galois_field = __commonJS({
    "node_modules/qrcode/lib/core/galois-field.js"(exports) {
      var EXP_TABLE = new Uint8Array(512);
      var LOG_TABLE = new Uint8Array(256);
      (function initTables() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
          EXP_TABLE[i] = x;
          LOG_TABLE[x] = i;
          x <<= 1;
          if (x & 256) {
            x ^= 285;
          }
        }
        for (let i = 255; i < 512; i++) {
          EXP_TABLE[i] = EXP_TABLE[i - 255];
        }
      })();
      exports.log = function log(n) {
        if (n < 1) throw new Error("log(" + n + ")");
        return LOG_TABLE[n];
      };
      exports.exp = function exp(n) {
        return EXP_TABLE[n];
      };
      exports.mul = function mul(x, y) {
        if (x === 0 || y === 0) return 0;
        return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
      };
    }
  });

  // node_modules/qrcode/lib/core/polynomial.js
  var require_polynomial = __commonJS({
    "node_modules/qrcode/lib/core/polynomial.js"(exports) {
      var GF = require_galois_field();
      exports.mul = function mul(p1, p2) {
        const coeff = new Uint8Array(p1.length + p2.length - 1);
        for (let i = 0; i < p1.length; i++) {
          for (let j = 0; j < p2.length; j++) {
            coeff[i + j] ^= GF.mul(p1[i], p2[j]);
          }
        }
        return coeff;
      };
      exports.mod = function mod(divident, divisor) {
        let result = new Uint8Array(divident);
        while (result.length - divisor.length >= 0) {
          const coeff = result[0];
          for (let i = 0; i < divisor.length; i++) {
            result[i] ^= GF.mul(divisor[i], coeff);
          }
          let offset = 0;
          while (offset < result.length && result[offset] === 0) offset++;
          result = result.slice(offset);
        }
        return result;
      };
      exports.generateECPolynomial = function generateECPolynomial(degree) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < degree; i++) {
          poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
        }
        return poly;
      };
    }
  });

  // node_modules/qrcode/lib/core/reed-solomon-encoder.js
  var require_reed_solomon_encoder = __commonJS({
    "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
      var Polynomial = require_polynomial();
      function ReedSolomonEncoder(degree) {
        this.genPoly = void 0;
        this.degree = degree;
        if (this.degree) this.initialize(this.degree);
      }
      ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
        this.degree = degree;
        this.genPoly = Polynomial.generateECPolynomial(this.degree);
      };
      ReedSolomonEncoder.prototype.encode = function encode19(data) {
        if (!this.genPoly) {
          throw new Error("Encoder not initialized");
        }
        const paddedData = new Uint8Array(data.length + this.degree);
        paddedData.set(data);
        const remainder = Polynomial.mod(paddedData, this.genPoly);
        const start = this.degree - remainder.length;
        if (start > 0) {
          const buff = new Uint8Array(this.degree);
          buff.set(remainder, start);
          return buff;
        }
        return remainder;
      };
      module.exports = ReedSolomonEncoder;
    }
  });

  // node_modules/qrcode/lib/core/version-check.js
  var require_version_check = __commonJS({
    "node_modules/qrcode/lib/core/version-check.js"(exports) {
      exports.isValid = function isValid(version) {
        return !isNaN(version) && version >= 1 && version <= 40;
      };
    }
  });

  // node_modules/qrcode/lib/core/regex.js
  var require_regex = __commonJS({
    "node_modules/qrcode/lib/core/regex.js"(exports) {
      var numeric = "[0-9]+";
      var alphanumeric = "[A-Z $%*+\\-./:]+";
      var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
      kanji = kanji.replace(/u/g, "\\u");
      var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
      exports.KANJI = new RegExp(kanji, "g");
      exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
      exports.BYTE = new RegExp(byte, "g");
      exports.NUMERIC = new RegExp(numeric, "g");
      exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
      var TEST_KANJI = new RegExp("^" + kanji + "$");
      var TEST_NUMERIC = new RegExp("^" + numeric + "$");
      var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
      exports.testKanji = function testKanji(str) {
        return TEST_KANJI.test(str);
      };
      exports.testNumeric = function testNumeric(str) {
        return TEST_NUMERIC.test(str);
      };
      exports.testAlphanumeric = function testAlphanumeric(str) {
        return TEST_ALPHANUMERIC.test(str);
      };
    }
  });

  // node_modules/qrcode/lib/core/mode.js
  var require_mode = __commonJS({
    "node_modules/qrcode/lib/core/mode.js"(exports) {
      var VersionCheck = require_version_check();
      var Regex = require_regex();
      exports.NUMERIC = {
        id: "Numeric",
        bit: 1 << 0,
        ccBits: [10, 12, 14]
      };
      exports.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 1 << 1,
        ccBits: [9, 11, 13]
      };
      exports.BYTE = {
        id: "Byte",
        bit: 1 << 2,
        ccBits: [8, 16, 16]
      };
      exports.KANJI = {
        id: "Kanji",
        bit: 1 << 3,
        ccBits: [8, 10, 12]
      };
      exports.MIXED = {
        bit: -1
      };
      exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
        if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid version: " + version);
        }
        if (version >= 1 && version < 10) return mode.ccBits[0];
        else if (version < 27) return mode.ccBits[1];
        return mode.ccBits[2];
      };
      exports.getBestModeForData = function getBestModeForData(dataStr) {
        if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
        else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
        else if (Regex.testKanji(dataStr)) return exports.KANJI;
        else return exports.BYTE;
      };
      exports.toString = function toString(mode) {
        if (mode && mode.id) return mode.id;
        throw new Error("Invalid mode");
      };
      exports.isValid = function isValid(mode) {
        return mode && mode.bit && mode.ccBits;
      };
      function fromString(string2) {
        if (typeof string2 !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string2.toLowerCase();
        switch (lcStr) {
          case "numeric":
            return exports.NUMERIC;
          case "alphanumeric":
            return exports.ALPHANUMERIC;
          case "kanji":
            return exports.KANJI;
          case "byte":
            return exports.BYTE;
          default:
            throw new Error("Unknown mode: " + string2);
        }
      }
      exports.from = function from(value2, defaultValue) {
        if (exports.isValid(value2)) {
          return value2;
        }
        try {
          return fromString(value2);
        } catch (e2) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/version.js
  var require_version = __commonJS({
    "node_modules/qrcode/lib/core/version.js"(exports) {
      var Utils = require_utils();
      var ECCode = require_error_correction_code();
      var ECLevel = require_error_correction_level();
      var Mode = require_mode();
      var VersionCheck = require_version_check();
      var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      var G18_BCH = Utils.getBCHDigit(G18);
      function getBestVersionForDataLength(mode, length2, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          if (length2 <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      function getReservedBitsCount(mode, version) {
        return Mode.getCharCountIndicator(mode, version) + 4;
      }
      function getTotalBitsFromDataArray(segments, version) {
        let totalBits = 0;
        segments.forEach(function(data) {
          const reservedBits = getReservedBitsCount(data.mode, version);
          totalBits += reservedBits + data.getBitsLength();
        });
        return totalBits;
      }
      function getBestVersionForMixedData(segments, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          const length2 = getTotalBitsFromDataArray(segments, currentVersion);
          if (length2 <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      exports.from = function from(value2, defaultValue) {
        if (VersionCheck.isValid(value2)) {
          return parseInt(value2, 10);
        }
        return defaultValue;
      };
      exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid QR Code version");
        }
        if (typeof mode === "undefined") mode = Mode.BYTE;
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (mode === Mode.MIXED) return dataTotalCodewordsBits;
        const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
        switch (mode) {
          case Mode.NUMERIC:
            return Math.floor(usableBits / 10 * 3);
          case Mode.ALPHANUMERIC:
            return Math.floor(usableBits / 11 * 2);
          case Mode.KANJI:
            return Math.floor(usableBits / 13);
          case Mode.BYTE:
          default:
            return Math.floor(usableBits / 8);
        }
      };
      exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
        let seg;
        const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
        if (Array.isArray(data)) {
          if (data.length > 1) {
            return getBestVersionForMixedData(data, ecl);
          }
          if (data.length === 0) {
            return 1;
          }
          seg = data[0];
        } else {
          seg = data;
        }
        return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
      };
      exports.getEncodedBits = function getEncodedBits(version) {
        if (!VersionCheck.isValid(version) || version < 7) {
          throw new Error("Invalid QR Code version");
        }
        let d = version << 12;
        while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
          d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
        }
        return version << 12 | d;
      };
    }
  });

  // node_modules/qrcode/lib/core/format-info.js
  var require_format_info = __commonJS({
    "node_modules/qrcode/lib/core/format-info.js"(exports) {
      var Utils = require_utils();
      var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      var G15_BCH = Utils.getBCHDigit(G15);
      exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
        const data = errorCorrectionLevel.bit << 3 | mask;
        let d = data << 10;
        while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
          d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
        }
        return (data << 10 | d) ^ G15_MASK;
      };
    }
  });

  // node_modules/qrcode/lib/core/numeric-data.js
  var require_numeric_data = __commonJS({
    "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
      var Mode = require_mode();
      function NumericData(data) {
        this.mode = Mode.NUMERIC;
        this.data = data.toString();
      }
      NumericData.getBitsLength = function getBitsLength(length2) {
        return 10 * Math.floor(length2 / 3) + (length2 % 3 ? length2 % 3 * 3 + 1 : 0);
      };
      NumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      NumericData.prototype.getBitsLength = function getBitsLength() {
        return NumericData.getBitsLength(this.data.length);
      };
      NumericData.prototype.write = function write(bitBuffer) {
        let i, group, value2;
        for (i = 0; i + 3 <= this.data.length; i += 3) {
          group = this.data.substr(i, 3);
          value2 = parseInt(group, 10);
          bitBuffer.put(value2, 10);
        }
        const remainingNum = this.data.length - i;
        if (remainingNum > 0) {
          group = this.data.substr(i);
          value2 = parseInt(group, 10);
          bitBuffer.put(value2, remainingNum * 3 + 1);
        }
      };
      module.exports = NumericData;
    }
  });

  // node_modules/qrcode/lib/core/alphanumeric-data.js
  var require_alphanumeric_data = __commonJS({
    "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
      var Mode = require_mode();
      var ALPHA_NUM_CHARS = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        " ",
        "$",
        "%",
        "*",
        "+",
        "-",
        ".",
        "/",
        ":"
      ];
      function AlphanumericData(data) {
        this.mode = Mode.ALPHANUMERIC;
        this.data = data;
      }
      AlphanumericData.getBitsLength = function getBitsLength(length2) {
        return 11 * Math.floor(length2 / 2) + 6 * (length2 % 2);
      };
      AlphanumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      AlphanumericData.prototype.getBitsLength = function getBitsLength() {
        return AlphanumericData.getBitsLength(this.data.length);
      };
      AlphanumericData.prototype.write = function write(bitBuffer) {
        let i;
        for (i = 0; i + 2 <= this.data.length; i += 2) {
          let value2 = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
          value2 += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
          bitBuffer.put(value2, 11);
        }
        if (this.data.length % 2) {
          bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
        }
      };
      module.exports = AlphanumericData;
    }
  });

  // node_modules/qrcode/lib/core/byte-data.js
  var require_byte_data = __commonJS({
    "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
      var Mode = require_mode();
      function ByteData(data) {
        this.mode = Mode.BYTE;
        if (typeof data === "string") {
          this.data = new TextEncoder().encode(data);
        } else {
          this.data = new Uint8Array(data);
        }
      }
      ByteData.getBitsLength = function getBitsLength(length2) {
        return length2 * 8;
      };
      ByteData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      ByteData.prototype.getBitsLength = function getBitsLength() {
        return ByteData.getBitsLength(this.data.length);
      };
      ByteData.prototype.write = function(bitBuffer) {
        for (let i = 0, l = this.data.length; i < l; i++) {
          bitBuffer.put(this.data[i], 8);
        }
      };
      module.exports = ByteData;
    }
  });

  // node_modules/qrcode/lib/core/kanji-data.js
  var require_kanji_data = __commonJS({
    "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
      var Mode = require_mode();
      var Utils = require_utils();
      function KanjiData(data) {
        this.mode = Mode.KANJI;
        this.data = data;
      }
      KanjiData.getBitsLength = function getBitsLength(length2) {
        return length2 * 13;
      };
      KanjiData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      KanjiData.prototype.getBitsLength = function getBitsLength() {
        return KanjiData.getBitsLength(this.data.length);
      };
      KanjiData.prototype.write = function(bitBuffer) {
        let i;
        for (i = 0; i < this.data.length; i++) {
          let value2 = Utils.toSJIS(this.data[i]);
          if (value2 >= 33088 && value2 <= 40956) {
            value2 -= 33088;
          } else if (value2 >= 57408 && value2 <= 60351) {
            value2 -= 49472;
          } else {
            throw new Error(
              "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
            );
          }
          value2 = (value2 >>> 8 & 255) * 192 + (value2 & 255);
          bitBuffer.put(value2, 13);
        }
      };
      module.exports = KanjiData;
    }
  });

  // node_modules/dijkstrajs/dijkstra.js
  var require_dijkstra = __commonJS({
    "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
      "use strict";
      var dijkstra = {
        single_source_shortest_paths: function(graph, s, d) {
          var predecessors = {};
          var costs = {};
          costs[s] = 0;
          var open = dijkstra.PriorityQueue.make();
          open.push(s, 0);
          var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
          while (!open.empty()) {
            closest = open.pop();
            u = closest.value;
            cost_of_s_to_u = closest.cost;
            adjacent_nodes = graph[u] || {};
            for (v in adjacent_nodes) {
              if (adjacent_nodes.hasOwnProperty(v)) {
                cost_of_e = adjacent_nodes[v];
                cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
                cost_of_s_to_v = costs[v];
                first_visit = typeof costs[v] === "undefined";
                if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                  costs[v] = cost_of_s_to_u_plus_cost_of_e;
                  open.push(v, cost_of_s_to_u_plus_cost_of_e);
                  predecessors[v] = u;
                }
              }
            }
          }
          if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
            var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
            throw new Error(msg);
          }
          return predecessors;
        },
        extract_shortest_path_from_predecessor_list: function(predecessors, d) {
          var nodes = [];
          var u = d;
          var predecessor;
          while (u) {
            nodes.push(u);
            predecessor = predecessors[u];
            u = predecessors[u];
          }
          nodes.reverse();
          return nodes;
        },
        find_path: function(graph, s, d) {
          var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
          return dijkstra.extract_shortest_path_from_predecessor_list(
            predecessors,
            d
          );
        },
        /**
         * A very naive priority queue implementation.
         */
        PriorityQueue: {
          make: function(opts) {
            var T = dijkstra.PriorityQueue, t = {}, key;
            opts = opts || {};
            for (key in T) {
              if (T.hasOwnProperty(key)) {
                t[key] = T[key];
              }
            }
            t.queue = [];
            t.sorter = opts.sorter || T.default_sorter;
            return t;
          },
          default_sorter: function(a, b) {
            return a.cost - b.cost;
          },
          /**
           * Add a new item to the queue and ensure the highest priority element
           * is at the front of the queue.
           */
          push: function(value2, cost) {
            var item = { value: value2, cost };
            this.queue.push(item);
            this.queue.sort(this.sorter);
          },
          /**
           * Return the highest priority element in the queue.
           */
          pop: function() {
            return this.queue.shift();
          },
          empty: function() {
            return this.queue.length === 0;
          }
        }
      };
      if (typeof module !== "undefined") {
        module.exports = dijkstra;
      }
    }
  });

  // node_modules/qrcode/lib/core/segments.js
  var require_segments = __commonJS({
    "node_modules/qrcode/lib/core/segments.js"(exports) {
      var Mode = require_mode();
      var NumericData = require_numeric_data();
      var AlphanumericData = require_alphanumeric_data();
      var ByteData = require_byte_data();
      var KanjiData = require_kanji_data();
      var Regex = require_regex();
      var Utils = require_utils();
      var dijkstra = require_dijkstra();
      function getStringByteLength(str) {
        return unescape(encodeURIComponent(str)).length;
      }
      function getSegments(regex2, mode, str) {
        const segments = [];
        let result;
        while ((result = regex2.exec(str)) !== null) {
          segments.push({
            data: result[0],
            index: result.index,
            mode,
            length: result[0].length
          });
        }
        return segments;
      }
      function getSegmentsFromString(dataStr) {
        const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
        const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
        let byteSegs;
        let kanjiSegs;
        if (Utils.isKanjiModeEnabled()) {
          byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
          kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
        } else {
          byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
          kanjiSegs = [];
        }
        const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
        return segs.sort(function(s1, s2) {
          return s1.index - s2.index;
        }).map(function(obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          };
        });
      }
      function getSegmentBitsLength(length2, mode) {
        switch (mode) {
          case Mode.NUMERIC:
            return NumericData.getBitsLength(length2);
          case Mode.ALPHANUMERIC:
            return AlphanumericData.getBitsLength(length2);
          case Mode.KANJI:
            return KanjiData.getBitsLength(length2);
          case Mode.BYTE:
            return ByteData.getBitsLength(length2);
        }
      }
      function mergeSegments(segs) {
        return segs.reduce(function(acc, curr) {
          const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
          if (prevSeg && prevSeg.mode === curr.mode) {
            acc[acc.length - 1].data += curr.data;
            return acc;
          }
          acc.push(curr);
          return acc;
        }, []);
      }
      function buildNodes(segs) {
        const nodes = [];
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          switch (seg.mode) {
            case Mode.NUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.ALPHANUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.KANJI:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
              break;
            case Mode.BYTE:
              nodes.push([
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
          }
        }
        return nodes;
      }
      function buildGraph(nodes, version) {
        const table = {};
        const graph = { start: {} };
        let prevNodeIds = ["start"];
        for (let i = 0; i < nodes.length; i++) {
          const nodeGroup = nodes[i];
          const currentNodeIds = [];
          for (let j = 0; j < nodeGroup.length; j++) {
            const node = nodeGroup[j];
            const key = "" + i + j;
            currentNodeIds.push(key);
            table[key] = { node, lastCount: 0 };
            graph[key] = {};
            for (let n = 0; n < prevNodeIds.length; n++) {
              const prevNodeId = prevNodeIds[n];
              if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
                graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
                table[prevNodeId].lastCount += node.length;
              } else {
                if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
                graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
              }
            }
          }
          prevNodeIds = currentNodeIds;
        }
        for (let n = 0; n < prevNodeIds.length; n++) {
          graph[prevNodeIds[n]].end = 0;
        }
        return { map: graph, table };
      }
      function buildSingleSegment(data, modesHint) {
        let mode;
        const bestMode = Mode.getBestModeForData(data);
        mode = Mode.from(modesHint, bestMode);
        if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
          throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
        }
        if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
          mode = Mode.BYTE;
        }
        switch (mode) {
          case Mode.NUMERIC:
            return new NumericData(data);
          case Mode.ALPHANUMERIC:
            return new AlphanumericData(data);
          case Mode.KANJI:
            return new KanjiData(data);
          case Mode.BYTE:
            return new ByteData(data);
        }
      }
      exports.fromArray = function fromArray(array2) {
        return array2.reduce(function(acc, seg) {
          if (typeof seg === "string") {
            acc.push(buildSingleSegment(seg, null));
          } else if (seg.data) {
            acc.push(buildSingleSegment(seg.data, seg.mode));
          }
          return acc;
        }, []);
      };
      exports.fromString = function fromString(data, version) {
        const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
        const nodes = buildNodes(segs);
        const graph = buildGraph(nodes, version);
        const path = dijkstra.find_path(graph.map, "start", "end");
        const optimizedSegs = [];
        for (let i = 1; i < path.length - 1; i++) {
          optimizedSegs.push(graph.table[path[i]].node);
        }
        return exports.fromArray(mergeSegments(optimizedSegs));
      };
      exports.rawSplit = function rawSplit(data) {
        return exports.fromArray(
          getSegmentsFromString(data, Utils.isKanjiModeEnabled())
        );
      };
    }
  });

  // node_modules/qrcode/lib/core/qrcode.js
  var require_qrcode = __commonJS({
    "node_modules/qrcode/lib/core/qrcode.js"(exports) {
      var Utils = require_utils();
      var ECLevel = require_error_correction_level();
      var BitBuffer = require_bit_buffer();
      var BitMatrix = require_bit_matrix();
      var AlignmentPattern = require_alignment_pattern();
      var FinderPattern = require_finder_pattern();
      var MaskPattern = require_mask_pattern();
      var ECCode = require_error_correction_code();
      var ReedSolomonEncoder = require_reed_solomon_encoder();
      var Version = require_version();
      var FormatInfo = require_format_info();
      var Mode = require_mode();
      var Segments = require_segments();
      function setupFinderPattern(matrix, version) {
        const size = matrix.size;
        const pos = FinderPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -1; r <= 7; r++) {
            if (row + r <= -1 || size <= row + r) continue;
            for (let c = -1; c <= 7; c++) {
              if (col + c <= -1 || size <= col + c) continue;
              if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupTimingPattern(matrix) {
        const size = matrix.size;
        for (let r = 8; r < size - 8; r++) {
          const value2 = r % 2 === 0;
          matrix.set(r, 6, value2, true);
          matrix.set(6, r, value2, true);
        }
      }
      function setupAlignmentPattern(matrix, version) {
        const pos = AlignmentPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupVersionInfo(matrix, version) {
        const size = matrix.size;
        const bits = Version.getEncodedBits(version);
        let row, col, mod;
        for (let i = 0; i < 18; i++) {
          row = Math.floor(i / 3);
          col = i % 3 + size - 8 - 3;
          mod = (bits >> i & 1) === 1;
          matrix.set(row, col, mod, true);
          matrix.set(col, row, mod, true);
        }
      }
      function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
        const size = matrix.size;
        const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
        let i, mod;
        for (i = 0; i < 15; i++) {
          mod = (bits >> i & 1) === 1;
          if (i < 6) {
            matrix.set(i, 8, mod, true);
          } else if (i < 8) {
            matrix.set(i + 1, 8, mod, true);
          } else {
            matrix.set(size - 15 + i, 8, mod, true);
          }
          if (i < 8) {
            matrix.set(8, size - i - 1, mod, true);
          } else if (i < 9) {
            matrix.set(8, 15 - i - 1 + 1, mod, true);
          } else {
            matrix.set(8, 15 - i - 1, mod, true);
          }
        }
        matrix.set(size - 8, 8, 1, true);
      }
      function setupData(matrix, data) {
        const size = matrix.size;
        let inc = -1;
        let row = size - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = size - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (!matrix.isReserved(row, col - c)) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                matrix.set(row, col - c, dark);
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || size <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
      function createData(version, errorCorrectionLevel, segments) {
        const buffer = new BitBuffer();
        segments.forEach(function(data) {
          buffer.put(data.mode.bit, 4);
          buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
          data.write(buffer);
        });
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 !== 0) {
          buffer.putBit(0);
        }
        const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
        for (let i = 0; i < remainingByte; i++) {
          buffer.put(i % 2 ? 17 : 236, 8);
        }
        return createCodewords(buffer, version, errorCorrectionLevel);
      }
      function createCodewords(bitBuffer, version, errorCorrectionLevel) {
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewords = totalCodewords - ecTotalCodewords;
        const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
        const blocksInGroup2 = totalCodewords % ecTotalBlocks;
        const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
        const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
        const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
        const rs = new ReedSolomonEncoder(ecCount);
        let offset = 0;
        const dcData = new Array(ecTotalBlocks);
        const ecData = new Array(ecTotalBlocks);
        let maxDataSize = 0;
        const buffer = new Uint8Array(bitBuffer.buffer);
        for (let b = 0; b < ecTotalBlocks; b++) {
          const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
          dcData[b] = buffer.slice(offset, offset + dataSize);
          ecData[b] = rs.encode(dcData[b]);
          offset += dataSize;
          maxDataSize = Math.max(maxDataSize, dataSize);
        }
        const data = new Uint8Array(totalCodewords);
        let index = 0;
        let i, r;
        for (i = 0; i < maxDataSize; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            if (i < dcData[r].length) {
              data[index++] = dcData[r][i];
            }
          }
        }
        for (i = 0; i < ecCount; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            data[index++] = ecData[r][i];
          }
        }
        return data;
      }
      function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
        let segments;
        if (Array.isArray(data)) {
          segments = Segments.fromArray(data);
        } else if (typeof data === "string") {
          let estimatedVersion = version;
          if (!estimatedVersion) {
            const rawSegments = Segments.rawSplit(data);
            estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
          }
          segments = Segments.fromString(data, estimatedVersion || 40);
        } else {
          throw new Error("Invalid data");
        }
        const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
        if (!bestVersion) {
          throw new Error("The amount of data is too big to be stored in a QR Code");
        }
        if (!version) {
          version = bestVersion;
        } else if (version < bestVersion) {
          throw new Error(
            "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
          );
        }
        const dataBits = createData(version, errorCorrectionLevel, segments);
        const moduleCount = Utils.getSymbolSize(version);
        const modules = new BitMatrix(moduleCount);
        setupFinderPattern(modules, version);
        setupTimingPattern(modules);
        setupAlignmentPattern(modules, version);
        setupFormatInfo(modules, errorCorrectionLevel, 0);
        if (version >= 7) {
          setupVersionInfo(modules, version);
        }
        setupData(modules, dataBits);
        if (isNaN(maskPattern)) {
          maskPattern = MaskPattern.getBestMask(
            modules,
            setupFormatInfo.bind(null, modules, errorCorrectionLevel)
          );
        }
        MaskPattern.applyMask(maskPattern, modules);
        setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
        return {
          modules,
          version,
          errorCorrectionLevel,
          maskPattern,
          segments
        };
      }
      exports.create = function create(data, options) {
        if (typeof data === "undefined" || data === "") {
          throw new Error("No input text");
        }
        let errorCorrectionLevel = ECLevel.M;
        let version;
        let mask;
        if (typeof options !== "undefined") {
          errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
          version = Version.from(options.version);
          mask = MaskPattern.from(options.maskPattern);
          if (options.toSJISFunc) {
            Utils.setToSJISFunction(options.toSJISFunc);
          }
        }
        return createSymbol(data, version, errorCorrectionLevel, mask);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/utils.js
  var require_utils2 = __commonJS({
    "node_modules/qrcode/lib/renderer/utils.js"(exports) {
      function hex2rgba(hex2) {
        if (typeof hex2 === "number") {
          hex2 = hex2.toString();
        }
        if (typeof hex2 !== "string") {
          throw new Error("Color should be defined as hex string");
        }
        let hexCode = hex2.slice().replace("#", "").split("");
        if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
          throw new Error("Invalid hex color: " + hex2);
        }
        if (hexCode.length === 3 || hexCode.length === 4) {
          hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
            return [c, c];
          }));
        }
        if (hexCode.length === 6) hexCode.push("F", "F");
        const hexValue = parseInt(hexCode.join(""), 16);
        return {
          r: hexValue >> 24 & 255,
          g: hexValue >> 16 & 255,
          b: hexValue >> 8 & 255,
          a: hexValue & 255,
          hex: "#" + hexCode.slice(0, 6).join("")
        };
      }
      exports.getOptions = function getOptions(options) {
        if (!options) options = {};
        if (!options.color) options.color = {};
        const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
        const width = options.width && options.width >= 21 ? options.width : void 0;
        const scale = options.scale || 4;
        return {
          width,
          scale: width ? 4 : scale,
          margin,
          color: {
            dark: hex2rgba(options.color.dark || "#000000ff"),
            light: hex2rgba(options.color.light || "#ffffffff")
          },
          type: options.type,
          rendererOpts: options.rendererOpts || {}
        };
      };
      exports.getScale = function getScale(qrSize, opts) {
        return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
      };
      exports.getImageWidth = function getImageWidth(qrSize, opts) {
        const scale = exports.getScale(qrSize, opts);
        return Math.floor((qrSize + opts.margin * 2) * scale);
      };
      exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
        const size = qr.modules.size;
        const data = qr.modules.data;
        const scale = exports.getScale(size, opts);
        const symbolSize = Math.floor((size + opts.margin * 2) * scale);
        const scaledMargin = opts.margin * scale;
        const palette = [opts.color.light, opts.color.dark];
        for (let i = 0; i < symbolSize; i++) {
          for (let j = 0; j < symbolSize; j++) {
            let posDst = (i * symbolSize + j) * 4;
            let pxColor = opts.color.light;
            if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
              const iSrc = Math.floor((i - scaledMargin) / scale);
              const jSrc = Math.floor((j - scaledMargin) / scale);
              pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
            }
            imgData[posDst++] = pxColor.r;
            imgData[posDst++] = pxColor.g;
            imgData[posDst++] = pxColor.b;
            imgData[posDst] = pxColor.a;
          }
        }
      };
    }
  });

  // node_modules/qrcode/lib/renderer/canvas.js
  var require_canvas = __commonJS({
    "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
      var Utils = require_utils2();
      function clearCanvas(ctx, canvas, size) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!canvas.style) canvas.style = {};
        canvas.height = size;
        canvas.width = size;
        canvas.style.height = size + "px";
        canvas.style.width = size + "px";
      }
      function getCanvasElement() {
        try {
          return document.createElement("canvas");
        } catch (e2) {
          throw new Error("You need to specify a canvas element");
        }
      }
      exports.render = function render2(qrData, canvas, options) {
        let opts = options;
        let canvasEl = canvas;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!canvas) {
          canvasEl = getCanvasElement();
        }
        opts = Utils.getOptions(opts);
        const size = Utils.getImageWidth(qrData.modules.size, opts);
        const ctx = canvasEl.getContext("2d");
        const image = ctx.createImageData(size, size);
        Utils.qrToImageData(image.data, qrData, opts);
        clearCanvas(ctx, canvasEl, size);
        ctx.putImageData(image, 0, 0);
        return canvasEl;
      };
      exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
        let opts = options;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!opts) opts = {};
        const canvasEl = exports.render(qrData, canvas, opts);
        const type = opts.type || "image/png";
        const rendererOpts = opts.rendererOpts || {};
        return canvasEl.toDataURL(type, rendererOpts.quality);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/svg-tag.js
  var require_svg_tag = __commonJS({
    "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
      var Utils = require_utils2();
      function getColorAttrib(color, attrib) {
        const alpha = color.a / 255;
        const str = attrib + '="' + color.hex + '"';
        return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
      }
      function svgCmd(cmd, x, y) {
        let str = cmd + x;
        if (typeof y !== "undefined") str += " " + y;
        return str;
      }
      function qrToPath(data, size, margin) {
        let path = "";
        let moveBy = 0;
        let newRow = false;
        let lineLength = 0;
        for (let i = 0; i < data.length; i++) {
          const col = Math.floor(i % size);
          const row = Math.floor(i / size);
          if (!col && !newRow) newRow = true;
          if (data[i]) {
            lineLength++;
            if (!(i > 0 && col > 0 && data[i - 1])) {
              path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
              moveBy = 0;
              newRow = false;
            }
            if (!(col + 1 < size && data[i + 1])) {
              path += svgCmd("h", lineLength);
              lineLength = 0;
            }
          } else {
            moveBy++;
          }
        }
        return path;
      }
      exports.render = function render2(qrData, options, cb) {
        const opts = Utils.getOptions(options);
        const size = qrData.modules.size;
        const data = qrData.modules.data;
        const qrcodesize = size + opts.margin * 2;
        const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
        const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
        const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
        const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
        const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
        if (typeof cb === "function") {
          cb(null, svgTag);
        }
        return svgTag;
      };
    }
  });

  // node_modules/qrcode/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/qrcode/lib/browser.js"(exports) {
      var canPromise = require_can_promise();
      var QRCode2 = require_qrcode();
      var CanvasRenderer = require_canvas();
      var SvgRenderer = require_svg_tag();
      function renderCanvas(renderFunc, canvas, text, opts, cb) {
        const args = [].slice.call(arguments, 1);
        const argsNum = args.length;
        const isLastArgCb = typeof args[argsNum - 1] === "function";
        if (!isLastArgCb && !canPromise()) {
          throw new Error("Callback required as last argument");
        }
        if (isLastArgCb) {
          if (argsNum < 2) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 2) {
            cb = text;
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 3) {
            if (canvas.getContext && typeof cb === "undefined") {
              cb = opts;
              opts = void 0;
            } else {
              cb = opts;
              opts = text;
              text = canvas;
              canvas = void 0;
            }
          }
        } else {
          if (argsNum < 1) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 1) {
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 2 && !canvas.getContext) {
            opts = text;
            text = canvas;
            canvas = void 0;
          }
          return new Promise(function(resolve, reject) {
            try {
              const data = QRCode2.create(text, opts);
              resolve(renderFunc(data, canvas, opts));
            } catch (e2) {
              reject(e2);
            }
          });
        }
        try {
          const data = QRCode2.create(text, opts);
          cb(null, renderFunc(data, canvas, opts));
        } catch (e2) {
          cb(e2);
        }
      }
      exports.create = QRCode2.create;
      exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
      exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
      exports.toString = renderCanvas.bind(null, function(data, _, opts) {
        return SvgRenderer.render(data, opts);
      });
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
        function encode19(prefix, words, LIMIT) {
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
          const split = str.lastIndexOf("1");
          if (split === -1)
            return "No separator character for " + str;
          if (split === 0)
            return "Missing prefix for " + str;
          const prefix = str.slice(0, split);
          const wordChars = str.slice(split + 1);
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
        function decode18(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
          throw new Error(res);
        }
        return {
          decodeUnsafe,
          decode: decode18,
          encode: encode19,
          toWords,
          fromWordsUnsafe,
          fromWords
        };
      }
      exports.bech32 = getLibraryFromEncoding("bech32");
      exports.bech32m = getLibraryFromEncoding("bech32m");
    }
  });

  // src/icons.js
  var icon = (name, size = 20) => {
    const paths = {
      copy: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>',
      lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      receive: '<path d="M12 3v15m-6-6 6 6 6-6M4 21h16"/>',
      send: '<path d="M12 20V5m-6 6 6-6 6 6"/>',
      swap: '<path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4"/>',
      wallet: '<rect x="3" y="5" width="18" height="15" rx="1"/><path d="M3 8h18m-5 6h5"/>',
      history: '<path d="M4 7a9 9 0 1 1-1 7M3 3v5h5m4-1v6l4 2"/>',
      settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="15" cy="17" r="3" fill="var(--bg)"/>',
      refresh: '<path d="M4 8a8 8 0 1 1-1 7M3 3v6h6"/>',
      back: '<path d="m14 5-7 7 7 7M7 12h13"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      arrow: '<path d="M5 19 19 5M7 5h12v12"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.wallet}</svg>`;
  };

  // src/popup.js
  var import_qrcode = __toESM(require_browser(), 1);

  // node_modules/bitcoinjs-lib/src/esm/networks.js
  var bitcoin = {
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

  // node_modules/bitcoinjs-lib/src/esm/ops.js
  var OPS;
  (function(OPS9) {
    OPS9[OPS9["OP_FALSE"] = 0] = "OP_FALSE";
    OPS9[OPS9["OP_0"] = 0] = "OP_0";
    OPS9[OPS9["OP_PUSHDATA1"] = 76] = "OP_PUSHDATA1";
    OPS9[OPS9["OP_PUSHDATA2"] = 77] = "OP_PUSHDATA2";
    OPS9[OPS9["OP_PUSHDATA4"] = 78] = "OP_PUSHDATA4";
    OPS9[OPS9["OP_1NEGATE"] = 79] = "OP_1NEGATE";
    OPS9[OPS9["OP_RESERVED"] = 80] = "OP_RESERVED";
    OPS9[OPS9["OP_TRUE"] = 81] = "OP_TRUE";
    OPS9[OPS9["OP_1"] = 81] = "OP_1";
    OPS9[OPS9["OP_2"] = 82] = "OP_2";
    OPS9[OPS9["OP_3"] = 83] = "OP_3";
    OPS9[OPS9["OP_4"] = 84] = "OP_4";
    OPS9[OPS9["OP_5"] = 85] = "OP_5";
    OPS9[OPS9["OP_6"] = 86] = "OP_6";
    OPS9[OPS9["OP_7"] = 87] = "OP_7";
    OPS9[OPS9["OP_8"] = 88] = "OP_8";
    OPS9[OPS9["OP_9"] = 89] = "OP_9";
    OPS9[OPS9["OP_10"] = 90] = "OP_10";
    OPS9[OPS9["OP_11"] = 91] = "OP_11";
    OPS9[OPS9["OP_12"] = 92] = "OP_12";
    OPS9[OPS9["OP_13"] = 93] = "OP_13";
    OPS9[OPS9["OP_14"] = 94] = "OP_14";
    OPS9[OPS9["OP_15"] = 95] = "OP_15";
    OPS9[OPS9["OP_16"] = 96] = "OP_16";
    OPS9[OPS9["OP_NOP"] = 97] = "OP_NOP";
    OPS9[OPS9["OP_VER"] = 98] = "OP_VER";
    OPS9[OPS9["OP_IF"] = 99] = "OP_IF";
    OPS9[OPS9["OP_NOTIF"] = 100] = "OP_NOTIF";
    OPS9[OPS9["OP_VERIF"] = 101] = "OP_VERIF";
    OPS9[OPS9["OP_VERNOTIF"] = 102] = "OP_VERNOTIF";
    OPS9[OPS9["OP_ELSE"] = 103] = "OP_ELSE";
    OPS9[OPS9["OP_ENDIF"] = 104] = "OP_ENDIF";
    OPS9[OPS9["OP_VERIFY"] = 105] = "OP_VERIFY";
    OPS9[OPS9["OP_RETURN"] = 106] = "OP_RETURN";
    OPS9[OPS9["OP_TOALTSTACK"] = 107] = "OP_TOALTSTACK";
    OPS9[OPS9["OP_FROMALTSTACK"] = 108] = "OP_FROMALTSTACK";
    OPS9[OPS9["OP_2DROP"] = 109] = "OP_2DROP";
    OPS9[OPS9["OP_2DUP"] = 110] = "OP_2DUP";
    OPS9[OPS9["OP_3DUP"] = 111] = "OP_3DUP";
    OPS9[OPS9["OP_2OVER"] = 112] = "OP_2OVER";
    OPS9[OPS9["OP_2ROT"] = 113] = "OP_2ROT";
    OPS9[OPS9["OP_2SWAP"] = 114] = "OP_2SWAP";
    OPS9[OPS9["OP_IFDUP"] = 115] = "OP_IFDUP";
    OPS9[OPS9["OP_DEPTH"] = 116] = "OP_DEPTH";
    OPS9[OPS9["OP_DROP"] = 117] = "OP_DROP";
    OPS9[OPS9["OP_DUP"] = 118] = "OP_DUP";
    OPS9[OPS9["OP_NIP"] = 119] = "OP_NIP";
    OPS9[OPS9["OP_OVER"] = 120] = "OP_OVER";
    OPS9[OPS9["OP_PICK"] = 121] = "OP_PICK";
    OPS9[OPS9["OP_ROLL"] = 122] = "OP_ROLL";
    OPS9[OPS9["OP_ROT"] = 123] = "OP_ROT";
    OPS9[OPS9["OP_SWAP"] = 124] = "OP_SWAP";
    OPS9[OPS9["OP_TUCK"] = 125] = "OP_TUCK";
    OPS9[OPS9["OP_CAT"] = 126] = "OP_CAT";
    OPS9[OPS9["OP_SUBSTR"] = 127] = "OP_SUBSTR";
    OPS9[OPS9["OP_LEFT"] = 128] = "OP_LEFT";
    OPS9[OPS9["OP_RIGHT"] = 129] = "OP_RIGHT";
    OPS9[OPS9["OP_SIZE"] = 130] = "OP_SIZE";
    OPS9[OPS9["OP_INVERT"] = 131] = "OP_INVERT";
    OPS9[OPS9["OP_AND"] = 132] = "OP_AND";
    OPS9[OPS9["OP_OR"] = 133] = "OP_OR";
    OPS9[OPS9["OP_XOR"] = 134] = "OP_XOR";
    OPS9[OPS9["OP_EQUAL"] = 135] = "OP_EQUAL";
    OPS9[OPS9["OP_EQUALVERIFY"] = 136] = "OP_EQUALVERIFY";
    OPS9[OPS9["OP_RESERVED1"] = 137] = "OP_RESERVED1";
    OPS9[OPS9["OP_RESERVED2"] = 138] = "OP_RESERVED2";
    OPS9[OPS9["OP_1ADD"] = 139] = "OP_1ADD";
    OPS9[OPS9["OP_1SUB"] = 140] = "OP_1SUB";
    OPS9[OPS9["OP_2MUL"] = 141] = "OP_2MUL";
    OPS9[OPS9["OP_2DIV"] = 142] = "OP_2DIV";
    OPS9[OPS9["OP_NEGATE"] = 143] = "OP_NEGATE";
    OPS9[OPS9["OP_ABS"] = 144] = "OP_ABS";
    OPS9[OPS9["OP_NOT"] = 145] = "OP_NOT";
    OPS9[OPS9["OP_0NOTEQUAL"] = 146] = "OP_0NOTEQUAL";
    OPS9[OPS9["OP_ADD"] = 147] = "OP_ADD";
    OPS9[OPS9["OP_SUB"] = 148] = "OP_SUB";
    OPS9[OPS9["OP_MUL"] = 149] = "OP_MUL";
    OPS9[OPS9["OP_DIV"] = 150] = "OP_DIV";
    OPS9[OPS9["OP_MOD"] = 151] = "OP_MOD";
    OPS9[OPS9["OP_LSHIFT"] = 152] = "OP_LSHIFT";
    OPS9[OPS9["OP_RSHIFT"] = 153] = "OP_RSHIFT";
    OPS9[OPS9["OP_BOOLAND"] = 154] = "OP_BOOLAND";
    OPS9[OPS9["OP_BOOLOR"] = 155] = "OP_BOOLOR";
    OPS9[OPS9["OP_NUMEQUAL"] = 156] = "OP_NUMEQUAL";
    OPS9[OPS9["OP_NUMEQUALVERIFY"] = 157] = "OP_NUMEQUALVERIFY";
    OPS9[OPS9["OP_NUMNOTEQUAL"] = 158] = "OP_NUMNOTEQUAL";
    OPS9[OPS9["OP_LESSTHAN"] = 159] = "OP_LESSTHAN";
    OPS9[OPS9["OP_GREATERTHAN"] = 160] = "OP_GREATERTHAN";
    OPS9[OPS9["OP_LESSTHANOREQUAL"] = 161] = "OP_LESSTHANOREQUAL";
    OPS9[OPS9["OP_GREATERTHANOREQUAL"] = 162] = "OP_GREATERTHANOREQUAL";
    OPS9[OPS9["OP_MIN"] = 163] = "OP_MIN";
    OPS9[OPS9["OP_MAX"] = 164] = "OP_MAX";
    OPS9[OPS9["OP_WITHIN"] = 165] = "OP_WITHIN";
    OPS9[OPS9["OP_RIPEMD160"] = 166] = "OP_RIPEMD160";
    OPS9[OPS9["OP_SHA1"] = 167] = "OP_SHA1";
    OPS9[OPS9["OP_SHA256"] = 168] = "OP_SHA256";
    OPS9[OPS9["OP_HASH160"] = 169] = "OP_HASH160";
    OPS9[OPS9["OP_HASH256"] = 170] = "OP_HASH256";
    OPS9[OPS9["OP_CODESEPARATOR"] = 171] = "OP_CODESEPARATOR";
    OPS9[OPS9["OP_CHECKSIG"] = 172] = "OP_CHECKSIG";
    OPS9[OPS9["OP_CHECKSIGVERIFY"] = 173] = "OP_CHECKSIGVERIFY";
    OPS9[OPS9["OP_CHECKMULTISIG"] = 174] = "OP_CHECKMULTISIG";
    OPS9[OPS9["OP_CHECKMULTISIGVERIFY"] = 175] = "OP_CHECKMULTISIGVERIFY";
    OPS9[OPS9["OP_NOP1"] = 176] = "OP_NOP1";
    OPS9[OPS9["OP_CHECKLOCKTIMEVERIFY"] = 177] = "OP_CHECKLOCKTIMEVERIFY";
    OPS9[OPS9["OP_NOP2"] = 177] = "OP_NOP2";
    OPS9[OPS9["OP_CHECKSEQUENCEVERIFY"] = 178] = "OP_CHECKSEQUENCEVERIFY";
    OPS9[OPS9["OP_NOP3"] = 178] = "OP_NOP3";
    OPS9[OPS9["OP_NOP4"] = 179] = "OP_NOP4";
    OPS9[OPS9["OP_NOP5"] = 180] = "OP_NOP5";
    OPS9[OPS9["OP_NOP6"] = 181] = "OP_NOP6";
    OPS9[OPS9["OP_NOP7"] = 182] = "OP_NOP7";
    OPS9[OPS9["OP_NOP8"] = 183] = "OP_NOP8";
    OPS9[OPS9["OP_NOP9"] = 184] = "OP_NOP9";
    OPS9[OPS9["OP_NOP10"] = 185] = "OP_NOP10";
    OPS9[OPS9["OP_CHECKSIGADD"] = 186] = "OP_CHECKSIGADD";
    OPS9[OPS9["OP_PUBKEYHASH"] = 253] = "OP_PUBKEYHASH";
    OPS9[OPS9["OP_PUBKEY"] = 254] = "OP_PUBKEY";
    OPS9[OPS9["OP_INVALIDOPCODE"] = 255] = "OP_INVALIDOPCODE";
  })(OPS || (OPS = {}));

  // node_modules/uint8array-tools/src/mjs/browser.js
  var HEX_STRINGS = "0123456789abcdefABCDEF";
  var HEX_CODES = HEX_STRINGS.split("").map((c) => c.codePointAt(0));
  var HEX_CODEPOINTS = Array(256).fill(true).map((_, i) => {
    const s = String.fromCodePoint(i);
    const index = HEX_STRINGS.indexOf(s);
    return index < 0 ? void 0 : index < 16 ? index : index - 6;
  });
  var ENCODER = new TextEncoder();
  var DECODER = new TextDecoder();
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

  // node_modules/bitcoinjs-lib/src/esm/push_data.js
  function encodingLength(i) {
    return i < OPS.OP_PUSHDATA1 ? 1 : i <= 255 ? 2 : i <= 65535 ? 3 : 5;
  }
  function encode(buffer, num, offset) {
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
  function decode(buffer, offset) {
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

  // node_modules/bitcoinjs-lib/src/esm/script_number.js
  function decode2(buffer, maxLength, minimal) {
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
  function encode2(_number) {
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

  // node_modules/valibot/dist/index.mjs
  var store$4;
  var DEFAULT_CONFIG = {
    lang: void 0,
    message: void 0,
    abortEarly: void 0,
    abortPipeEarly: void 0
  };
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
  var store$3;
  // @__NO_SIDE_EFFECTS__
  function getGlobalMessage(lang) {
    return store$3?.get(lang);
  }
  var store$2;
  // @__NO_SIDE_EFFECTS__
  function getSchemaMessage(lang) {
    return store$2?.get(lang);
  }
  var store$1;
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
  function _addIssue(context, label, dataset, config$1, other) {
    const input = other && "input" in other ? other.input : dataset.value;
    const expected14 = other?.expected ?? context.expects ?? null;
    const received = other?.received ?? /* @__PURE__ */ _stringify(input);
    const issue = {
      kind: context.kind,
      type: context.type,
      input,
      expected: expected14,
      received,
      message: `Invalid ${label}: ${expected14 ? `Expected ${expected14} but r` : "R"}eceived ${received}`,
      requirement: context.requirement,
      path: other?.path,
      issues: other?.issues,
      lang: config$1.lang,
      abortEarly: config$1.abortEarly,
      abortPipeEarly: config$1.abortPipeEarly
    };
    const isSchema = context.kind === "schema";
    const message$1 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
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
  var ValiError = class extends Error {
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
  var EMOJI_REGEX = new RegExp("^(?:[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|(?![\\p{Emoji_Modifier_Base}\\u{1F1E6}-\\u{1F1FF}])\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|(?![\\p{Emoji_Modifier_Base}\\u{1F1E6}-\\u{1F1FF}])\\p{Emoji_Presentation}))*)+$", "u");
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
  var ABORT_EARLY_CONFIG = { abortEarly: true };
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

  // node_modules/bitcoinjs-lib/src/esm/types.js
  var ZERO32 = new Uint8Array(32);
  var EC_P = fromHex(
    "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"
  );
  var NBufferSchemaFactory = (size) => pipe(instance(Uint8Array), length(size));
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
  var TAPLEAF_VERSION_MASK = 254;
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
  var Buffer256bitSchema = NBufferSchemaFactory(32);
  var Hash160bitSchema = NBufferSchemaFactory(20);
  var Hash256bitSchema = NBufferSchemaFactory(32);
  var BufferSchema = instance(Uint8Array);
  var HexSchema = pipe(string(), regex(/^([0-9a-f]{2})+$/i));
  var UInt8Schema = pipe(
    number(),
    integer(),
    minValue(0),
    maxValue(255)
  );
  var UInt32Schema = pipe(
    number(),
    integer(),
    minValue(0),
    maxValue(4294967295)
  );
  var SatoshiSchema = pipe(
    bigint(),
    minValue(0n),
    maxValue(0x7fffffffffffffffn)
  );
  var NullablePartial = (a) => object(
    Object.entries(a).reduce(
      (acc, next) => ({ ...acc, [next[0]]: nullish(next[1]) }),
      {}
    )
  );

  // node_modules/bitcoinjs-lib/src/esm/script_signature.js
  var ZERO = new Uint8Array(1);

  // node_modules/bitcoinjs-lib/src/esm/script.js
  var OP_INT_BASE = OPS.OP_RESERVED;
  var StackSchema = array(union([instance(Uint8Array), number()]));
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
        offset += encode(buffer, chunk.length, offset);
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
        const d = decode(buffer, i);
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
  function toStack(chunks) {
    chunks = decompile(chunks);
    parse(custom(isPushOnly), chunks);
    return chunks.map((op) => {
      if (singleChunkIsBuffer(op)) return op;
      if (op === OPS.OP_0) return new Uint8Array(0);
      return encode2(op - OP_INT_BASE);
    });
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

  // node_modules/bitcoinjs-lib/src/esm/payments/p2ms.js
  var OPS2 = OPS;
  var OP_INT_BASE2 = OPS2.OP_RESERVED;
  function encodeSmallOrScriptNum(n) {
    return n <= 16 ? OP_INT_BASE2 + n : encode2(n);
  }
  function decodeSmallOrScriptNum(chunk) {
    if (typeof chunk === "number") {
      const val = chunk - OP_INT_BASE2;
      if (val < 1 || val > 16)
        throw new TypeError(`Invalid opcode: expected OP_1\u2013OP_16, got ${chunk}`);
      return val;
    } else return decode2(chunk);
  }
  function isSmallOrScriptNum(chunk) {
    if (typeof chunk === "number")
      return chunk - OP_INT_BASE2 >= 1 && chunk - OP_INT_BASE2 <= 16;
    else return Number.isInteger(decode2(chunk));
  }
  function p2ms(a, opts) {
    if (!a.input && !a.output && !(a.pubkeys && a.m !== void 0) && !a.signatures)
      throw new TypeError("Not enough data");
    opts = Object.assign({ validate: true }, opts || {});
    function isAcceptableSignature(x) {
      return isCanonicalScriptSignature(x) || (opts.allowIncomplete && x === OPS2.OP_0) !== void 0;
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
    function decode18(output) {
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
          OPS2.OP_CHECKMULTISIG
        )
      );
    });
    prop(o, "m", () => {
      if (!o.output) return;
      decode18(o.output);
      return o.m;
    });
    prop(o, "n", () => {
      if (!o.pubkeys) return;
      return o.pubkeys.length;
    });
    prop(o, "pubkeys", () => {
      if (!a.output) return;
      decode18(a.output);
      return o.pubkeys;
    });
    prop(o, "signatures", () => {
      if (!a.input) return;
      return decompile(a.input).slice(1);
    });
    prop(o, "input", () => {
      if (!a.signatures) return;
      return compile([OPS2.OP_0].concat(a.signatures));
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
        decode18(a.output);
        if (!isSmallOrScriptNum(chunks[0]))
          throw new TypeError("Output is invalid");
        if (!isSmallOrScriptNum(chunks[chunks.length - 2]))
          throw new TypeError("Output is invalid");
        if (chunks[chunks.length - 1] !== OPS2.OP_CHECKMULTISIG)
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
        if (a.input[0] !== OPS2.OP_0) throw new TypeError("Input is invalid");
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

  // node_modules/bitcoinjs-lib/src/esm/payments/p2pk.js
  var OPS3 = OPS;
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
      return compile([a.pubkey, OPS3.OP_CHECKSIG]);
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
        if (a.output[a.output.length - 1] !== OPS3.OP_CHECKSIG)
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
  var Hash = class {
  };
  function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }

  // node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view2, byteOffset, value2, isLE) {
    if (typeof view2.setBigUint64 === "function")
      return view2.setBigUint64(byteOffset, value2, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value2 >> _32n & _u32_max);
    const wl = Number(value2 & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view2.setUint32(byteOffset + h, wh, isLE);
    view2.setUint32(byteOffset + l, wl, isLE);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD = class extends Hash {
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
      const { view: view2, buffer, blockLen } = this;
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
          this.process(view2, 0);
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
      const { buffer, view: view2, blockLen, isLE } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      clean(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view2, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view2, blockLen - 8, BigInt(this.length * 8), isLE);
      this.process(view2, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state2 = this.get();
      if (outLen > state2.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state2[i], isLE);
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
  var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);

  // node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/legacy.js
  var Rho160 = /* @__PURE__ */ Uint8Array.from([
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
  var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
  var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
  var idxLR = /* @__PURE__ */ (() => {
    const L = [Id160];
    const R = [Pi160];
    const res = [L, R];
    for (let i = 0; i < 4; i++)
      for (let j of res)
        j.push(j[i].map((k) => Rho160[k]));
    return res;
  })();
  var idxL = /* @__PURE__ */ (() => idxLR[0])();
  var idxR = /* @__PURE__ */ (() => idxLR[1])();
  var shifts160 = /* @__PURE__ */ [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
  ].map((i) => Uint8Array.from(i));
  var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var Kl160 = /* @__PURE__ */ Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]);
  var Kr160 = /* @__PURE__ */ Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
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
  var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
  var RIPEMD160 = class extends HashMD {
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
    process(view2, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        BUF_160[i] = view2.getUint32(offset, true);
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
  var ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());

  // node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/ripemd160.js
  var ripemd1602 = ripemd160;

  // node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
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
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA256 = class extends HashMD {
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
    process(view2, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view2.getUint32(offset, false);
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
  var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());

  // node_modules/bitcoinjs-lib/node_modules/@noble/hashes/esm/sha256.js
  var sha2562 = sha256;

  // node_modules/bitcoinjs-lib/src/esm/crypto.js
  function hash160(buffer) {
    return ripemd1602(sha2562(buffer));
  }
  var TAGGED_HASH_PREFIXES = {
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
  function taggedHash(prefix, data) {
    return sha2562(concat([TAGGED_HASH_PREFIXES[prefix], data]));
  }

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
  var Hash2 = class {
  };
  function createHasher2(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }

  // node_modules/bs58check/node_modules/@noble/hashes/esm/_md.js
  function setBigUint642(view2, byteOffset, value2, isLE) {
    if (typeof view2.setBigUint64 === "function")
      return view2.setBigUint64(byteOffset, value2, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value2 >> _32n & _u32_max);
    const wl = Number(value2 & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view2.setUint32(byteOffset + h, wh, isLE);
    view2.setUint32(byteOffset + l, wl, isLE);
  }
  function Chi2(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj2(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD2 = class extends Hash2 {
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
      const { view: view2, buffer, blockLen } = this;
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
          this.process(view2, 0);
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
      const { buffer, view: view2, blockLen, isLE } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      clean2(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view2, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint642(view2, blockLen - 8, BigInt(this.length * 8), isLE);
      this.process(view2, 0);
      const oview = createView2(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state2 = this.get();
      if (outLen > state2.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state2[i], isLE);
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
  var SHA256_IV2 = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);

  // node_modules/bs58check/node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K2 = /* @__PURE__ */ Uint32Array.from([
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
  var SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
  var SHA2562 = class extends HashMD2 {
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
    process(view2, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W2[i] = view2.getUint32(offset, false);
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
  var sha2563 = /* @__PURE__ */ createHasher2(() => new SHA2562());

  // node_modules/bs58check/node_modules/@noble/hashes/esm/sha256.js
  var sha2564 = sha2563;

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
    function encode19(source) {
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
    function decode18(string2) {
      const buffer = decodeUnsafe(string2);
      if (buffer) {
        return buffer;
      }
      throw new Error("Non-base" + BASE + " character");
    }
    return {
      encode: encode19,
      decodeUnsafe,
      decode: decode18
    };
  }
  var esm_default = base;

  // node_modules/bs58/src/esm/index.js
  var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var esm_default2 = esm_default(ALPHABET);

  // node_modules/bs58check/src/esm/base.js
  function base_default(checksumFn) {
    function encode19(payload) {
      var payloadU8 = Uint8Array.from(payload);
      var checksum = checksumFn(payloadU8);
      var length2 = payloadU8.length + 4;
      var both = new Uint8Array(length2);
      both.set(payloadU8, 0);
      both.set(checksum.subarray(0, 4), payloadU8.length);
      return esm_default2.encode(both);
    }
    function decodeRaw(buffer) {
      var payload = buffer.slice(0, -4);
      var checksum = buffer.slice(-4);
      var newChecksum = checksumFn(payload);
      if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3])
        return;
      return payload;
    }
    function decodeUnsafe(str) {
      var buffer = esm_default2.decodeUnsafe(str);
      if (buffer == null)
        return;
      return decodeRaw(buffer);
    }
    function decode18(str) {
      var buffer = esm_default2.decode(str);
      var payload = decodeRaw(buffer);
      if (payload == null)
        throw new Error("Invalid checksum");
      return payload;
    }
    return {
      encode: encode19,
      decode: decode18,
      decodeUnsafe
    };
  }

  // node_modules/bs58check/src/esm/index.js
  function sha256x2(buffer) {
    return sha2564(sha2564(buffer));
  }
  var esm_default3 = base_default(sha256x2);

  // node_modules/bitcoinjs-lib/src/esm/payments/p2pkh.js
  var OPS4 = OPS;
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
        OPS4.OP_DUP,
        OPS4.OP_HASH160,
        o.hash,
        OPS4.OP_EQUALVERIFY,
        OPS4.OP_CHECKSIG
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
        if (a.output.length !== 25 || a.output[0] !== OPS4.OP_DUP || a.output[1] !== OPS4.OP_HASH160 || a.output[2] !== 20 || a.output[23] !== OPS4.OP_EQUALVERIFY || a.output[24] !== OPS4.OP_CHECKSIG)
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

  // node_modules/bitcoinjs-lib/src/esm/payments/p2sh.js
  var OPS5 = OPS;
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
        output: lastChunk === OPS5.OP_FALSE ? Uint8Array.from([]) : lastChunk,
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
      return compile([OPS5.OP_HASH160, o.hash, OPS5.OP_EQUAL]);
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
        if (a.output.length !== 23 || a.output[0] !== OPS5.OP_HASH160 || a.output[1] !== 20 || a.output[22] !== OPS5.OP_EQUAL)
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

  // node_modules/bitcoinjs-lib/src/esm/payments/p2wpkh.js
  var import_bech32 = __toESM(require_dist(), 1);
  var OPS6 = OPS;
  var EMPTY_BUFFER = new Uint8Array(0);
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
      return compile([OPS6.OP_0, o.hash]);
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
        if (a.output.length !== 22 || a.output[0] !== OPS6.OP_0 || a.output[1] !== 20)
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

  // node_modules/bitcoinjs-lib/src/esm/payments/p2wsh.js
  var import_bech322 = __toESM(require_dist(), 1);
  var OPS7 = OPS;
  var EMPTY_BUFFER2 = new Uint8Array(0);
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
      return compile([OPS7.OP_0, o.hash]);
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
        if (a.output.length !== 34 || a.output[0] !== OPS7.OP_0 || a.output[1] !== 32)
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

  // node_modules/bitcoinjs-lib/src/esm/ecc_lib.js
  var _ECCLIB_CACHE = {};
  function getEccLib() {
    if (!_ECCLIB_CACHE.eccLib)
      throw new Error(
        "No ECC Library provided. You must call initEccLib() with a valid TinySecp256k1Interface instance"
      );
    return _ECCLIB_CACHE.eccLib;
  }

  // node_modules/varuint-bitcoin/src/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    decode: () => decode4,
    encode: () => encode4,
    encodingLength: () => encodingLength2
  });
  var checkUInt64 = (n) => {
    if (n < 0 || n > 0xffffffffffffffffn) {
      throw new RangeError("value out of range");
    }
  };
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
  function encode4(n, buffer, offset) {
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
  function decode4(buffer, offset) {
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
      const number2 = readUInt64(buffer, offset + 1, "LE");
      return { numberValue: number2 <= Number.MAX_SAFE_INTEGER ? Number(number2) : null, bigintValue: number2, bytes: 9 };
    }
  }
  function encodingLength2(n) {
    checkUint53OrUint64(n);
    return n < 253 ? 1 : n <= 65535 ? 3 : n <= 4294967295 ? 5 : 9;
  }

  // node_modules/bitcoinjs-lib/src/esm/payments/bip341.js
  var LEAF_VERSION_TAPSCRIPT = 192;
  var isHashBranch = (ht) => "left" in ht && "right" in ht;
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

  // node_modules/bitcoinjs-lib/src/esm/payments/p2tr.js
  var import_bech323 = __toESM(require_dist(), 1);
  var OPS8 = OPS;
  var TAPROOT_WITNESS_VERSION = 1;
  var ANNEX_PREFIX = 80;
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
      return compile([OPS8.OP_1, o.pubkey]);
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
        if (a.output.length !== 34 || a.output[0] !== OPS8.OP_1 || a.output[1] !== 32)
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

  // node_modules/bitcoinjs-lib/src/esm/address.js
  var import_bech324 = __toESM(require_dist(), 1);
  function fromBech32(address) {
    let result;
    let version;
    try {
      result = import_bech324.bech32.decode(address);
    } catch (e2) {
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

  // node_modules/bitcoinjs-lib/src/esm/transaction.js
  var EMPTY_BUFFER3 = new Uint8Array(0);
  var ZERO2 = fromHex(
    "0000000000000000000000000000000000000000000000000000000000000000"
  );
  var ONE = fromHex(
    "0000000000000000000000000000000000000000000000000000000000000001"
  );
  var VALUE_UINT64_MAX = fromHex("ffffffffffffffff");

  // node_modules/bitcoinjs-lib/src/esm/block.js
  var errorMerkleNoTxes = new TypeError(
    "Cannot compute merkle root for zero transactions"
  );
  var errorWitnessNotSegwit = new TypeError(
    "Cannot compute witness commit for non-segwit block"
  );

  // node_modules/bip174/src/esm/lib/converter/index.js
  var converter_exports = {};
  __export(converter_exports, {
    globals: () => globals,
    inputs: () => inputs,
    outputs: () => outputs
  });

  // node_modules/bip174/src/esm/lib/typeFields.js
  var GlobalTypes;
  (function(GlobalTypes2) {
    GlobalTypes2[GlobalTypes2["UNSIGNED_TX"] = 0] = "UNSIGNED_TX";
    GlobalTypes2[GlobalTypes2["GLOBAL_XPUB"] = 1] = "GLOBAL_XPUB";
  })(GlobalTypes || (GlobalTypes = {}));
  var InputTypes;
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
  var OutputTypes;
  (function(OutputTypes2) {
    OutputTypes2[OutputTypes2["REDEEM_SCRIPT"] = 0] = "REDEEM_SCRIPT";
    OutputTypes2[OutputTypes2["WITNESS_SCRIPT"] = 1] = "WITNESS_SCRIPT";
    OutputTypes2[OutputTypes2["BIP32_DERIVATION"] = 2] = "BIP32_DERIVATION";
    OutputTypes2[OutputTypes2["TAP_INTERNAL_KEY"] = 5] = "TAP_INTERNAL_KEY";
    OutputTypes2[OutputTypes2["TAP_TREE"] = 6] = "TAP_TREE";
    OutputTypes2[OutputTypes2["TAP_BIP32_DERIVATION"] = 7] = "TAP_BIP32_DERIVATION";
  })(OutputTypes || (OutputTypes = {}));

  // node_modules/bip174/src/esm/lib/converter/global/globalXpub.js
  var globalXpub_exports = {};
  __export(globalXpub_exports, {
    canAddToArray: () => canAddToArray,
    check: () => check2,
    decode: () => decode5,
    encode: () => encode5,
    expected: () => expected
  });
  var range = (n) => [...Array(n).keys()];
  function decode5(keyVal) {
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
  function encode5(data) {
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
  var expected = "{ masterFingerprint: Uint8Array; extendedPubkey: Uint8Array; path: string; }";
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

  // node_modules/bip174/src/esm/lib/converter/global/unsignedTx.js
  var unsignedTx_exports = {};
  __export(unsignedTx_exports, {
    encode: () => encode6
  });
  function encode6(data) {
    return {
      key: new Uint8Array([GlobalTypes.UNSIGNED_TX]),
      value: data.toBuffer()
    };
  }

  // node_modules/bip174/src/esm/lib/converter/input/finalScriptSig.js
  var finalScriptSig_exports = {};
  __export(finalScriptSig_exports, {
    canAdd: () => canAdd,
    check: () => check3,
    decode: () => decode6,
    encode: () => encode7,
    expected: () => expected2
  });
  function decode6(keyVal) {
    if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTSIG) {
      throw new Error(
        "Decode Error: could not decode finalScriptSig with key 0x" + toHex(keyVal.key)
      );
    }
    return keyVal.value;
  }
  function encode7(data) {
    const key = new Uint8Array([InputTypes.FINAL_SCRIPTSIG]);
    return {
      key,
      value: data
    };
  }
  var expected2 = "Uint8Array";
  function check3(data) {
    return data instanceof Uint8Array;
  }
  function canAdd(currentData, newData) {
    return !!currentData && !!newData && currentData.finalScriptSig === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/finalScriptWitness.js
  var finalScriptWitness_exports = {};
  __export(finalScriptWitness_exports, {
    canAdd: () => canAdd2,
    check: () => check4,
    decode: () => decode7,
    encode: () => encode8,
    expected: () => expected3
  });
  function decode7(keyVal) {
    if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTWITNESS) {
      throw new Error(
        "Decode Error: could not decode finalScriptWitness with key 0x" + toHex(keyVal.key)
      );
    }
    return keyVal.value;
  }
  function encode8(data) {
    const key = new Uint8Array([InputTypes.FINAL_SCRIPTWITNESS]);
    return {
      key,
      value: data
    };
  }
  var expected3 = "Uint8Array";
  function check4(data) {
    return data instanceof Uint8Array;
  }
  function canAdd2(currentData, newData) {
    return !!currentData && !!newData && currentData.finalScriptWitness === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/nonWitnessUtxo.js
  var nonWitnessUtxo_exports = {};
  __export(nonWitnessUtxo_exports, {
    canAdd: () => canAdd3,
    check: () => check5,
    decode: () => decode8,
    encode: () => encode9,
    expected: () => expected4
  });
  function decode8(keyVal) {
    if (keyVal.key[0] !== InputTypes.NON_WITNESS_UTXO) {
      throw new Error(
        "Decode Error: could not decode nonWitnessUtxo with key 0x" + toHex(keyVal.key)
      );
    }
    return keyVal.value;
  }
  function encode9(data) {
    return {
      key: new Uint8Array([InputTypes.NON_WITNESS_UTXO]),
      value: data
    };
  }
  var expected4 = "Uint8Array";
  function check5(data) {
    return data instanceof Uint8Array;
  }
  function canAdd3(currentData, newData) {
    return !!currentData && !!newData && currentData.nonWitnessUtxo === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/partialSig.js
  var partialSig_exports = {};
  __export(partialSig_exports, {
    canAddToArray: () => canAddToArray2,
    check: () => check6,
    decode: () => decode9,
    encode: () => encode10,
    expected: () => expected5
  });
  function decode9(keyVal) {
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
  function encode10(pSig) {
    const head = new Uint8Array([InputTypes.PARTIAL_SIG]);
    return {
      key: concat([head, pSig.pubkey]),
      value: pSig.signature
    };
  }
  var expected5 = "{ pubkey: Uint8Array; signature: Uint8Array; }";
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

  // node_modules/bip174/src/esm/lib/converter/input/porCommitment.js
  var porCommitment_exports = {};
  __export(porCommitment_exports, {
    canAdd: () => canAdd4,
    check: () => check7,
    decode: () => decode10,
    encode: () => encode11,
    expected: () => expected6
  });
  function decode10(keyVal) {
    if (keyVal.key[0] !== InputTypes.POR_COMMITMENT) {
      throw new Error(
        "Decode Error: could not decode porCommitment with key 0x" + toHex(keyVal.key)
      );
    }
    return toUtf8(keyVal.value);
  }
  function encode11(data) {
    const key = new Uint8Array([InputTypes.POR_COMMITMENT]);
    return {
      key,
      value: fromUtf8(data)
    };
  }
  var expected6 = "string";
  function check7(data) {
    return typeof data === "string";
  }
  function canAdd4(currentData, newData) {
    return !!currentData && !!newData && currentData.porCommitment === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/sighashType.js
  var sighashType_exports = {};
  __export(sighashType_exports, {
    canAdd: () => canAdd5,
    check: () => check8,
    decode: () => decode11,
    encode: () => encode12,
    expected: () => expected7
  });
  function decode11(keyVal) {
    if (keyVal.key[0] !== InputTypes.SIGHASH_TYPE) {
      throw new Error(
        "Decode Error: could not decode sighashType with key 0x" + toHex(keyVal.key)
      );
    }
    return Number(readUInt32(keyVal.value, 0, "LE"));
  }
  function encode12(data) {
    const key = Uint8Array.from([InputTypes.SIGHASH_TYPE]);
    const value2 = new Uint8Array(4);
    writeUInt32(value2, 0, data, "LE");
    return {
      key,
      value: value2
    };
  }
  var expected7 = "number";
  function check8(data) {
    return typeof data === "number";
  }
  function canAdd5(currentData, newData) {
    return !!currentData && !!newData && currentData.sighashType === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/tapKeySig.js
  var tapKeySig_exports = {};
  __export(tapKeySig_exports, {
    canAdd: () => canAdd6,
    check: () => check9,
    decode: () => decode12,
    encode: () => encode13,
    expected: () => expected8
  });
  function decode12(keyVal) {
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
  function encode13(value2) {
    const key = Uint8Array.from([InputTypes.TAP_KEY_SIG]);
    return { key, value: value2 };
  }
  var expected8 = "Uint8Array";
  function check9(data) {
    return data instanceof Uint8Array && (data.length === 64 || data.length === 65);
  }
  function canAdd6(currentData, newData) {
    return !!currentData && !!newData && currentData.tapKeySig === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/tapLeafScript.js
  var tapLeafScript_exports = {};
  __export(tapLeafScript_exports, {
    canAddToArray: () => canAddToArray3,
    check: () => check10,
    decode: () => decode13,
    encode: () => encode14,
    expected: () => expected9
  });
  function decode13(keyVal) {
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
  function encode14(tScript) {
    const head = Uint8Array.from([InputTypes.TAP_LEAF_SCRIPT]);
    const verBuf = Uint8Array.from([tScript.leafVersion]);
    return {
      key: concat([head, tScript.controlBlock]),
      value: concat([tScript.script, verBuf])
    };
  }
  var expected9 = "{ controlBlock: Uint8Array; leafVersion: number, script: Uint8Array; }";
  function check10(data) {
    return data.controlBlock instanceof Uint8Array && (data.controlBlock.length - 1) % 32 === 0 && (data.controlBlock[0] & 254) === data.leafVersion && data.script instanceof Uint8Array;
  }
  function canAddToArray3(array2, item, dupeSet) {
    const dupeString = toHex(item.controlBlock);
    if (dupeSet.has(dupeString)) return false;
    dupeSet.add(dupeString);
    return array2.filter((v) => compare(v.controlBlock, item.controlBlock) === 0).length === 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/tapMerkleRoot.js
  var tapMerkleRoot_exports = {};
  __export(tapMerkleRoot_exports, {
    canAdd: () => canAdd7,
    check: () => check11,
    decode: () => decode14,
    encode: () => encode15,
    expected: () => expected10
  });
  function decode14(keyVal) {
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
  function encode15(value2) {
    const key = Uint8Array.from([InputTypes.TAP_MERKLE_ROOT]);
    return { key, value: value2 };
  }
  var expected10 = "Uint8Array";
  function check11(data) {
    return data instanceof Uint8Array && data.length === 32;
  }
  function canAdd7(currentData, newData) {
    return !!currentData && !!newData && currentData.tapMerkleRoot === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/input/tapScriptSig.js
  var tapScriptSig_exports = {};
  __export(tapScriptSig_exports, {
    canAddToArray: () => canAddToArray4,
    check: () => check12,
    decode: () => decode15,
    encode: () => encode16,
    expected: () => expected11
  });
  function decode15(keyVal) {
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
  function encode16(tSig) {
    const head = Uint8Array.from([InputTypes.TAP_SCRIPT_SIG]);
    return {
      key: concat([head, tSig.pubkey, tSig.leafHash]),
      value: tSig.signature
    };
  }
  var expected11 = "{ pubkey: Uint8Array; leafHash: Uint8Array; signature: Uint8Array; }";
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

  // node_modules/bip174/src/esm/lib/converter/input/witnessUtxo.js
  var witnessUtxo_exports = {};
  __export(witnessUtxo_exports, {
    canAdd: () => canAdd8,
    check: () => check13,
    decode: () => decode16,
    encode: () => encode17,
    expected: () => expected12
  });
  function decode16(keyVal) {
    if (keyVal.key[0] !== InputTypes.WITNESS_UTXO) {
      throw new Error(
        "Decode Error: could not decode witnessUtxo with key 0x" + toHex(keyVal.key)
      );
    }
    const value2 = readInt64(keyVal.value, 0, "LE");
    let _offset = 8;
    const { numberValue: scriptLen, bytes } = decode4(
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
  function encode17(data) {
    const { script, value: value2 } = data;
    const varuintlen = encodingLength2(script.length);
    const result = new Uint8Array(8 + varuintlen + script.length);
    writeInt64(result, 0, BigInt(value2), "LE");
    encode4(script.length, result, 8);
    result.set(script, 8 + varuintlen);
    return {
      key: Uint8Array.from([InputTypes.WITNESS_UTXO]),
      value: result
    };
  }
  var expected12 = "{ script: Uint8Array; value: bigint; }";
  function check13(data) {
    return data.script instanceof Uint8Array && typeof data.value === "bigint";
  }
  function canAdd8(currentData, newData) {
    return !!currentData && !!newData && currentData.witnessUtxo === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/output/tapTree.js
  var tapTree_exports = {};
  __export(tapTree_exports, {
    canAdd: () => canAdd9,
    check: () => check14,
    decode: () => decode17,
    encode: () => encode18,
    expected: () => expected13
  });
  function decode17(keyVal) {
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
      const { numberValue: scriptLen, bytes } = decode4(
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
  function encode18(tree) {
    const key = Uint8Array.from([OutputTypes.TAP_TREE]);
    const bufs = [].concat(
      ...tree.leaves.map((tapLeaf) => [
        Uint8Array.of(tapLeaf.depth, tapLeaf.leafVersion),
        encode4(BigInt(tapLeaf.script.length)).buffer,
        tapLeaf.script
      ])
    );
    return {
      key,
      value: concat(bufs)
    };
  }
  var expected13 = "{ leaves: [{ depth: number; leafVersion: number, script: Uint8Array; }] }";
  function check14(data) {
    return Array.isArray(data.leaves) && data.leaves.every(
      (tapLeaf) => tapLeaf.depth >= 0 && tapLeaf.depth <= 128 && (tapLeaf.leafVersion & 254) === tapLeaf.leafVersion && tapLeaf.script instanceof Uint8Array
    );
  }
  function canAdd9(currentData, newData) {
    return !!currentData && !!newData && currentData.tapTree === void 0;
  }

  // node_modules/bip174/src/esm/lib/converter/shared/bip32Derivation.js
  var range2 = (n) => [...Array(n).keys()];
  var isValidDERKey = (pubkey) => pubkey.length === 33 && [2, 3].includes(pubkey[0]) || pubkey.length === 65 && 4 === pubkey[0];
  function makeConverter(TYPE_BYTE, isValidPubkey = isValidDERKey) {
    function decode18(keyVal) {
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
    function encode19(data) {
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
      decode: decode18,
      encode: encode19,
      check: check15,
      expected: expected14,
      canAddToArray: canAddToArray5
    };
  }

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

  // node_modules/bip174/src/esm/lib/converter/shared/redeemScript.js
  function makeConverter2(TYPE_BYTE) {
    function decode18(keyVal) {
      if (keyVal.key[0] !== TYPE_BYTE) {
        throw new Error(
          "Decode Error: could not decode redeemScript with key 0x" + toHex(keyVal.key)
        );
      }
      return keyVal.value;
    }
    function encode19(data) {
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
      decode: decode18,
      encode: encode19,
      check: check15,
      expected: expected14,
      canAdd: canAdd10
    };
  }

  // node_modules/bip174/src/esm/lib/converter/shared/tapBip32Derivation.js
  var isValidBIP340Key = (pubkey) => pubkey.length === 32;
  function makeConverter3(TYPE_BYTE) {
    const parent = makeConverter(TYPE_BYTE, isValidBIP340Key);
    function decode18(keyVal) {
      const { numberValue: nHashes, bytes: nHashesLen } = decode4(
        keyVal.value
      );
      const base3 = parent.decode({
        key: keyVal.key,
        value: keyVal.value.slice(nHashesLen + Number(nHashes) * 32)
      });
      const leafHashes = new Array(Number(nHashes));
      for (let i = 0, _offset = nHashesLen; i < nHashes; i++, _offset += 32) {
        leafHashes[i] = keyVal.value.slice(_offset, _offset + 32);
      }
      return { ...base3, leafHashes };
    }
    function encode19(data) {
      const base3 = parent.encode(data);
      const nHashesLen = encodingLength2(data.leafHashes.length);
      const nHashesBuf = new Uint8Array(nHashesLen);
      encode4(data.leafHashes.length, nHashesBuf);
      const value2 = concat([nHashesBuf, ...data.leafHashes, base3.value]);
      return { ...base3, value: value2 };
    }
    const expected14 = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; leafHashes: Uint8Array[]; }";
    function check15(data) {
      return Array.isArray(data.leafHashes) && data.leafHashes.every(
        (leafHash) => leafHash instanceof Uint8Array && leafHash.length === 32
      ) && parent.check(data);
    }
    return {
      decode: decode18,
      encode: encode19,
      check: check15,
      expected: expected14,
      canAddToArray: parent.canAddToArray
    };
  }

  // node_modules/bip174/src/esm/lib/converter/shared/tapInternalKey.js
  function makeConverter4(TYPE_BYTE) {
    function decode18(keyVal) {
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
    function encode19(value2) {
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
      decode: decode18,
      encode: encode19,
      check: check15,
      expected: expected14,
      canAdd: canAdd10
    };
  }

  // node_modules/bip174/src/esm/lib/converter/shared/witnessScript.js
  function makeConverter5(TYPE_BYTE) {
    function decode18(keyVal) {
      if (keyVal.key[0] !== TYPE_BYTE) {
        throw new Error(
          "Decode Error: could not decode witnessScript with key 0x" + toHex(keyVal.key)
        );
      }
      return keyVal.value;
    }
    function encode19(data) {
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
      decode: decode18,
      encode: encode19,
      check: check15,
      expected: expected14,
      canAdd: canAdd10
    };
  }

  // node_modules/bip174/src/esm/lib/converter/index.js
  var globals = {
    unsignedTx: unsignedTx_exports,
    globalXpub: globalXpub_exports,
    // pass an Array of key bytes that require pubkey beside the key
    checkPubkey: makeChecker([])
  };
  var inputs = {
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
  var outputs = {
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

  // node_modules/bip174/src/esm/lib/utils.js
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
  var updateGlobal = updateMaker("global");
  var updateInput = updateMaker("input");
  var updateOutput = updateMaker("output");

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
  var isP2MS = isPaymentFactory(p2ms);
  var isP2PK = isPaymentFactory(p2pk);
  var isP2PKH = isPaymentFactory(p2pkh);
  var isP2WPKH = isPaymentFactory(p2wpkh);
  var isP2WSHScript = isPaymentFactory(p2wsh);
  var isP2SHScript = isPaymentFactory(p2sh);
  var isP2TR = isPaymentFactory(p2tr);

  // node_modules/bitcoinjs-lib/src/esm/psbt.js
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
  var checkRedeemScript = scriptCheckerFactory(p2sh, "Redeem script");
  var checkWitnessScript = scriptCheckerFactory(
    p2wsh,
    "Witness script"
  );

  // src/core.js
  var enc = new TextEncoder();
  var dec = new TextDecoder();
  function recoveryChallenge() {
    const choices = Array.from({ length: 12 }, (_, i) => i);
    for (let i = 11; i > 0; i--) {
      const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices.slice(0, 3).sort((a, b) => a - b);
  }
  function decimal(n, places = 8) {
    n = BigInt(n);
    const s = n.toString().padStart(places + 1, "0");
    const f = places ? s.slice(-places).replace(/0+$/, "") : "";
    return places ? s.slice(0, -places) + (f ? "." + f : "") : s;
  }

  // src/history.js
  function movementText(change) {
    const amount = Number.isInteger(change.decimals) ? decimal(change.amount_units, change.decimals) : change.amount_units;
    const symbol = change.ticker || change.asset.slice(0, 8) + "\u2026" + change.asset.slice(-4);
    return `${change.direction === "send" ? "Sent" : "Received"} ${amount} ${symbol}${Number.isInteger(change.decimals) ? "" : " units"}`;
  }
  function activityTitle(tx) {
    if (tx.changes?.length === 1) return movementText(tx.changes[0]);
    if (tx.changes?.length > 1) return tx.type === "swap" ? "Swap" : "Asset transfer";
    if (tx.type === "swap") return `Swapped ${tx.amount} ${tx.tickerIn || tx.assetIn || "ECX"}`;
    if (tx.type === "asset") return "Asset transaction";
    if (tx.type === "unknown") return "Transaction";
    return `${tx.type === "send" ? "Sent" : "Received"} ${tx.amount} ${tx.ticker || tx.asset || "ECX"}`;
  }

  // src/api.js
  var EXPLORERS = Object.freeze({ ecash: "https://explorer.blockfab.org/betanet", flush: "https://explorer.blockfab.org/betanet/flush" });
  function explorerBase(chain = "flush") {
    const base3 = EXPLORERS[chain];
    if (!base3) throw Error("Unknown chain");
    return base3;
  }

  // src/rpc.js
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
    for (const chain of ["ecash", "flush"]) {
      const node = c?.[chain];
      if (!node) throw Error("Enter both eCash and Flush RPC endpoints");
      const auth = node.auth || "";
      if (typeof auth !== "string" || auth.length > 4096 || /[\r\n]/.test(auth) || auth && !auth.includes(":")) throw Error("RPC credentials must be username:password, or the contents of the cookie file");
      out[chain] = { url: rpcURL(node.url), auth };
    }
    return out;
  }

  // src/popup.js
  var app = document.querySelector("#app");
  var approval = new URLSearchParams(location.search).has("approval");
  var mark = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h24M8 12.5h17M12 19h10M15 25.5h4"/></svg>';
  var e = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var short = (s) => s ? s.slice(0, 7) + "\u2026" + s.slice(-5) : "";
  var state;
  var view = "home";
  var dash;
  var phrase = "";
  var currentPlan = null;
  var busy = false;
  var receiveTab = "native";
  var token = "ECX";
  var selectedChain = "flush";
  var $ = (s) => document.querySelector(s);
  async function call(type, args = {}) {
    const r = await chrome.runtime.sendMessage({ type, ...args });
    if (!r?.ok) throw Error(r?.error || "Wallet unavailable");
    return r.result;
  }
  function toast(s) {
    const el = $("#toast");
    el.textContent = s;
    el.style.display = "block";
    setTimeout(() => el.style.display = "none", 1800);
  }
  function showError(err) {
    const old = $(".error");
    old?.remove();
    const p = document.createElement("div");
    p.className = "error";
    p.setAttribute("role", "alert");
    p.textContent = err.message || String(err);
    app.append(p);
  }
  function bind(id, fn) {
    const el = $("#" + id);
    if (el) el.onclick = async () => {
      if (busy) return;
      busy = true;
      el.disabled = true;
      try {
        await fn();
      } catch (err) {
        showError(err);
      } finally {
        busy = false;
        el.disabled = false;
      }
    };
  }
  function header() {
    return `<header><div class="account"><div class="avatar">${mark}</div><div><strong>Wallet 1</strong><small>${e(short(state.account?.address))}</small></div></div><div><button class="icon" id="copy" title="Copy address" aria-label="Copy address">${icon("copy")}</button><button class="icon" id="lock" title="Lock wallet" aria-label="Lock wallet">${icon("lock")}</button></div></header>`;
  }
  function nav() {
    return `<footer><button id="home" class="${view === "home" ? "active" : ""}"><b>${icon("wallet")}</b>Wallet</button><button id="history" class="${view === "history" ? "active" : ""}"><b>${icon("history")}</b>Activity</button><button id="settings" class="${view === "settings" ? "active" : ""}"><b>${icon("settings")}</b>Settings</button></footer>`;
  }
  function base2(content, back = false) {
    app.innerHTML = header() + `<div class="pad">${back ? '<button id="back" class="back">\u2190 Back</button>' : ""}${content}</div>` + (view === "approval" ? "" : nav());
    window.scrollTo(0, 0);
    for (const img of document.querySelectorAll(".coin img")) img.addEventListener("error", () => img.remove());
    bind("copy", async () => {
      await navigator.clipboard.writeText(state.account.address);
      toast("Address copied");
    });
    bind("lock", async () => {
      await call("LOCK");
      await load();
    });
    for (const v of ["home", "history", "settings"]) bind(v, () => go(v));
    bind("back", () => go("home"));
  }
  async function go(v) {
    view = v;
    currentPlan = null;
    phrase = "";
    await render();
  }
  async function load() {
    state = await call("STATE");
    if (!state.account) return onboarding();
    if (!state.unlocked) return unlock();
    if (approval) {
      view = "approval";
    }
    await render();
  }
  function onboarding() {
    app.innerHTML = `<div class="pad intro"><div class="brand">${mark}Flush</div><div class="hero-logo">${mark}</div><h1>Your wallet.<br>On Flush.</h1><p>eCash, Flush and your tokens.</p><button class="primary" id="new">Create a wallet</button><button class="secondary" id="import">I have a recovery phrase</button><p class="fine">eCash + Flush \xB7 Betanet</p></div>`;
    bind("new", async () => {
      phrase = (await call("GENERATE")).mnemonic;
      setup(false);
    });
    bind("import", () => {
      phrase = "";
      setup(true);
    });
  }
  function setup(importing) {
    if (!importing) {
      app.innerHTML = `<div class="pad"><button class="back" id="back">\u2190 Back</button><h1>Save your recovery phrase</h1><p>Write these 12 words down in order. They restore both your eCash and Flush accounts.</p><div class="words">${phrase.split(" ").map((w, i) => `<span><small>${i + 1}</small>${e(w)}</span>`).join("")}</div><button class="primary" id="continue">I saved these words</button><p class="fine">Keep them private. Anyone with these words can spend your funds.</p></div>`;
      window.scrollTo(0, 0);
      bind("back", () => {
        phrase = "";
        onboarding();
      });
      bind("continue", () => confirmBackup());
      return;
    }
    app.innerHTML = `<div class="pad"><button class="back" id="back">\u2190 Back</button><h1>Import your wallet</h1><p>One recovery phrase restores your eCash and Flush accounts.</p><label for="seed">Recovery phrase</label><textarea id="seed" autocomplete="off" spellcheck="false"></textarea>${passwordFields()}<button class="primary" id="create">Import wallet</button><p class="fine">Your recovery phrase and password stay on this device.</p></div>`;
    window.scrollTo(0, 0);
    bind("back", onboarding);
    bind("create", async () => {
      checkPassword();
      await call("CREATE", { mnemonic: $("#seed").value.trim().split(/\s+/).join(" "), password: $("#password").value, imported: true });
      await load();
    });
  }
  function passwordFields() {
    return '<label for="password">Password \xB7 at least 12 characters</label><input id="password" type="password" autocomplete="new-password" minlength="12"><label for="repeat">Confirm password</label><input id="repeat" type="password" autocomplete="new-password">';
  }
  function checkPassword() {
    if ($("#password").value !== $("#repeat").value) throw Error("Passwords do not match");
    if ($("#password").value.length < 12) throw Error("Use a password of at least 12 characters");
  }
  function confirmBackup() {
    const indices = recoveryChallenge();
    app.innerHTML = `<div class="pad"><button class="back" id="back">\u2190 Back</button><h1>Check your backup</h1><p>Enter the words at these positions.</p>${indices.map((i, n) => `<label for="word-${n}">Word ${i + 1}</label><input id="word-${n}" autocomplete="off" autocapitalize="none" spellcheck="false">`).join("")}${passwordFields()}<button class="primary" id="create">Create wallet</button><p class="fine">This password unlocks this browser. Your recovery phrase restores your wallet.</p></div>`;
    window.scrollTo(0, 0);
    bind("back", () => setup(false));
    bind("create", async () => {
      checkPassword();
      await call("CREATE", { mnemonic: phrase, password: $("#password").value, backupCheck: { indices, answers: indices.map((_, n) => $("#word-" + n).value) } });
      phrase = "";
      await load();
    });
  }
  function unlock() {
    app.innerHTML = `<div class="pad intro"><div class="brand">${mark}Flush</div><div class="hero-logo">${mark}</div><h1>Welcome back</h1><p>Your wallet is locked.</p><label for="password">Password</label><input type="password" id="password" autocomplete="current-password"><button class="primary" id="unlock">Unlock</button><p class="fine">${e(short(state.account.address))} \xB7 Betanet</p></div>`;
    bind("unlock", async () => {
      await call("UNLOCK", { password: $("#password").value });
      await load();
    });
    $("#password").addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") $("#unlock").click();
    });
    $("#password").focus();
  }
  async function dashboard() {
    if (!dash) base2('<div class="loading">Connecting\u2026</div>');
    dash = await call("DASHBOARD");
    return dash;
  }
  async function render() {
    if (view === "home") {
      await dashboard();
      const total = dash.l1_balance_sat === null || dash.balance_sat === null ? null : BigInt(dash.l1_balance_sat) + BigInt(dash.balance_sat);
      const native = (chain, name, value2) => `<button class="asset asset-button" data-native="${chain}"><div class="coin">${chain === "flush" ? mark : "E"}</div><div class="name"><strong>${name}</strong><small>${value2 === null ? "Balance unavailable" : "ECX \xB7 " + (chain === "ecash" ? "eCash" : "Flush")}</small></div><div class="right"><strong>${e(value2 === null ? "\u2014" : value2 === "0" ? "0.00" : decimal(value2))}</strong><small>ECX</small></div></button>`;
      base2(`<div class="balance"><div class="amount">${e(total === null ? "\u2014" : total === 0n ? "0.00" : decimal(total))}</div><div class="unit">ECX</div></div><div class="network"><span class="dot"></span>Betanet \xB7 eCash + Flush</div><div class="actions"><button class="action" id="receive"><b>${icon("receive")}</b><span>Receive</span></button><button class="action" id="send"><b>${icon("send")}</b><span>Send</span></button><button class="action" id="swap"><b>${icon("swap")}</b><span>Swap</span></button></div><div class="section-head"><span>Your tokens</span><button class="icon" id="refresh" title="Refresh" aria-label="Refresh balance">${icon("refresh", 16)}</button></div>${native("ecash", "eCash", dash.l1_balance_sat)}${native("flush", "eCash on Flush", dash.balance_sat)}${dash.holdings.map((h) => {
        const a = dash.assets.find((a2) => a2.id === h.asset_id);
        return `<button class="asset asset-button" data-token="${e(h.asset_id)}"><div class="coin"><span>${e((a?.ticker || h.ticker || "?")[0])}</span>${dash.logos?.[h.asset_id] ? `<img src="${e(dash.logos[h.asset_id])}" alt="" loading="lazy">` : ""}</div><div class="name"><strong>${e(a?.display_name || a?.ticker || h.ticker)}</strong><small>${e(a?.ticker || h.ticker)} \xB7 Flush</small></div><div class="right"><strong>${e(decimal(h.amount_units, a?.decimals || 0))}</strong></div></button>`;
      }).join("")}${dash.tokenMetadataAvailable === false ? '<p class="fine">This node needs token-output metadata to show and spend Flush assets.</p>' : ""}`);
      for (const v of ["receive", "send", "swap"]) bind(v, () => {
        selectedChain = "flush";
        token = "ECX";
        receiveTab = "native";
        return go(v);
      });
      bind("refresh", () => render());
      for (const el of document.querySelectorAll("[data-native]")) el.onclick = () => {
        selectedChain = el.dataset.native;
        token = "ECX";
        go("asset");
      };
      for (const el of document.querySelectorAll("[data-token]")) el.onclick = () => {
        selectedChain = "flush";
        token = el.dataset.token;
        go("asset");
      };
      return;
    }
    if (view === "asset") {
      const a = token === "ECX" ? null : dash.assets.find((a2) => a2.id === token), h = dash.holdings.find((h2) => h2.asset_id === token);
      const value2 = token === "ECX" ? selectedChain === "ecash" ? dash.l1_balance_sat : dash.balance_sat : h?.amount_units || "0", places = a?.decimals ?? 8;
      base2(`<h1>${e(a?.ticker || "ECX")}</h1><p>${e(a?.display_name || (selectedChain === "ecash" ? "eCash" : "eCash on Flush"))}</p><div class="balance"><div class="amount">${e(value2 === null ? "\u2014" : value2 === "0" ? "0.00" : decimal(value2, places))}</div><div class="unit">${e(a?.ticker || "ECX")}</div></div><div class="network">Betanet \xB7 ${selectedChain === "ecash" ? "eCash" : "Flush"}</div><div class="actions ${selectedChain === "ecash" ? "two" : ""}"><button class="action" id="receive"><b>${icon("receive")}</b><span>Receive</span></button><button class="action" id="send"><b>${icon("send")}</b><span>Send</span></button>${selectedChain === "flush" ? `<button class="action" id="swap"><b>${icon("swap")}</b><span>Swap</span></button>` : ""}</div>${a?.info ? `<p class="fine">${e(a.info)}</p>` : ""}`, true);
      bind("receive", () => {
        receiveTab = selectedChain === "ecash" ? "l1" : "native";
        return go("receive");
      });
      for (const v of ["send", "swap"]) bind(v, () => go(v));
      return;
    }
    if (view === "receive") {
      if (!dash) await dashboard();
      const l1 = receiveTab === "l1", native = receiveTab === "native", addr = l1 ? state.account.accounts.ecash.address : native ? state.account.address : dash.deposit;
      base2(`<h1>Receive</h1><div class="tabs"><button id="l1" class="${l1 ? "active" : ""}">eCash</button><button id="native" class="${native ? "active" : ""}">Flush</button><button id="deposit" class="${receiveTab === "deposit" ? "active" : ""}">Deposit to Flush</button></div><img class="qr" id="qr" alt="Receive address QR code"><div class="address">${e(addr)}</div><button class="primary" id="copy-receive">Copy ${l1 || native ? "address" : "deposit address"}</button><p class="fine">${l1 ? "Receive L1 ECX on eCash betanet." : native ? "Receive ECX and assets already on Flush betanet." : "Use this address for a BIP300 deposit into Flush, slot 99. A plain eCash transfer to the escrow is not a deposit."}</p>`, true);
      $("#qr").src = await import_qrcode.default.toDataURL(addr, { margin: 2, width: 380, color: { dark: "#08090b", light: "#ffffff" } });
      for (const tab of ["l1", "native", "deposit"]) bind(tab, () => {
        receiveTab = tab;
        return render();
      });
      bind("copy-receive", async () => {
        await navigator.clipboard.writeText(addr);
        toast("Address copied");
      });
      return;
    }
    if (view === "send" || view === "swap") {
      await dashboard();
      const swap = view === "swap", options = (swap ? "" : '<option value="L1_ECX">ECX \xB7 eCash</option>') + '<option value="ECX">ECX \xB7 Flush</option>' + dash.assets.map((a) => `<option value="${e(a.id)}">${e(a.ticker)} \xB7 Flush</option>`).join("");
      base2(`<h1>${swap ? "Swap" : "Send"}</h1><label for="asset">${swap ? "You pay" : "Asset"}</label><select id="asset">${options}</select>${swap ? `<label for="to-asset">You receive</label><select id="to-asset">${options}</select>` : '<label id="recipient-label" for="to">Recipient</label><input id="to" placeholder="Address" autocomplete="off" spellcheck="false">'}<label for="amount">Amount</label><input id="amount" inputmode="decimal" placeholder="0.00" autocomplete="off">${swap ? '<p class="fine">Trades use ECX and tokens on Flush. 1% slippage; the minimum received is enforced on-chain.</p>' : ""}<button class="primary" id="review">Review ${swap ? "swap" : "send"}</button>`, true);
      $("#asset").value = selectedChain === "ecash" && !swap ? "L1_ECX" : token;
      if (swap) {
        $("#to-asset").value = token !== "ECX" ? "ECX" : dash.assets[0]?.id || "ECX";
      } else {
        const hint = () => {
          const l1 = $("#asset").value === "L1_ECX";
          $("#recipient-label").textContent = l1 ? "Recipient \xB7 eCash betanet" : "Recipient \xB7 Flush betanet";
          $("#to").placeholder = l1 ? "eCash address \xB7 bc1\u2026" : "Flush address \xB7 bflx1\u2026";
        };
        hint();
        $("#asset").addEventListener("change", hint);
      }
      bind("review", async () => {
        const choice = $("#asset").value;
        currentPlan = await call(swap ? "PREPARE_SWAP" : "PREPARE_SEND", swap ? { from: choice, to: $("#to-asset").value, amount: $("#amount").value } : { chain: choice === "L1_ECX" ? "ecash" : "flush", asset: choice === "L1_ECX" ? "ECX" : choice, to: $("#to").value.trim(), amount: $("#amount").value });
        confirmPlan(false);
      });
      return;
    }
    if (view === "history") {
      base2('<h1>Activity</h1><div class="loading">Loading transactions\u2026</div>');
      const result = await call("HISTORY"), history = result.items;
      base2(`<h1>Activity</h1>${result.localOnly ? '<p class="fine" role="note">In own-node mode, Activity only shows sends and swaps made in this browser. Incoming transfers are included in your balance.</p>' : ""}${history.length ? history.map((t) => `<div class="card"><div class="split"><strong>${e(activityTitle(t))}</strong><small>${t.time ? new Date(t.time).toLocaleDateString() : "Pending"}</small></div>${t.changes?.length > 1 ? t.changes.map((c) => `<p class="fine">${e(movementText(c))}</p>`).join("") : ""}${t.fee_sat ? `<div class="split fine"><span>Network fee</span><span>${e(decimal(t.fee_sat))} ECX</span></div>` : ""}${t.tokenDetailsUnavailable ? '<p class="fine">Some token details are unavailable from this connection.</p>' : ""}<div class="split"><small>${t.chain === "ecash" ? "eCash" : "Flush"} \xB7 ${t.status === "confirmed" || t.confirmed ? "Confirmed" : t.status === "failed" ? "Rejected" : t.status === "unknown" ? "Status unknown" : "Pending"}</small><a class="break fine" href="${explorerBase(t.chain || "flush")}/tx/${e(t.txid)}" target="_blank" rel="noopener">${e(short(t.txid))} \u2197</a></div></div>`).join("") : '<div class="empty">No transactions yet.</div>'}${result.unavailableChains.length ? `<p class="fine">${e(result.unavailableChains.join(" and "))} history is unavailable from this connection.</p>` : ""}`);
      return;
    }
    if (view === "settings") {
      base2(`<h1>Settings</h1><div class="card"><div class="split"><span>Network</span><strong>eCash + Flush \xB7 Betanet</strong></div><div class="split"><span>Signing</span><strong>On this device</strong></div><div class="split"><span>Auto-lock</span><strong>2 minutes</strong></div></div><button class="secondary" id="recovery">Show recovery phrase</button><details class="advanced" id="advanced"><summary>Advanced</summary><button class="secondary" id="connection">Connection</button></details><div class="divider"></div><p class="fine">Temporary betanet. This chain will be replaced when Flush moves to slot 46.</p><p class="fine">Wallet 0.3.4 \xB7 Browser signing<br></p>`);
      bind("recovery", recovery);
      bind("connection", () => go("connection"));
      return;
    }
    if (view === "connection") {
      const config = await call("CONNECTION");
      base2(`<h1>Connection</h1><label class="choice"><input type="radio" name="connection-mode" id="mode-explorer" ${config.mode === "explorer" ? "checked" : ""}><span>Explorer <small>Default</small></span></label><p class="fine">Use the public eCash and Flush explorer.</p><label class="choice"><input type="radio" name="connection-mode" id="mode-rpc" ${config.mode === "rpc" ? "checked" : ""}><span>Your own node</span></label><div id="rpc-fields" ${config.mode === "rpc" ? "" : "hidden"}><p class="fine">Pair eCash betanet and Flush slot 99 RPC nodes.</p>${["ecash", "flush"].map((chain) => `<label for="${chain}-url">${chain === "ecash" ? "eCash" : "Flush"} RPC URL</label><input id="${chain}-url" type="url" value="${e(config[chain]?.url || "")}" placeholder="http://127.0.0.1:${chain === "ecash" ? "8332" : "38994"}" autocomplete="off" spellcheck="false"><label for="${chain}-auth">RPC credentials</label><input id="${chain}-auth" type="password" placeholder="${config[chain]?.hasAuth ? "Saved \u2014 leave blank to keep" : "username:password or cookie contents"}" autocomplete="off" spellcheck="false">`).join("")}<button class="primary" id="pair-rpc">${config.mode === "rpc" ? "Update connection" : "Pair nodes"}</button><p class="fine">Chrome asks for access to these node hosts when you pair. Credentials are encrypted on this device; transactions are signed in this wallet.</p><p class="fine">Direct RPC activity shows transactions sent by this wallet. Token outputs require the node\u2019s token metadata.</p></div><button class="primary" id="use-explorer" ${config.mode === "rpc" ? "hidden" : ""}>Use explorer</button>`, true);
      const toggle = () => {
        const own = $("#mode-rpc").checked;
        $("#rpc-fields").hidden = !own;
        $("#use-explorer").hidden = own;
      };
      $("#mode-explorer").addEventListener("change", toggle);
      $("#mode-rpc").addEventListener("change", toggle);
      bind("pair-rpc", async () => {
        const connection = validateConnection({ ecash: { url: $("#ecash-url").value.trim(), auth: $("#ecash-auth").value.trim() }, flush: { url: $("#flush-url").value.trim(), auth: $("#flush-auth").value.trim() } });
        const origins = [...new Set(["ecash", "flush"].map((chain) => rpcOrigin(connection[chain].url)))];
        const allowed = await chrome.permissions.request({ origins });
        if (!allowed) throw Error("Node access was not granted. Explorer mode remains available.");
        await call("PAIR_RPC", { connection });
        state = await call("STATE");
        dash = null;
        await render();
        toast("Nodes paired");
      });
      bind("use-explorer", async () => {
        await call("USE_EXPLORER");
        state = await call("STATE");
        dash = null;
        await render();
        toast("Using explorer");
      });
      return;
    }
    if (view === "approval") {
      const pending = await call("PENDING");
      if (!pending) {
        base2("<h1>No pending request</h1>");
        return;
      }
      currentPlan = await call("PREPARE_PENDING");
      confirmPlan(true, pending.origin);
      return;
    }
  }
  function confirmPlan(dapp, origin) {
    const s = currentPlan.summary, connect = s.type === "connect";
    base2(`<h1>${connect ? "Connect to Flush" : s.type === "swap" ? "Review swap" : "Review send"}</h1>${dapp ? `<div class="card request">Requested by <strong>${e(origin)}</strong></div>` : ""}<div class="card">${connect ? `<p>This shares your public address.</p><div class="address">${e(s.address)}</div>` : s.type === "swap" ? `<div class="split"><span>You pay</span><strong>${e(s.amount)} ${e(s.tickerIn || s.assetIn)}</strong></div><div class="split"><span>Minimum received</span><strong>${e(s.minOut)} ${e(s.tickerOut || s.assetOut)}</strong></div>` : `<div class="split"><span>Amount</span><strong>${e(s.amount)} ${e(s.ticker || s.asset)}</strong></div><label>Recipient</label><div class="address">${e(s.to)}</div>`}${!connect ? `<div class="split"><span>Network fee</span><strong>${e(decimal(currentPlan.fee_sat))} ECX</strong></div>` : ""}<div class="split"><span>Network</span><strong>${s.chain === "ecash" ? "eCash betanet" : "Flush betanet"}</strong></div></div><button class="primary" id="approve">${connect ? "Connect" : "Confirm and sign"}</button><button class="secondary" id="cancel">Cancel</button><p class="fine">${connect ? "No private keys are shared." : "Signed on your device. Your recovery phrase never leaves this browser."}</p>`, !dapp);
    bind("approve", async () => {
      const result = await call(dapp ? "RESOLVE_PENDING" : "APPROVE", dapp ? { approved: true, planId: currentPlan.id } : { planId: currentPlan.id });
      if (connect) {
        base2("<h1>Connected</h1><p>Your address was shared with flush.markets.</p>");
      } else {
        base2(`<h1 class="success">Transaction sent</h1><div class="card break">${e(result.txid)}</div><button class="primary" id="done">Done</button>`);
        bind("done", () => dapp ? window.close() : go("home"));
      }
    });
    bind("cancel", async () => {
      if (dapp) {
        await call("RESOLVE_PENDING", { approved: false });
        window.close();
      } else await go("home");
    });
  }
  function recovery() {
    base2('<h1>Recovery phrase</h1><p>Enter your password to reveal your recovery phrase. Keep it private.</p><label for="password">Password</label><input id="password" type="password" autocomplete="current-password"><button class="primary" id="reveal">Reveal phrase</button>', true);
    bind("reveal", async () => {
      const { mnemonic } = await call("RECOVERY", { password: $("#password").value });
      base2(`<h1>Recovery phrase</h1><div class="words">${mnemonic.split(" ").map((w, i) => `<span><small>${i + 1}</small>${e(w)}</span>`).join("")}</div><p>Anyone with these words can spend your funds.</p><button class="primary" id="hide">Hide phrase</button>`, true);
      bind("hide", () => go("settings"));
      setTimeout(() => {
        if (view === "settings" && $("#hide")) go("settings");
      }, 3e4);
    });
  }
  load().catch(showError);
})();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
