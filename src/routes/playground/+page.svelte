<svelte:head>
    <title>Playground</title> 
</svelte:head>

<script lang="ts">
    import { MyTokenizer } from "./Tokenizer";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Label } from "$lib/components/ui/label";
    import { tick } from "svelte";

    let input = $state("");
    let encoded: { id: number; char: string }[] = $state([]);

    let SPECIAL_TOKENS = ["[EOD]"];
    let PRETOKENIZE_PATTERN =
        "(?:'s|'t|'re|'ve|'m|'ll|'d)|\\s?\\p{L}+|\\s?\\p{N}+|\\s?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+";

    let tokenizer = new MyTokenizer(PRETOKENIZE_PATTERN, SPECIAL_TOKENS);

    const palette = [
        "bg-red-200 dark:bg-red-800",
        "bg-green-200 dark:bg-green-800",
        "bg-blue-200 dark:bg-blue-800",
        "bg-yellow-200 dark:bg-yellow-800",
        "bg-purple-200 dark:bg-purple-800",
        "bg-pink-200 dark:bg-pink-800",
        "bg-indigo-200 dark:bg-indigo-800",
    ];

    let hoveredIndex: number = $state(-1);
    let whitespace = $state(false);

    function displayChar(char: string): string {
        if (!whitespace) return char;

        return char
            .replace(/ /g, "⋅")
            .replace(/\n/g, "\\n\n")
            .replace(/\t/g, "\\t\t");
    }
    function handleTab(event: { key: string; preventDefault: () => void; target: any; }) {
		if (event.key === 'Tab') {
			event.preventDefault();
			const textarea = event.target;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			input =
				input.substring(0, start) + '\t' + input.substring(end);
			tick().then(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 1;
			});
		}
    }

    $effect(() => {
        input;
        encoded = tokenizer.encode(input);
    });
</script>

<div class="flex">
    <div
        class="md:p-6 min-w-32 max-w-[calc(2 * calc(65ch+80px))] w-full h-full mx-4"
    >
        <h1 class="text-3xl font-bold mb-4">PlayGround</h1>
        <div class="flex flex-col md:flex-row gap-4 h-full">
            <!-- svelte-ignore event_directive_deprecated -->
            <textarea
                name=""
                id=""
                class="w-full bg-transparent border rounded-md shadow-sm p-4 h-[40vh] overflow-y-auto whitespace-pre-wrap break-words"
                bind:value={input}
                on:keydown={handleTab}
            >
            </textarea>
            <div class="flex w-full h-full gap-4 flex-col mb-12">
                <div
                    class="w-full p-6 bg-neutral-100 dark:bg-neutral-900 border rounded-md shadow-sm"
                >
                    <p class="text-sm">Token count</p>
                    <p class="text-lg">
                        {encoded.length}
                    </p>
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore event_directive_deprecated -->
                <pre
                    class="w-full font-mono p-6 bg-neutral-100 dark:bg-neutral-900 border rounded-md shadow-sm h-[40vh] overflow-y-auto whitespace-pre-wrap break-words break-all">{#each encoded as token, i}<span
                            on:mouseenter={() => (hoveredIndex = i)}
                            on:mouseleave={() => (hoveredIndex = -1)}
                            class={`inline ${
                                hoveredIndex === -1 || hoveredIndex === i
                                    ? palette[i % palette.length]
                                    : ""
                            }`}>{displayChar(token.char)}</span
                        >{/each}</pre>
                <div
                    class="w-full font-mono p-6 bg-neutral-100 dark:bg-neutral-900 border rounded-md shadow-sm h-[40vh] overflow-y-auto whitespace-pre-wrap break-words"
                >
                    <div class="flex flex-wrap gap-x-1">
                        {#each encoded as token, i}
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- svelte-ignore event_directive_deprecated -->
                            <span
                                on:mouseenter={() => (hoveredIndex = i)}
                                on:mouseleave={() => (hoveredIndex = -1)}
                                class={`inline ${hoveredIndex === i ? palette[i % palette.length] : ""}`}
                            >
                                {token.id}
                            </span>{#if i < encoded.length - 1},
                            {/if}
                        {/each}
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        bind:checked={whitespace}
                        aria-labelledby="terms-label"
                    />
                    <Label
                        id="terms-label"
                        for="terms"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Show whitespace
                    </Label>
                </div>
            </div>
        </div>
    </div>
</div>
