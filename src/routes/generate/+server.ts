import type { RequestHandler } from '@sveltejs/kit';
import { Model } from '$lib/server/GPTModel';
import { MyTokenizer } from '$lib/server/Tokenizer';


type RequestDataType = {
    input: string;
    speed?: number;
    temperature?: number;
};


const MAX_CONTEXT_LENGTH = 32;
const SPECIAL_TOKENS = ['[EOD]'];
const PRETOKENIZE_PATTERN =
    "(?:'s|'t|'re|'ve|'m|'ll|'d)|\\s?\\p{L}+|\\s?\\p{N}+|\\s?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+";

const tokenizer = new MyTokenizer(PRETOKENIZE_PATTERN, SPECIAL_TOKENS);

const model = new Model();
const modelReady = model.init();

export const POST: RequestHandler = async ({ request }) => {
    await modelReady;

    let data: RequestDataType;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!('input' in data)) {
        return new Response(
            JSON.stringify({ error: '`input` field is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (typeof data.input !== 'string' || data.input.trim() === '') {
        return new Response(
            JSON.stringify({ error: '`input` must be a non-empty string' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (data.speed !== undefined && (typeof data.speed !== 'number' || data.speed <= 0)) {
        return new Response(JSON.stringify({ error: '`speed` must be a positive number' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const DESIRED_CHAR_PER_SEC = data.speed ?? 32;
    const TEMPERATURE = data.temperature ?? 0.7;
    const delay = 1000 / DESIRED_CHAR_PER_SEC;

    const now = new Date().toISOString();
    console.log(`[ ${now} ][ ${request.url} ] [ Speed: ${data.speed} ] [ Temperature: ${data.temperature} ] [ ${data.input} ]`);
    let context = tokenizer.encode(data.input);
    //context = context.slice(-MAX_CONTEXT_LENGTH);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            let tokenCount = 0;
            let closed = false;
            async function generate() {

                if (tokenCount >= 400) {
                    closed = true;
                    controller.close();
                    return;
                }

                const next = await model.nextChar(context, TEMPERATURE);
                const output = tokenizer.decode([next]);

                if (output === SPECIAL_TOKENS[0]) {
                    closed = true;
                    controller.close();
                    return;
                }

                tokenCount++;
                context.push(next);
                context = context.slice(-MAX_CONTEXT_LENGTH);

                if (!closed) {
                    try {
                        controller.enqueue(encoder.encode(output));
                    } catch (err) {
                        console.error('Attempted to enqueue after close:', err);
                        closed = true;
                        return;
                    }

                    setTimeout(generate, delay);
                }
            }

            generate();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};

