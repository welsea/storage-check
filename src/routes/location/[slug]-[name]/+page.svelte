<!---
TODO:
 -[ ] add 'move to x category' when a item already exist.
 -[ ] add edit category name/ delete category
-->
<script lang="ts">
	import type { Item, EventLogItem, CategoryItem } from "$lib/server/types";
	import CatSpeechRight from "$lib/components/CatSpeechRight.svelte";
	import TdesignSetting1 from "~icons/tdesign/setting-1";
	import AddItem from "$lib/components/AddItem.svelte";
	import { enhance } from "$app/forms";
	import { invalidateAll, refreshAll } from "$app/navigation";

	let { data, form } = $props();

	let category = $state<string>(data.categories[0].id);

	let message = $state<string | null>(null);

	let exists = $derived<Item[]>(data.exists);
	let needs = $derived<Item[]>(data.needs);

	let edit = $state(false);
	let open_popup = $state(false);

	let eventLog = $state<EventLogItem[]>([]);

	const types = ["exist", "need"];
	let categories = data.categories;

	function deleteItem(target: string, item: Item) {
		if (target === "exist") {
			exists = exists.filter((i) => i.name !== item.name);
		} else {
			needs = needs.filter((i) => i.name !== item.name);
		}
		eventLog = [
			...eventLog,
			{
				action: "DELETE",
				target: target,
				item: item,
			},
		];
		message = `${item.name} deleted from ${target} list!`;
	}

	function MoveTo(target: string, item: Item) {
		let need = target === "need" ? "exist" : "need";
		eventLog = [...eventLog, { action: "MOVE", target: need, item }];
		if (target === "exist") {
			// move to need, delete from exist
			exists = exists.filter((i) => i.name !== item.name);
			const needing = needs.find((i) => i.name === item.name);
			if (needing) {
				message = `${item.name} already in need list`;
			} else {
				needs = [...needs, item];
			}
		} else {
			// Add to exists list or update quantity if already exists
			needs = needs.filter((i) => i.name !== item.name);
			const existingItem = exists.find((i) => i.name === item.name);
			if (existingItem) {
				message = `${item.name} already in exist list`;
			} else {
				exists = [...exists, item];
			}
		}

		message = `${item.name} moved out from ${target} list!`;
	}

	function updateQuantity(target: string, item: Item, e: any) {
		if (Number(e.target.value) <= 0) {
			message = "Quantity needs to be bigger than 0";
		} else {
			if (target === "exist") {
				exists = exists.map((i) => {
					if (i.name === item.name) {
						return { ...i, quantity: Number(e.target.value) };
					}
					return i;
				});
			} else {
				message = "";
				needs = needs.map((i) => {
					if (i.name === item.name) {
						return { ...i, quantity: Number(e.target.value) };
					}
					return i;
				});
			}
			eventLog = [
				...eventLog,
				{
					action: "UPDATE",
					target: target,
					item: { ...item, quantity: e.target.value },
				},
			];
		}

		// message = `${item.name} updated from ${target} list!`;
	}

	async function toggleEdit() {
		if (edit) await invalidateAll();
		message = "";
		eventLog = [];
		edit = !edit;
	}

	function preventSubmit(e: KeyboardEvent) {
		if (e.code === "Enter") {
			e.preventDefault();
		}
	}
</script>

<div class="text-left text-gray-500"><a href="/location">{"< Go back to locations"}</a></div>

<div class="flex items-baseline justify-between">
	<h1 class="mt-3 mb-5">{data.location.name.toUpperCase()}</h1>
	<a href={`/category_edit/${data.location.id}-${data.location.name}`} class="underline text-md">Edit categories</a>
</div>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<div class="mx-1">
	<!-- category -->
	<div class="flex flex-wrap w-full mt-3 gap-1 justify-end">
		<select bind:value={category} class="border border-r-2 flex-1">
			{#each data.categories as cate, i}
				<option value={cate.id}>
					{cate.name.toUpperCase()}
				</option>
			{/each}
		</select>
		<button onclick={() => (open_popup = true)}>+ Add item</button>
	</div>

	<!-- lists -->
	<div class="py-2">
		<form method="POST" action="?/edit" use:enhance>
			<div class="text-right">
				<button class="bg-black text-white" type="button" onclick={toggleEdit}>
					{edit ? "Cancel" : "Edit"}
				</button>
				<button
					type="submit"
					class={edit ? "" : "hidden"}
					onclick={() => {
						edit = false;
						message = null;
					}}
				>
					Save
				</button>
			</div>

			{#if message}
				<p class="text-center italic text-blue-600">* {message}</p>
			{/if}
			<!-- hidden-->
			<input type="hidden" name="location_id" value={data.location.id} />
			<input type="hidden" name="user_id" value={data.userid} />
			<input type="hidden" name="events" value={JSON.stringify(eventLog)} />

			<!-- list -->
			<div class="flex justify-around flex-wrap w-full mb-10">
				<div class="md:basis-2/5 w-full mt-3 border px-5 py-1 rounded-t-md">
					<h4 class="text-lg text-center italic font-bold">Exist</h4>
					{#if exists.filter((e) => e.category_id == category).length === 0}
						<li class="text-gray-500 italic">No items</li>
					{:else}
						<table class="w-full">
							<tbody>
								{#each exists.filter((e) => e.category_id == category) as item}
									<tr class="border-b last:border-0">
										<td class="py-2">{item.name}</td>
										<td class="py-2 text-center">
											{#if edit}
												<input
													type="number"
													name="quantity"
													value={Number(item.quantity)}
													class="w-12"
													onchange={(e) => updateQuantity("exist", item, e)}
													onkeydown={(e) => preventSubmit(e)}
												/>
											{:else}
												{Number(item.quantity) || 1}
											{/if}
										</td>
										{#if edit}
											<td class="flex flex-col button-sm py-3 ml-2">
												<button
													type="button"
													class="text-sm mr-1"
													onclick={() => deleteItem("exist", item)}
												>
													Delete
												</button>
												<button
													type="button"
													class="text-white bg-black text-sm"
													onclick={() => MoveTo("exist", item)}
												>
													Need it
												</button>
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>

				<div class="md:basis-2/5 mt-3 w-full border px-5 py-3 rounded-t-md">
					<h4 class="text-lg text-center italic font-bold">Need</h4>
					{#if needs.filter((e) => e.category_id == category).length === 0}
						<li class="text-gray-500 italic">No items</li>
					{:else}
						<table class="w-full">
							<tbody>
								{#each needs.filter((e) => e.category_id == category) as item}
									<tr class="border-b last:border-0">
										<td class="py-2">{item.name}</td>
										<td class="py-2 text-center">
											{#if edit}
												<input
													type="number"
													name="quantity"
													value={Number(item.quantity)}
													class="w-12"
													onchange={(e) => updateQuantity("need", item, e)}
													onkeydown={(e) => preventSubmit(e)}
												/>
											{:else}
												{Number(item.quantity) || 1}
											{/if}
										</td>
										{#if edit}
											<td class="flex flex-col button-sm py-3 ml-2">
												<button
													type="button"
													class="text-sm mr-1"
													onclick={() => deleteItem("need", item)}
												>
													Delete
												</button>
												<button
													type="button"
													class="text-white bg-black text-sm"
													onclick={() => MoveTo("need", item)}
												>
													<!-- <TdesignArrowLeft /> -->
													Have it
												</button>
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</form>
	</div>
</div>

<CatSpeechRight
	message={`Last time updated at
		<b>${data.location.last_updated}</b>`}
/>

<AddItem
	bind:open={open_popup}
	current_category={category}
	categories={data.categories}
	userid={data.userid}
	location_id={data.location.id}
/>

<style lang="postcss">
	@reference "tailwindcss";
	.pop-up {
		width: fit-content;
		position: absolute;
		float: left;
		background-color: var(--bpx-aux-float-bg, #fff);
		border: 1px solid #e5e9ef;
		border: 1px solid var(--bpx-aux-float-border, #e5e9ef);
		border-radius: 4px;
		-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
		position: absolute;
		z-index: 1;
	}
	.speech-bubble-right {
		position: relative;
		background: black;
		color: white;
		width: fit-content;
	}

	.speech-bubble-right:after {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		width: 0;
		height: 0;
		border: 0.5rem solid transparent;
		border-right-color: black;
		border-left: 0;
		margin-top: -0.5rem;
		margin-left: -0.5rem;
	}

	.speech-bubble-left {
		position: relative;
		background: white;
		width: fit-content;
		border: 1px solid black;
	}

	.speech-bubble-left:before {
		content: " ";
		position: absolute;
		width: 0;
		height: 0;
		top: 50%;
		right: 0;
		margin-right: -1rem;
		margin-top: -0.5rem;
		border: 0.4rem solid;
		border: 0.5rem solid transparent;
		border-left-color: black;
	}

	.speech-bubble-left:after {
		content: " ";
		position: absolute;
		width: 0;
		height: 0;
		top: 50%;
		right: 0;
		margin-right: -0.9rem;
		margin-top: -0.5rem;
		border: 0.5rem solid;
		border: 0.5rem solid transparent;
		border-left-color: white;
	}
</style>
