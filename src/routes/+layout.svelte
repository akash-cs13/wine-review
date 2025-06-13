<script lang="ts">
	import "../app.css";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import { ModeWatcher, resetMode, setMode, toggleMode } from "mode-watcher";
	import { Separator } from "$lib/components/ui/separator";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { goto } from "$app/navigation";
	let { children } = $props();

	let open = $state(false);
	const year = new Date().getFullYear();
</script>

<ModeWatcher />
<header
	class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
	<div class="container flex h-14 max-w-screen-2xl items-center">
		<div class="mr-4 flex">
			<a href="/" class="mr-6 flex items-center space-x-2"
				><svg
					width="250"
					height="250"
					viewBox="0 0 250 250"
					fill="none"
					class="size-6 stroke-black dark:stroke-white"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M41.2412 184.334C54.3021 208.204 64.3909 210.961 89.8303 193.544L126.5 127.038C122.672 119.715 119.053 112.865 115.582 106.659M41.2412 184.334C36.2135 175.146 30.7454 162.829 23.7917 147.33L61.5876 90.8887C81.99 58.0327 96.579 72.6835 115.582 106.659M41.2412 184.334C70.2732 154 77.8724 108.54 115.582 106.659"
						stroke-width="13"
					/>
					<path
						d="M126.719 33.0781C99.5226 33.906 92.4934 41.6504 96.4932 72.2202L139.165 135.043C147.428 134.949 155.175 134.827 162.28 134.545M126.719 33.0781C137.189 32.7595 150.646 33.4657 167.614 34.2893L200.803 93.5564C220.849 126.631 201.178 132.998 162.28 134.545M126.719 33.0781C140.607 72.7034 177.689 100.076 162.28 134.545"
						stroke-width="13"
					/>
					<path
						d="M219.34 181.534C233.723 158.437 231.173 148.294 203.51 134.682L127.569 135.384C123.068 142.314 118.876 148.829 115.173 154.9M219.34 181.534C213.803 190.425 205.757 201.236 195.668 214.902L127.941 209.682C89.3009 208.037 94.9028 188.135 115.173 154.9M219.34 181.534C178.66 171.133 135.325 186.83 115.173 154.9"
						stroke-width="13"
					/>
				</svg>
				<span class="font-bold xl:inline-block">Smoll-GPT</span></a
			>
			<nav class="items-center gap-6 text-sm hidden md:flex">
				<a
					href="/blog"
					class="hover:text-foreground/80 transition-colors text-foreground/60"
					>Blog</a
				>
				<a
					href="/playground"
					class="hover:text-foreground/80 transition-colors text-foreground/60"
					>Playground</a
				>
			</nav>
		</div>

		<div
			class="flex flex-1 items-center justify-between space-x-2 md:justify-end"
		>
			<div class="w-full flex-1 md:w-auto md:flex-none"></div>
			<nav class="flex items-center">
				<a
					href="https://github.com/akash-cs13/Smoll-GPT"
					target="_blank"
					rel="noopener noreferrer"
					class=""
					><div
						class="focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md text-xs h-8 w-8 px-0"
					>
						<svg viewBox="0 0 438.549 438.549" class="size-4"
							><path
								fill="currentColor"
								d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
							></path></svg
						><!----> <span class="sr-only">GitHub</span>
					</div></a
				>
				<Button
					onclick={toggleMode}
					variant="outline"
					size="icon"
					class="ml-2 hidden md:flex"
				>
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<Drawer.Root bind:open>
					<Drawer.Trigger
						class="{buttonVariants({
							variant: 'ghost',
							size: 'icon',
						})} md:hidden ml-2"
					>
						<MenuIcon />
					</Drawer.Trigger>

					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title></Drawer.Title>
							<Drawer.Description>
								<div
									class="w-full min-h-[var(--my-height)] flex flex-col gap-4 justify-between"
									style="--my-height: min(40vh, 400px);"
								>
									<div class="flex flex-col gap-2">
										<a
											href="/"
											class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground border px-4 py-2 w-full"
											onclick={() => {
												open = false;
											}}
											>Home
										</a>
																				<a
											href="/blog"
											class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground border px-4 py-2 w-full"
											onclick={() => {
												open = false;
											}}
											>Blog
										</a>										<a
											href="/playground"
											class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground border px-4 py-2 w-full"
											onclick={() => {
												open = false;
											}}
											>Playground
										</a>
									</div>
									<div>
										<Separator class="my-4" />
										<div
											class="flex justify-between px-2 items-center"
										>
											<Button
												onclick={toggleMode}
												variant="outline"
												size="icon"
												class=""
											>
												<SunIcon
													class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
												/>
												<MoonIcon
													class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
												/>
												<span class="sr-only"
													>Toggle theme</span
												>
											</Button>
											<p>© {year}</p>
											<!-- svelte-ignore a11y_consider_explicit_label -->
											<a
												href="https://github.com/akash-cs13/Smoll-GPT"
												target="_blank"
												rel="noopener noreferrer"
												class=""
												><div
													class="focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md text-xs h-12 px-4 fill-black dark:fill-white"
												>
													<svg
														viewBox="0 0 438.549 438.549"
														class="size-4"
														><path
															d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
														></path></svg
													>
												</div></a
											>
										</div>
									</div>
								</div></Drawer.Description
							>
						</Drawer.Header>
						<Drawer.Footer>
							<Drawer.Close></Drawer.Close>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			</nav>
		</div>
	</div>
</header>
{@render children()}
