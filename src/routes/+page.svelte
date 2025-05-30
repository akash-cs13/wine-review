<script lang="ts">
  import Chat from "../lib/components/chat.svelte";
</script>

<div class="flex items-center justify-center">
  <div class="md:p-6 min-w-32 max-w-[calc(65ch+80px)] w-full mx-4">
    <h1 class="text-3xl font-bold pt-[calc(30vh)] mb-4">I'm Wyne</h1>
    <p class="font-mono">
      The finest wine connoisseur in all the lands. Give me a wine's <span
        class="underline">variety</span
      >, along with its <span class="underline">province</span> and
      <span class="underline">country</span>, and I'll describe its taste.
    </p>

    <Chat />
  </div>
</div>
