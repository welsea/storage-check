<script lang="ts">
	import type { Item, EventLogItem } from '$lib/server/types';
	import CatSpeechLeft from '$lib/components/CatSpeechLeft.svelte';
	import CatSpeechRight from '$lib/components/CatSpeechRight.svelte';

	let { data, form } = $props();
	console.log(data)

	let category = $state<string>(data.categories[0].id);
	let add_category = $state(false);

	let message = $state<string | null>(null);

	let add_item = $state<string>();

	let exists = $state<Item[]>(data.exists);
	let needs = $state<Item[]>(data.needs);
	let edit = $state(false);

	let eventLog = $state<EventLogItem[]>([]);

	const types = ['exist', 'need'];

	function addItem(e: any) {
		const selectType = e.target.value;
		if (add_item) {
			let newItem: Item = {
				id: (exists.length + 1).toString(),
				item_id: '9999',
				item_name: add_item,
				last_updated: new Date().toLocaleString(),
				location_id: data.location.id,
				quantity: 1,
				category_id: category
			};
			if (selectType === 'exist') {
				const nameExist = exists.find((i) => i.item_name === add_item);
				if (nameExist) {
					message = `${newItem.item_name} already in the exist list!`;
				} else {
					exists = [...exists, newItem];
					message = `${newItem.item_name} added in exist list!`;
					eventLog = [
						...eventLog,
						{
							action: 'ADD',
							target: selectType,
							item: newItem
						}
					];
				}
			} else {
				const nameNeed = needs.find((i) => i.item_name === add_item);
				newItem.id = (needs.length + 1).toString();
				if (nameNeed) {
					message = `${newItem.item_name} already in the need list!`;
				} else {
					needs = [...needs, newItem];
					message = `${newItem.item_name} added in need list!`;
					eventLog = [
						...eventLog,
						{
							action: 'ADD',
							target: selectType,
							item: newItem
						}
					];
				}
			}
		} else {
			message = `Name cannot be empty`;
		}
		add_item = '';
	}

	function deleteItem(target: string, item: Item) {
		if (target === 'exist') {
			exists = exists.filter((i) => i.item_name !== item.item_name);
		} else {
			needs = needs.filter((i) => i.item_name !== item.item_name);
		}
		eventLog = [
			...eventLog,
			{
				action: 'DELETE',
				target: target,
				item: item
			}
		];
		message = `${item.item_name} deleted from ${target} list!`;
	}

	function MoveTo(target: string, item: Item) {
		if (target === 'exist') {
			// move to need, delete from exist
			deleteItem(target, item);
			const needing = needs.find((i) => i.item_name === item.item_name);
			if (needing) {
				message = `${item.item_name} already in need list`;
			} else {
				needs = [...needs, item];
				eventLog = [
					...eventLog,
					{
						action: 'ADD',
						target: 'need',
						item: item
					}
				];
			}
		} else {
			deleteItem('need', item);
			// Add to exists list or update quantity if already exists
			const existingItem = exists.find((i) => i.item_name === item.item_name);
			if (existingItem) {
				message = `${item.item_name} already in exist list`;
			} else {
				exists = [...exists, item];
				eventLog = [
					...eventLog,
					{
						action: 'ADD',
						target: 'exist',
						item: item
					}
				];
			}
		}

		message = `${item.item_name} moved out from ${target} list!`;
	}

	function updateQuantity(target: string, item: Item, e: any) {
		if (Number(e.target.value) <= 0) {
			message = 'Quantity needs to be bigger than 0';
		} else {
			if (target === 'exist') {
				exists = exists.map((i) => {
					if (i.item_name === item.item_name) {
						return { ...i, quantity: Number(e.target.value) };
					}
					return i;
				});
			} else {
				message = '';
				needs = needs.map((i) => {
					if (i.item_name === item.item_name) {
						return { ...i, quantity: Number(e.target.value) };
					}
					return i;
				});
			}
			eventLog = [
				...eventLog,
				{
					action: 'UPDATE',
					target: target,
					item: { ...item, quantity: e.target.value }
				}
			];
		}

		// message = `${item.item_name} updated from ${target} list!`;
	}

	function toggleEdit() {
		edit = !edit;
	}

	function preventSubmit(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			e.preventDefault();
		}
	}
</script>

<div class="text-left"><a href="/location">{'< Go back to list'}</a></div>


<CatSpeechLeft message={`You're at ${data.location.name.toUpperCase()}`} />

<p class="my-1 mx-5">* If you want to add category, do it before edit the lists : )</p>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<div class="mx-5">
	<!-- category -->
	{#if add_category}
		<div class="border border-dashed rounded-md px-3 py-2 mb-2">
			<form method="POST" action="?/add_category" class="flex flex-col items-start md:flex-row md:items-center">
				<label
					>Category name: <input
						name="name"
						autocomplete="off"
						onkeydown={(e) => preventSubmit(e)}
					/></label
				>
				<button class="bg-black text-white my-1 md:mx-1" type="submit" onsubmit={() => (add_category = false)}
					>Save</button
				>
				<button onclick={() => (add_category = false)}>Cancel</button>
			</form>
		</div>
	{/if}
	<div class="border-b border-black pb-1 mb-2 flex justify-start flex-wrap">
		{#each data.categories as cate, i}
			<button
				class="{category === cate.id
					? 'bg-black text-white'
					: ''} mr-1 mt-1"
				onclick={() => (category = cate.id)}>{cate.name.toUpperCase()}</button
			>
		{/each}
		<button
			class="border-green-900 text-green-900 mt-1"
			onclick={() => (add_category = !add_category)}>+ Add category</button
		>
	</div>

	<!-- lists -->
	<form method="POST" action="?/edit">
		<div class="text-right">
			<button class="bg-black text-white" type="button" onclick={toggleEdit}
				>{edit ? 'Cancel' : 'Edit'}</button
			>
			<button
				type="submit"
				onclick={() => {
					edit = false;
					message = null;
				}}>Save</button
			>
		</div>

		{#if edit}
			<div
				class="py-4 mb-2 flex flex-wrap justify-center items-baseline border-b border-gray-300 md:border-none"
			>
				<label>
					Add a item: <input onkeydown={(e) => preventSubmit(e)} bind:value={add_item} />
				</label>
				{#each types as item}
					<label
						class={`ml-2 mt-2 px-2 py-1 rounded-sm ${'exist' === item ? 'bg-black text-white' : 'border border-black'}`}
					>
						<input
							class="hidden"
							type="radio"
							value={item}
							aria-label={item === 'exist' ? 'Have it!' : 'Need it!'}
							onclick={(e) => addItem(e)}
						/>
						{item === 'exist' ? 'Have it!' : 'Need it!'}
					</label>
				{/each}
			</div>
		{/if}

		{#if message}
			<p class="text-center italic text-blue-600">* {message}</p>
		{/if}
		<!-- hidden-->
		<input type="hidden" name="location_id" value={data.location.id} />
		<input type="hidden" name="user_id" value={data.userid} />
		<input type="hidden" name="events" value={JSON.stringify(eventLog)} />

		<!-- list -->
		<div class="flex justify-around flex-wrap w-full mb-10">
			<div class="md:basis-2/5 w-full mt-3 border px-5 py-3 rounded-t-md">
				<h4 class="text-lg text-center italic">Exist</h4>
				{#if exists.filter((e) => e.category_id == category).length === 0}
					<li class="text-gray-500 italic">No items</li>
				{:else}
					<table class="w-full">
						<thead>
							<tr class="text-left border-b">
								<th class="pb-2">Name</th>
								<th class="pb-2 text-center">Qty</th>
								{#if edit}
									<th class="pb-2 text-right">Actions</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each exists.filter((e) => e.category_id == category) as item}
								<tr class="border-b last:border-0">
									<td class="py-2">{item.item_name}</td>
									<td class="py-2 text-center">
										{#if edit}
											<input
												type="number"
												name="quantity"
												value={Number(item.quantity)}
												class="w-12"
												onchange={(e) => updateQuantity('exist', item, e)}
												onkeydown={(e) => preventSubmit(e)}
											/>
										{:else}
											{Number(item.quantity) || 1}
										{/if}
									</td>
									{#if edit}
										<td class="py-2 text-right">
											<button
												type="button"
												class="text-sm mr-1"
												onclick={() => deleteItem('exist', item)}
											>
												Delete
											</button>
											<button
												type="button"
												class="text-white bg-black text-sm"
												onclick={() => MoveTo('exist', item)}
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
				<h4 class="text-lg text-center italic">Need</h4>
				{#if needs.filter((e) => e.category_id == category).length === 0}
					<li class="text-gray-500 italic">No items</li>
				{:else}
					<table class="w-full">
						<thead>
							<tr class="text-left border-b">
								<th class="pb-2">Name</th>
								<th class="pb-2 text-center">Qty</th>
								{#if edit}
									<th class="pb-2 text-right">Actions</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each needs.filter((e) => e.category_id == category) as item}
								<tr class="border-b last:border-0">
									<td class="py-2">{item.item_name}</td>
									<td class="py-2 text-center">
										{#if edit}
											<input
												type="number"
												name="quantity"
												value={Number(item.quantity)}
												class="w-12"
												onchange={(e) => updateQuantity('need', item, e)}
												onkeydown={(e) => preventSubmit(e)}
											/>
										{:else}
											{Number(item.quantity) || 1}
										{/if}
									</td>
									{#if edit}
										<td class="py-2 text-right">
											<button
												type="button"
												class="text-sm mr-1"
												onclick={() => deleteItem('need', item)}
											>
												Delete
											</button>
											<button
												type="button"
												class="text-white bg-black text-sm"
												onclick={() => MoveTo('need', item)}
											>
												<!-- <TdesignArrowLeft /> -->
												Got it
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

<CatSpeechRight
	message={`Last time updated by <b>${data.location.last_updated_by}</b> at
		<b>${data.location.last_updated}</b>`}
/>

<style lang="postcss">
	@reference "tailwindcss";
	.speech-bubble-right {
		position: relative;
		background: black;
		color: white;
		width: fit-content;
	}

	.speech-bubble-right:after {
		content: '';
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
		content: ' ';
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
		content: ' ';
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
