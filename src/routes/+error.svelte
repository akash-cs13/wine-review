<script lang="ts">
    import { page } from "$app/state";
      import { goto } from '$app/navigation';
    import {Button} from "$lib/components/ui/button";

    const emojis = {
        100: "ℹ️", // Continue
        101: "🔄", // Switching Protocols
        200: "✅", // OK
        201: "🎉", // Created
        202: "⌛", // Accepted
        204: "🚫", // No Content
        301: "➡️", // Moved Permanently
        302: "↪️", // Found
        400: "⚠️", // Bad Request
        401: "🔐", // Unauthorized
        403: "⛔", // Forbidden
        404: "🔍", // Not Found
        408: "⌛", // Request Timeout
        420: "🫠", // (Your existing custom)
        429: "🐢", // Too Many Requests
        500: "💥", // Internal Server Error
        502: "🚧", // Bad Gateway
        503: "🛠️", // Service Unavailable
        504: "⌛", // Gateway Timeout
    };
    function getEmoji(status: number) {
        // @ts-ignore
        return emojis[status] ?? emojis[420];
    }

  function goHome() {
    goto('/');
  }
</script>

<div class="flex items-center justify-center">
    <div class="md:p-6 min-w-32 max-w-[calc(65ch+80px)] w-full mx-4">
        <h1 class="text-3xl font-bold pt-[calc(30vh)] mb-4">
            Error {page.status}
            {getEmoji(page.status)}
        </h1>
        <p class="font-mono mb-4">
            {#if page.status == 404}
                <span class="underline">{page.url.pathname}</span>
            {/if}
            {page.error?.message}
        </p>
        <Button onclick={goHome} variant="secondary"> Go to Home</Button>
    </div>
</div>
