import Vocab from '$lib/server/vocab.json';
import Merges from '$lib/server/merges.json';

export class MyTokenizer {
  private vocab: Map<number, Buffer>;
  private inverseVocab: Map<string, number>;
  private merges: Map<string, number>;
  private pretokRegex: RegExp;
  private specialTokens: Set<string>;

  constructor(
    pretokenizePattern: string,
    specialTokens: string[]
  ) {
    this.specialTokens = new Set(specialTokens);
    this.pretokRegex = new RegExp(pretokenizePattern, 'gu');

    // Load vocab
    this.vocab = new Map();
    this.inverseVocab = new Map();

    for (const [k, v] of Object.entries(Vocab)) {
      const buf = Buffer.from(v, 'base64');
      const id = parseInt(k, 10);
      this.vocab.set(id, buf);
      this.inverseVocab.set(buf.toString('latin1'), id); // Use 'latin1' for 1:1 binary mapping
    }

    // Load merges
    this.merges = new Map();
    for (const [k, v] of Object.entries(Merges)) {
      this.merges.set(k, v as number);
    }
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

  encode(text: string): number[] {
    const substrs = this.splitPreserveSpecials(text);
    let ids: number[] = [];

    for (const s of substrs) {
      if (this.specialTokens.has(s)) {
        const tokenBytes = Buffer.from(s, 'utf-8').toString('latin1');
        const id = this.inverseVocab.get(tokenBytes);
        if (id !== undefined) ids.push(id);
      } else {
        const bytes = Buffer.from(s, 'utf-8');
        for (const byte of bytes) {
          ids.push(byte);
        }
      }
    }

    while (true) {
      const pairs: [number, number][] = [];
      for (let i = 0; i < ids.length - 1; i++) {
        pairs.push([ids[i], ids[i + 1]]);
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

      const newIds: number[] = [];
      let i = 0;
      while (i < ids.length) {
        if (i < ids.length - 1 && ids[i] === a && ids[i + 1] === b) {
          newIds.push(newId);
          i += 2;
        } else {
          newIds.push(ids[i]);
          i += 1;
        }
      }

      ids = newIds;
    }

    return ids;
  }

  decode(ids: number[]): string {
    const chunks: Buffer[] = [];

    for (const id of ids) {
      const chunk = this.vocab.get(id);
      if (chunk) {
        chunks.push(chunk);
      }
    }

    return Buffer.concat(chunks).toString('utf-8');
  }
}
