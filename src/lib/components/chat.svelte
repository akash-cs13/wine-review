<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import PlusIcon from "@lucide/svelte/icons/settings";
  import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import SendHorizontalIcon from "@lucide/svelte/icons/send-horizontal";
  import RotateIcon from "@lucide/svelte/icons/rotate-ccw";
  import DicesIcon from "@lucide/svelte/icons/dices";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import * as Popover from "$lib/components/ui/popover";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import { cn } from "$lib/utils.js";
  import Variety from "$lib/components/varieties.json" assert { type: "json" };
  import Country from "$lib/components/countries.json" assert { type: "json" };
  import Provience from "$lib/components/provinces.json" assert { type: "json" };
  import { Slider } from "$lib/components/ui/slider";
  import Ibubble from "./ibubble.svelte";
  import Obubble from "./obubble.svelte";
  import type { generatedMessage, messages } from "$lib/types";

  let bottomMarker: HTMLDivElement;

  $effect(() => {
    output;
    bottomMarker?.scrollIntoView({ behavior: "smooth" });
  });

  const variety = Variety;
  const country = Country;
  const provience = Provience;

  let data: messages = $state([]);

  let openv = $state(false);
  let openp = $state(false);
  let openc = $state(false);

  let triggerRefv = $state<HTMLButtonElement>(null!);
  let triggerRefp = $state<HTMLButtonElement>(null!);
  let triggerRefc = $state<HTMLButtonElement>(null!);

  let valuev = $state("");
  let valuec = $state("");
  let valuep = $state("");

  const selectedVariety = $derived(
    variety.find((f) => f.value === valuev)?.label,
  );

  const selectedProvience = $derived(
    provience.find((f) => f.value === valuep)?.label,
  );

  const selectedCountry = $derived(
    country.find((f) => f.value === valuec)?.label,
  );

  function closeAndFocusTriggerv() {
    openv = false;
    tick().then(() => {
      triggerRefv.focus();
    });
  }
  function closeAndFocusTriggerp() {
    openp = false;
    tick().then(() => {
      triggerRefp.focus();
    });
  }
  function closeAndFocusTriggerc() {
    openc = false;
    tick().then(() => {
      triggerRefc.focus();
    });
  }

  function random() {
    const pick = (
      arr: { value: string; label: string }[],
    ): { value: string; label: string } =>
      arr[Math.floor(Math.random() * arr.length)];

    valuev = pick(variety).value;
    closeAndFocusTriggerv();
    valuec = pick(country).value;
    closeAndFocusTriggerc();
    valuep = pick(provience).value;
    closeAndFocusTriggerp();
  }

  let speed = $state(32);
  let temperature = $state(0.7);
  let toggle = $state(32);
  let toggle2 = $state(0.7);
  let drawer_open = $state(false);
  let output = $state("");
  let isLoading = $state(false);
  let text_input = $state("");
  let looks_good: generatedMessage = $state({
    context: {
      country: "",
      provience: "",
      variety: "",
    },
    input: "",
    isGenerated: false,
    generated: "",
  });

  async function sendRequest() {
    output = "";
    isLoading = true;

    const pick = (
      arr: { value: string; label: string }[],
    ): { value: string; label: string } =>
      arr[Math.floor(Math.random() * arr.length)];

    if (!valuev || valuev.trim() === "") {
      valuev = pick(variety).value;
      closeAndFocusTriggerv();
    }

    if (!valuep || valuep.trim() === "") {
      valuep = pick(provience).value;
      closeAndFocusTriggerp();
    }

    if (!valuec || valuec.trim() === "") {
      valuec = pick(country).value;
      closeAndFocusTriggerc();
    }
    const findLabel = (
      arr: { value: string; label: string }[],
      value: string,
    ): string => {
      const found = arr.find((item) => item.value === value);
      return found?.label || "";
    };

    let temp: generatedMessage = {
      context: {
        country: findLabel(country, valuec.trim()),
        provience: findLabel(provience, valuep.trim()),
        variety: findLabel(variety, valuev.trim()),
      },
      input: "",
      isGenerated: false,
      generated: "",
    };

    let input =
      "wine review : " +
      temp.context.country +
      " : " +
      temp.context.provience +
      " : " +
      temp.context.variety +
      " :";
    if (text_input || text_input.trim() != "") {
      temp.input = text_input.trim();
      input = input + " " + temp.input;
      text_input = "";
      autoResize();
    }

    looks_good = temp;

    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, speed, temperature }),
    });

    if (!res.ok || !res.body) {
      output = `Error: ${res.status} ${res.statusText}`;
      isLoading = false;
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        output += decoder.decode(value, { stream: true });
      }
    }

    temp.generated = output;
    temp.isGenerated = true;
    isLoading = false;
    data.push(temp);
  }

  let textareaEl: HTMLTextAreaElement;
  function autoResize() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    requestAnimationFrame(() => {
      textareaEl.style.height = textareaEl.scrollHeight + "px";
    });
  }

  function handleKeydown(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendRequest();
    }
    autoResize();
  }
</script>

<ScrollArea  class="h-[vh]">
  {#if data != null}
    {#each data as d}
      {#if d.isGenerated == true}
        <Ibubble data={d.context} />
        <Obubble input={d.input || ""} output={d.generated} />
      {/if}
    {/each}
  {/if}
  {#if isLoading}
    <Ibubble data={looks_good.context} />
    <Obubble input={looks_good.input || ""} {output} />
  {/if}
  <div bind:this={bottomMarker} class="min-h-[250px]"></div>
</ScrollArea>

<div class="fixed bottom-5 md:!w-[calc(65ch+80px)] mr-4">
  <div class="py-4 flex w-full justify-end z-5">
    <div class="max-w-[80%] bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-4">
      <div class="text-gray-700 dark:text-gray-300">
        Describe the flavor profile of a <div class="inline">
          <Popover.Root bind:open={openv}>
            <Popover.Trigger bind:ref={triggerRefv}>
              {#snippet child({ props })}
                <Button
                  variant="outline"
                  class="justify-between py-1 px-2 gap-1 max-h-fit text-gray-800 dark:text-gray-300"
                  {...props}
                  role="combobox"
                >
                  {selectedVariety || "wine variety"}
                  <ChevronsUpDownIcon class=" size-4 shrink-0 opacity-50" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-[200px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search varities..." />
                <Command.List>
                  <Command.Empty>No variety found.</Command.Empty>
                  <Command.Group>
                    {#each variety as v}
                      <Command.Item
                        value={v.value}
                        onSelect={() => {
                          valuev = v.value;
                          closeAndFocusTriggerv();
                        }}
                      >
                        <CheckIcon
                          class={cn(
                            "mr-2 size-4",
                            valuev !== v.value && "text-transparent",
                          )}
                        />
                        {v.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        </div>
        grown in
        <div class="inline">
          <Popover.Root bind:open={openp}>
            <Popover.Trigger bind:ref={triggerRefp}>
              {#snippet child({ props })}
                <Button
                  variant="outline"
                  class="justify-between py-1 px-2 gap-1 max-h-fit text-gray-800 dark:text-gray-300"
                  {...props}
                  role="combobox"
                >
                  {selectedProvience || "provience"}
                  <ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-[200px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search proviences..." />
                <Command.List>
                  <Command.Empty>No provience found.</Command.Empty>
                  <Command.Group>
                    {#each provience as p}
                      <Command.Item
                        value={p.value}
                        onSelect={() => {
                          valuep = p.value;
                          closeAndFocusTriggerp();
                        }}
                      >
                        <CheckIcon
                          class={cn(
                            "mr-2 size-4",
                            valuep !== p.value && "text-transparent",
                          )}
                        />
                        {p.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        </div>
        ,
        <div class="inline">
          <Popover.Root bind:open={openc}>
            <Popover.Trigger bind:ref={triggerRefc}>
              {#snippet child({ props })}
                <Button
                  variant="outline"
                  class="justify-between py-1 px-2 gap-1 max-h-fit text-gray-800 dark:text-gray-300"
                  {...props}
                  role="combobox"
                >
                  {selectedCountry || "country"}
                  <ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-[200px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search countries..." />
                <Command.List>
                  <Command.Empty>No country found.</Command.Empty>
                  <Command.Group>
                    {#each country as c}
                      <Command.Item
                        value={c.value}
                        onSelect={() => {
                          valuec = c.value;
                          closeAndFocusTriggerc();
                        }}
                      >
                        <CheckIcon
                          class={cn(
                            "mr-2 size-4",
                            valuec !== c.value && "text-transparent",
                          )}
                        />
                        {c.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        </div>
        .
      </div>
    </div>
  </div>

  <div
    class="rounded-3xl bg-neutral-100 dark:bg-neutral-800 border-input border flex flex-col py-4 px-4 gap-2 shadow-xl z-5"
  >
    <textarea
      bind:value={text_input}
      bind:this={textareaEl}
      rows="1"
      oninput={autoResize}
      onkeydown={handleKeydown}
      placeholder="What should I complete"
      class="min-h-0 w-full resize-none text-gray-700 dark:text-gray-300 overflow-hidden bg-transparent text-base py-1 rounded-md outline-none focus-visible:ring-0 focus-visible:border-transparent"
    ></textarea>
    <div class="flex gap-2 justify-between">
      <Dialog.Root bind:open={drawer_open}>
        <Dialog.Trigger
          class=" !rounded-full {buttonVariants({
            variant: 'outline',
            size: 'icon',
          })}"
          ><PlusIcon
            class="stroke-gray-700 dark:stroke-gray-400"
          /></Dialog.Trigger
        >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description
              class="flex flex-col gap-6 text-gray-700 dark:text-gray-300 text-base"
            >
              <div class="flex flex-col mt-6 gap-2">
                <div class="flex justify-between">
                  <h5 class="">Typing Speed</h5>
                  <h5>{toggle}</h5>
                </div>
                <Slider
                  type="single"
                  bind:value={toggle}
                  min={1}
                  max={100}
                  step={1}
                  class=""
                />
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                  <h5>Temperature</h5>
                  <h5>{toggle2}</h5>
                </div>
                <Slider
                  type="single"
                  bind:value={toggle2}
                  max={3}
                  step={0.01}
                  class=""
                />
              </div>
              <Separator class="my-2" />
              <div class="flex justify-end gap-4 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onclick={() => {
                    toggle = 32;
                    toggle2 = 0.7;
                  }}><RotateIcon /></Button
                >
                <Button
                  type="submit"
                  onclick={() => {
                    speed = toggle;
                    temperature = toggle2;
                    drawer_open = false;
                  }}>Save</Button
                >
              </div>
            </Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
      <div class="flex gap-2">
        <Button
          onclick={random}
          variant="ghost"
          size="icon"
          class="rounded-full"
          ><DicesIcon class="stroke-gray-700 dark:stroke-gray-400" /></Button
        >
        <Button
          onclick={sendRequest}
          disabled={isLoading}
          class="rounded-full px-3"
        >
          {#if isLoading}
            <LoaderCircleIcon class="animate-spin" />
          {:else}
            <SendHorizontalIcon />
          {/if}
        </Button>
      </div>
    </div>
  </div>
</div>

