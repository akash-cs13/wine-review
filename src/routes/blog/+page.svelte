<script lang="ts">
    import { Separator } from "$lib/components/ui/separator";

    const pattern =
        /(?:'s|'t|'re|'ve|'m|'ll|'d)|\s?\p{L}+|\s?\p{N}+|\s?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<div class="flex items-center justify-center pb-[calc(20vh)]">
    <div
        class="md:p-6 min-w-32 max-w-[calc(65ch+80px)] w-full mx-4 leading-relaxed tracking-normal prose prose-neutral dark:prose-invert indent-8"
    >
        <h1 class="text-3xl font-bold pt-[calc(10vh)] mb-4 indent-0">
            Smoll-GPT
        </h1>
        <p class="font-mono text-sm mb-4 indent-0 text-end">📅 13/6/2025</p>
        <p>
            My curiosity about large language models began when I took an ML &
            AI class at university. For our group project, we had to build a
            basic GPT-style model. The goal was simple: given a prompt like <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >I like</span
            >, the model should predict the next word, like "pizza". We were
            encouraged to use the
            <a
                href="https://www.kaggle.com/datasets/zynicide/wine-reviews"
                target="_blank"
                class="underline">wine-review dataset</a
            >. Our first attempt (built in PyTorch—you can view the code
            <a
                href="https://github.com/madhukar-d20/trends-of-ai"
                target="_blank"
                class="underline">here</a
            >) didn’t go so well. For example, when we gave the model this
            input:

            <span
                class="bg-neutral-200 dark:bg-neutral-700 rounded px-2 font-mono text-sm py-[2px]"
            >
                wine review : US : Oregon : Pinot Gris : A wine
            </span>
            <br />It might generate gibberish like:
        </p>
        <div
            class="bg-neutral-200 dark:bg-neutral-700 rounded px-2 font-mono text-sm mb-2 indent-0"
        >
            80 thick grand curedhoively estateniently lacking ke easy
            historicornia excellence allow lane head tough cho
        </div>
        <p class="indent-0">or</p>
        <div
            class="bg-neutral-200 dark:bg-neutral-700 rounded px-2 font-mono text-sm mb-4 indent-0"
        >
            managed concentration rust adding lingeringster honey50 goatpieble
            remains lou toward elegant distinctly coun maintains pairs.
        </div>
        <p>
            Clearly, the model was hallucinating nonsense. We used the GPT-2
            tokenizer (with a vocabulary size of 50,257), which resulted in a
            model with ~13.9 million parameters, far too large for our dataset
            of only ~120,000 reviews. We even tried a trigram model, and
            surprisingly, it outperformed our neural net. We experimented with
            different layer sizes, learning rates, and decoding strategies
            (top-n, top-p, beam search, repetition penalties). Still, our best
            model was a bloated 188.4 MB, and the text quality remained poor. We
            chalked it up to limited hardware and time.
        </p>
        <p>
            A few months later, while working on time series models and doing
            lots of data cleaning, I revisited the wine-review dataset. That’s
            when I found
            <a
                href="https://www.kaggle.com/span/arhamshahbaz/gpt-notebook"
                target="_blank"
                class="underline">arhamshahbaz’s</a
            >
            Kaggle notebook. Their approach was similar to ours but with a 5.8M parameter
            model (just 22.16 MB), their results were significantly better. The key
            difference? They used a custom tokenizer implemented in NumPy instead
            of the full GPT-2 tokenizer. Inspired, I decided to build my own tiny
            language model from scratch with a custom tokenizer and that’s how
            <span class="font-bold">Smoll-GPT</span> was born.
        </p>
        <br />
        <Separator class="my-4" />
        <h1 class="text-3xl font-bold mb-4 indent-0">Dataset</h1>
        <p>
            I’m using the <a
                href="https://www.kaggle.com/datasets/zynicide/wine-reviews"
                target="_blank"
                class="underline">zynicide/wine-reviews</a
            >
            dataset, which has 129,907 rows of wine reviews scraped from
            <a
                href="http://www.winemag.com/?s=&drink_type=wine"
                target="_blank"
                class="underline">WineEnthusiast.com</a
            >
            on June 15, 2017. The original author was inspired by the documentary
            <a
                href="http://www.imdb.com/title/tt2204371/"
                target="_blank"
                class="underline">Somm</a
            >
            and aimed to build a model that could “identify wines through blind tasting
            like a master sommelier.” My goal is a bit different: I want Smoll-GPT
            to generate a wine description given its
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >Country</span
            >,
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >Province</span
            >, and
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >Variety</span
            >.
        </p>
        <p>
            Funny enough, the dataset comes completely uncleaned. I found about
            10 K duplicates and filtered out rows with missing values, leaving
            me with 119,905 unique reviews. Since I’m more comfortable with
            numerical data, diving into NLP preprocessing was a new challenge.
            In my setup, each processed sample is structured as:
        </p>
        <div
            class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0"
        >
            wine review : &lt;country&gt; : &lt;province&gt; : &lt;variety&gt; :
            &lt;description&gt;[EOD]
        </div>
        <br />
        <p class="indent-0">
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >[EOD]</span
            > is a special token I use to signify the end of document.
        </p>
        <p>
            To build the tokenizer vocabulary, I also used a random subset of
            250 reviews plus three Wikipedia articles (<a
                href="https://en.wikipedia.org/wiki/Wine"
                target="_blank"
                class="underline">Wine</a
            >,
            <a
                href="https://en.wikipedia.org/wiki/Alcoholic_beverage"
                target="_blank"
                class="underline">Alcoholic Beverage</a
            >, and
            <a
                href="https://en.wikipedia.org/wiki/Old_World_wine"
                target="_blank"
                class="underline">Old World Wine</a
            >). All that text gets merged into a single file called
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >tokenizer.txt</span
            >.
        </p>
        <br />
        <Separator class="my-4" />
        <h1 class="text-3xl font-bold mb-4 indent-0">Tokenizer</h1>
        <p>
            The heart of this project is a custom Byte Pair Encoding (BPE)
            tokenizer, similar in spirit to GPT-2’s. I learned how BPE works
            from Andrej Karpathy’s <a
                href="https://www.youtube.com/watch?v=zduSFxRajkE&ab_channel=AndrejKarpathy"
                target="_blank"
                class="underline">tokenizer video</a
            >. Here’s a high-level overview of how my tokenizer works:
        </p>
        <br />
        <ol class="list-decimal ml-6 indent-0">
            <li>
                <p><strong>Unicode and Special Tokens</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        <p>
                            Start with UTF-8 byte encodings for all characters
                            (the first 256 tokens).
                        </p>
                    </li>
                    <li>
                        <p>
                            Reserve a special <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[EOD]</span
                            > token for “end of document.”
                        </p>
                    </li>
                    <li>
                        <p>
                            The rest of the vocabulary is learned by merging
                            frequent byte-pairs until we reach a vocab size of
                            5,000.
                        </p>
                    </li>
                </ul>
            </li>
            <br />
            <li>
                <p><strong>Pretokenization</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        <p>
                            I use the same regex as GPT-2 (which is fine for
                            wine reviews—no need for the more advanced patterns
                            that newer models use). The regex is:
                        </p>
                        <div
                            class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                        >
                            {pattern}
                        </div>
                    </li>
                    <li>
                        <p>
                            For example, <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0"
                                >wine review : Spain : Catalonia</span
                            >
                            splits into:<br />
                            <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0"
                                >[&#39;wine&#39;, &#39; review&#39;, &#39;
                                :&#39;, &#39; Spain&#39;, &#39; :&#39;, &#39;
                                Catalonia&#39;]</span
                            >
                        </p>
                    </li>
                </ul>
            </li>
            <br />
            <li>
                <p><strong>Byte-Pair Merging</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        <p>
                            Start with an initial vocab of 257 tokens (0–255 for
                            bytes, plus one for <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[EOD]</span
                            >).
                        </p>
                    </li>
                    <li>
                        <p>
                            Map each pretoken to its bytes. E.g., “wine” → <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0"
                                >[119, 105, 110, 101]</span
                            >.
                        </p>
                    </li>
                    <li>
                        <p>
                            Count all adjacent byte-pairs (e.g., <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0"
                                >(105, 110)</span
                            >,
                            <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >(110, 101)</span
                            >,
                            <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >(32, 114)</span
                            >, etc.).
                        </p>
                    </li>
                    <li>
                        <p>
                            Merge the most frequent pair (say, <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0"
                                >(105, 110)</span
                            > becomes a new token “in” with ID 257).
                        </p>
                    </li>
                    <li>
                        <p>Repeat the process until you have 5,000 tokens.</p>
                    </li>
                    <li>
                        <p>
                            Along the way, build <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >vocab.json</span
                            >
                            (mapping tokens to IDs) and
                            <span
                                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >merges.txt</span
                            > (list of merged byte-pairs in order).
                        </p>
                    </li>
                </ul>
            </li>
        </ol>
        <br />
        <p class="indent-6">
            For example, after merging, “wine review : Spain” might tokenize to <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >[1147, 332, 275, 676, 275, 2435]</span
            >
            down from 31 byte-level tokens to just 6. When decoding, you reverse
            the merges:
            <br />
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >1147</span
            >
            →
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >(119, 283)</span
            >
            →
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >(119, (257, 101))</span
            >
            →
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >(119, 105, 110, 101)</span
            >
            →
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >wine</span
            >
        </p>
        <p class="indent-6">
            Building a 5,000-token vocab required 4,743 merge operations. With
            about 147,048 initial tokens (25 K words from the 250 samples + ~75
            K words from the Wikipedia articles), the naive merging was <strong
                >O(M × N)</strong
            >
            (4,743 × 147,048), which took about
            <strong>7 minutes and 16 seconds</strong> on Colab’s free CPU tier. That’s
            fine for M≈5K, but obviously not optimal.
        </p>

        <p class="indent-0">
            Explore the tokenizer in an interactive
            <a
                href="/playground"
                class="underline">playground</a
            > inspired by TikTokenizer.
        </p>
        <br />
        <Separator class="my-4" />
        <h1 class="text-3xl font-bold mb-4 indent-0">
            Optimizing the Tokenizer
        </h1>
        <p>
            My first implementation was slow: naive pair-counting with Python
            dictionaries and repeated full scans made it roughly <strong
                >O(t²)</strong
            >
            on each BPE step, where t = number of byte-tokens in a single sequence.
            On the full dataset (~35 M characters), even with 5 threads, it was projected
            to take up to 2 hours and 20 minutes—way too slow.
            <br />So I rewrote the tokenizer using more efficient data
            structures:
        </p>
        <br />
        <ol class="list-decimal ml-6 indent-0">
            <li>
                <p><strong>Heap-Based Priority Queue</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        Store merge candidates in a max-heap keyed by frequency,
                        so we can pop the highest-frequency pair in <strong
                            >O(log N)</strong
                        > instead of scanning all pairs.
                    </li>
                </ul>
            </li>
            <li>
                <p><strong>Counter and defaultdict</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        Track pair frequencies and update counts in <strong
                            >O(1)</strong
                        >
                        per merge, rather than using expensive Python
                        <span
                            class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                            >min()</span
                        > or full-dictionary scans.
                    </li>
                </ul>
            </li>
            <li>
                <p><strong>Inverse Vocab Map</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        Map tokens → IDs and IDs → tokens for constant-time
                        lookups instead of linear searches.
                    </li>
                </ul>
            </li>
            <li>
                <p><strong>Precompiled Regex</strong></p>
                <ul class="list-disc ml-6">
                    <li>
                        Compile the pretokenization regex once to avoid repeated
                        overhead.
                    </li>
                </ul>
            </li>
        </ol>
        <br />
        <p>
            With these changes, each sequence’s merge loop is effectively <strong
                >O(t log t)</strong
            >. Tokenizing the full dataset now takes
            <strong>35 seconds</strong>—over <strong>200×</strong> speedup. I
            save the final token IDs into a PyTorch tensor called
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >data.pt</span
            >. In practice, you can skip re-tokenizing by simply loading
            <span
                class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px]"
                >data.pt</span
            > directly.
        </p>
        <br />
        <Separator class="my-4" />
        <h1 class="text-3xl font-bold mb-4 indent-0">Language Model</h1>
        <p>
            With my optimized tokenizer in hand, I implemented a small
            transformer-based Bigram Language Model inspired by Karpathy’s <a
                href="https://www.youtube.com/watch?v=kCc8FmEb1nY&ab_channel=AndrejKarpathy"
                target="_blank"
                class="underline">nanoGPT</a
            > video. Here are the key specs for Smoll-GPT:
        </p>
        <ul class="list-disc ml-6 indent-0">
            <li><p><strong>Vocabulary Size:</strong> 5,000</p></li>
            <li>
                <p><strong>Context Length (Block Size):</strong> 32 tokens</p>
            </li>
            <li><p><strong>Embedding Dimension:</strong> 64</p></li>
            <li><p><strong>Number of Transformer Blocks:</strong> 4</p></li>
            <li><p><strong>Number of Heads per Block:</strong> 4</p></li>
            <li><p><strong>Feedforward Hidden Size:</strong> 256</p></li>
        </ul>
        <br />
        <p class="indent-0">Below is a summary of the parameter counts:</p>
        <div
            class="overflow-x-auto border border-neutral-300 dark:border-neutral-700 rounded-md"
        >
            <table class="min-w-full text-left text-sm whitespace-nowrap">
                <thead
                    class="bg-neutral-200 text-neutral-800 dark:bg-neutral-300 dark:text-neutral-700"
                >
                    <tr>
                        <th class="px-4 py-2">Layer (type)</th>
                        <th class="px-4 py-2">Output Shape</th>
                        <th class="px-4 py-2">Param #</th>
                        <th class="px-4 py-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2 font-semibold">Embedding</td>
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">320,000</td>
                        <td class="px-4 py-2">
                            token_embedding_table: (5000, 64)
                        </td>
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2 font-semibold">Embedding</td>
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">2,048</td>
                        <td class="px-4 py-2">
                            position_embedding_table: (32, 64)
                        </td>
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2 font-semibold"
                            >Transformer Block × 4</td
                        >
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">~475,136</td>
                        <td class="px-4 py-2"
                            >Each block: MultiHeadAttention + FeedForward + LN</td
                        >
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2"
                            >└─ MultiHeadAttention (4 heads)</td
                        >
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">~20.5 K</td>
                        <td class="px-4 py-2"
                            >(4 × 3 × 64 × 16) + (64 × 64) + biases per block</td
                        >
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2">└─ FeedForward</td>
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">~17.2 K</td>
                        <td class="px-4 py-2"
                            >(64 × 256) + (256 × 64) + biases per block</td
                        >
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2">└─ LayerNorm × 2</td>
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">negligible</td>
                        <td class="px-4 py-2">(2 × 64 params per block)</td>
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2 font-semibold">LayerNorm (ln_f)</td
                        >
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 64]</span
                            >
                        </td>
                        <td class="px-4 py-2">128</td>
                        <td class="px-4 py-2">Final layer norm</td>
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2 font-semibold">Linear (lm_head)</td
                        >
                        <td class="px-4 py-2">
                            <span
                                class="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 rounded px-2 py-[2px]"
                                >[B, T, 5000]</span
                            >
                        </td>
                        <td class="px-4 py-2">320,000</td>
                        <td class="px-4 py-2">(64 × 5000) + bias</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        <ul class="list-disc ml-6 indent-0">
            <li><p><strong>Total Parameters:</strong> 846,304</p></li>
            <li><p><strong>Model Size on Disk:</strong> 3.5 MB</p></li>
        </ul>
        <br />
        <p>
            For training, I split the tokenized data into a 90/10
            training/validation split. I monitored training and validation loss
            and manually stopped at 10,000 iterations, which seemed to strike a
            good balance between underfitting and overfitting. There’s
            definitely room for further hyperparameter tuning, but this was a
            solid first pass.
        </p>
        <br />
        <p class="indent-0">By comparison:</p>
        <div
            class="overflow-x-auto border border-neutral-300 dark:border-neutral-700 rounded-md"
        >
            <table class="min-w-full text-left text-sm whitespace-nowrap">
                <thead
                    class="bg-neutral-200 text-neutral-800 dark:bg-neutral-300 dark:text-neutral-700"
                >
                    <tr>
                        <th class="px-4 py-2">Model</th>
                        <th class="px-4 py-2">Parameters</th>
                        <th class="px-4 py-2">Size on Disk</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2">Initial (PyTorch) Model</td>
                        <td class="px-4 py-2">13.9 M</td>
                        <td class="px-4 py-2">188.4 MB</td>
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                    >
                        <td class="px-4 py-2">arhamshahbaz’s Model</td>
                        <td class="px-4 py-2">5.8 M</td>
                        <td class="px-4 py-2">22.16 MB</td>
                    </tr>
                    <tr
                        class="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800 font-semibold"
                    >
                        <td class="px-4 py-2">Smoll-GPT</td>
                        <td class="px-4 py-2">846.3 K</td>
                        <td class="px-4 py-2">3.5 MB</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        <p>
            Smoll-GPT is therefore <strong>~16× smaller</strong> (in parameters)
            than our original attempt, and <strong>~6.9× smaller</strong> than arhamshahbaz’s
            version—yet produces comparable (if not better) output for wine descriptions.
        </p>
        <br />
        <Separator class="my-4" />
        <h1 class="text-3xl font-bold mb-4 indent-0">Usage</h1>
        <p>
            I export the trained model to ONNX so it can run in a Docker
            container. There’s a simple SvelteKit web app that wraps the
            model—fun fact: I rewrote the tokenizer in JavaScript for it so that
            everything runs client-side in the browser.<br /><br />To try it
            out, run:
        </p>
        <div
            class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[4px] indent-0"
        >
            docker run --rm -p 3000:3000 akashcs13/wine-review:latest
        </div>
        <p class="indent-0">
            or just play with it online at <a
                href="https://wine-review.vercel.app/"
                target="_blank"
                class="underline">Smoll-GPT</a
            >.
        </p>
        <br />
        <Separator class="my-4" />
        <h1 class="text-3xl font-bold mb-4 indent-0">Conclusion</h1>
        <p>
            Building Smoll-GPT taught me tons about tokenization, BPE, and how
            much impact a lightweight implementation can have on speed and model
            size. My custom tokenizer went from taking <strong>2+ hours</strong>
            to tokenize the dataset to under <strong>35 seconds</strong>, all by
            switching from naive pair-counting to efficient data structures.
        </p>
        <br />
        <p class="indent-0">
            Moving forward, here are a few ideas I’m excited about:
        </p>
        <ol class="list-decimal ml-6 indent-0">
            <li>
                <p>
                    <strong>Rewrite the Tokenizer in Rust or C++.</strong><br />
                    Hugging Face’s tokenizers are written in Rust for speed—maybe
                    I can learn from their implementation and make mine even faster.
                </p>
            </li>
            <li>
                <p>
                    <strong>Improve Dataset Cleaning.</strong><br /> The raw wine
                    reviews still have some weird characters (e.g., accented letters,
                    stray punctuation). I’d like to strip out or normalize the bad
                    ones. Here’s the full list of characters in the dataset (154
                    unique codepoints):
                </p>
                <div
                    class="font-mono text-sm bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-[2px] indent-0 break-all"
                >
                    (!&quot;#$%&amp;&#39;()*+,-./0123456789:;=?ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]_`abcdefghijklmnopqrstuvwxyz|
                    ¡¨¬­°´º½ÀÃÇÉÕÖÜàáâãäçèéêëìíîïñòóôõöøùúûüýÿăćčğıŠšŽžǎș–—‘’“”•…)
                </div>
            </li>
            <li>
                <p>
                    <strong>Hyperparameter Tuning &amp; Model Scaling.</strong>
                </p>
                <ul class="list-disc ml-6">
                    <li>
                        <p>
                            Try more transformer blocks, larger embeddings, or
                            different learning rate schedules.
                        </p>
                    </li>
                    <li>
                        <p>
                            Consider sparse attention or low-rank factorizations
                            to squeeze out more performance.
                        </p>
                    </li>
                </ul>
            </li>
            <li>
                <p>
                    <strong>Evaluation Metrics.</strong><br /> Right now, I eyeball
                    the generated wine descriptions. It’d be cool to implement automatic
                    metrics (e.g., perplexity on held-out data, BLEU/ROUGE vs. real
                    descriptions) and maybe even some human evaluations (have sommeliers
                    score how “realistic” the descriptions feel).
                </p>
            </li>
            <li>
                <p>
                    <strong>Retrieve-and-Generate (RAG).</strong><br /> Imagine a
                    model that, given a query like “Tell me about an Oregon Pinot
                    Gris,” first retrieves a few real reviews or facts from a database,
                    then crafts a blended description. That could make Smoll-GPT
                    more factual and reduce hallucinations.
                </p>
            </li>
        </ol>
        <br />
        <p>
            Smoll-GPT is just the beginning. By understanding how tokenizers and
            small transformers work under the hood, I feel much better equipped
            to tackle larger NLP projects—and hopefully make models that are
            both <strong>lightweight</strong> and <strong>useful</strong>.
        </p>
        <br />
        <p class="indent-0">
            Thanks for reading! If you have any suggestions or want to fork the
            code, check out the <a
                href="https://github.com/akashcs13/wine-review"
                target="_blank"
                class="underline">repo</a
            > and let me know what you think.
        </p>
    </div>
</div>
