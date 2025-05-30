import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as ort from 'onnxruntime-node';
import onnx from '$lib/server/gpt_model.onnx?url';
import { read } from '$app/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modelPath = join(__dirname, 'gpt_model.onnx');

function sampleFromDistribution(probs: number[], temperature: number): number {
  const scaled = probs.map(v => Math.exp(v / temperature));
  const sum = scaled.reduce((a, b) => a + b, 0);
  const norm = scaled.map(v => v / sum);
  const r = Math.random();
  let cumSum = 0;
  for (let i = 0; i < norm.length; i++) {
    cumSum += norm[i];
    if (r < cumSum) return i;
  }
  return norm.length - 1;
}

export class Model {
  private session!: ort.InferenceSession;
  maxContextLength: number;

  constructor(
    maxContextLength = 32,
  ) {
    this.maxContextLength = maxContextLength;
  }

  async init() {
    //console.log({true: modelPath, vite: onnx})
    const modelBytes = await read(onnx).arrayBuffer();
    //console.log(modelBytes)
    //this.session = await ort.InferenceSession.create(modelPath);
    this.session = await ort.InferenceSession.create(modelBytes, {
    executionProviders: ['cpu'],   // or ['webgl'] / others, as needed
    // (other options…)
  });
  }

  async nextChar(context: number[], temperature=0.7): Promise<number> {
    const input = context.slice(-this.maxContextLength);
    const inputTensor = new ort.Tensor('int64', BigInt64Array.from(input.map(BigInt)), [1, input.length]);
    const inputName = this.session.inputNames[0];

    const outputs = await this.session.run({ [inputName]: inputTensor });
    const logits = outputs[this.session.outputNames[0]] as ort.Tensor;

    const vocabSize = logits.dims[2];
    const lastLogits = logits.data.slice(-vocabSize) as unknown as number[];

    return sampleFromDistribution(lastLogits, temperature);
  }

}
