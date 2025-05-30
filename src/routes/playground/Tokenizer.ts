import Vocab from './vocab.json';
import Merges from './merges.json';

export class MyTokenizer {
  private vocab: Map<number, Uint8Array>;
  private inverseVocab: Map<string, number>;
  private merges: Map<string, number>;
  private pretokRegex: RegExp;
  private specialTokens: Set<string>;
  private textEncoder: TextEncoder;

  constructor(
    pretokenizePattern: string,
    specialTokens: string[]
  ) {
    this.specialTokens = new Set(specialTokens);
    this.pretokRegex = new RegExp(pretokenizePattern, 'gu');

    this.textEncoder = new TextEncoder();

    // Load vocab
    this.vocab = new Map();
    this.inverseVocab = new Map();

    for (const [k, v] of Object.entries(Vocab)) {
      // Decode base64 string to Uint8Array
      const bytes = this.base64ToUint8Array(v);
      const id = parseInt(k, 10);
      this.vocab.set(id, bytes);
      // Use latin1-like string by converting bytes to string with char codes 0-255
      const key = this.uint8ArrayToLatin1String(bytes);
      this.inverseVocab.set(key, id);
    }

    // Load merges
    this.merges = new Map();
    for (const [k, v] of Object.entries(Merges)) {
      this.merges.set(k, v as number);
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    // atob converts base64 to binary string
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private uint8ArrayToLatin1String(arr: Uint8Array): string {
    // Convert each byte to a char code 0-255 for a latin1-like string
    return String.fromCharCode(...arr);
  }

  private splitPreserveSpecials(text: string): string[] {
    const pat = Array.from(this.specialTokens)
      .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const split = text.split(new RegExp(`(${pat})`, 'g'));
    const output: string[] = [];

    for (const part of split) {
      if (!part) continue;
      if (this.specialTokens.has(part)) {
        output.push(part);
      } else {
        output.push(...(part.match(this.pretokRegex) ?? []));
      }
    }
    return output;
  }

  encode(text: string): { id: number, char: string }[] {
    const substrs = this.splitPreserveSpecials(text);
    let tokens: { id: number, char: string }[] = [];

    for (const s of substrs) {
      if (this.specialTokens.has(s)) {
        const encoded = this.textEncoder.encode(s);
        const key = this.uint8ArrayToLatin1String(encoded);
        const id = this.inverseVocab.get(key);
        if (id !== undefined) {
          tokens.push({ id, char: s });
        }
      } else {
        const bytes = this.textEncoder.encode(s);
        for (const byte of bytes) {
          tokens.push({ id: byte, char: String.fromCharCode(byte) });
        }
      }
    }

    while (true) {
      const pairs: [number, number][] = [];
      for (let i = 0; i < tokens.length - 1; i++) {
        pairs.push([tokens[i].id, tokens[i + 1].id]);
      }

      let bestPair: [number, number] | null = null;
      let bestRank = Infinity;

      for (const pair of pairs) {
        const key = `${pair[0]},${pair[1]}`;
        const rank = this.merges.get(key);
        if (rank !== undefined && rank < bestRank) {
          bestRank = rank;
          bestPair = pair;
        }
      }

      if (!bestPair) break;

      const [a, b] = bestPair;
      const newId = this.merges.get(`${a},${b}`)!;

      const newTokens: { id: number, char: string }[] = [];
      let i = 0;
      while (i < tokens.length) {
        if (
          i < tokens.length - 1 &&
          tokens[i].id === a &&
          tokens[i + 1].id === b
        ) {
          newTokens.push({
            id: newId,
            char: tokens[i].char + tokens[i + 1].char
          });
          i += 2;
        } else {
          newTokens.push(tokens[i]);
          i += 1;
        }
      }

      tokens = newTokens;
    }

    return tokens;
  }

}
