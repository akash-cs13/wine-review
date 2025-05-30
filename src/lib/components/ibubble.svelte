<script lang="ts">
    import type { context } from "$lib/types";

    export let data: context;
</script>

<div class="py-4 flex w-full justify-end">
    <div class="max-w-[80%] bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-4">
        <div class="text-gray-700 dark:text-gray-300">
            Describe the flavor profile of a <div class="inline text-gray-600 dark:text-gray-200 font-bold">
                {data.variety}
            </div>
            grown in
            <div class="inline  text-gray-600 dark:text-gray-200 font-bold">
                {data.provience}
            </div>
            ,
            <div class="inline  text-gray-600 dark:text-gray-200 font-bold">
                {data.country}
            </div>
            .
        </div>
    </div>
</div>
