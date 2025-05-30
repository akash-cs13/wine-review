<script lang="ts">
    import WineIcon from "@lucide/svelte/icons/wine";
    export let input: string;
    export let output: string;
</script>

<div class="flex flex-col">
    <div class="flex items-center md:min-w-[80px]">
        <h5 class="font-bold whitespace-nowrap">Wyne</h5>
        <WineIcon class="size-5 fill-black dark:fill-white" />
        <h5 class="font-bold whitespace-nowrap">:</h5>
    </div>
    <pre
    class="whitespace-pre-wrap p-4 rounded font-bold dark:font-normal text-gray-900 dark:text-gray-100">
    <span class="inline text-gray-600 dark:text-gray-200 italic">{input}</span
        >{output}
    </pre>
</div>