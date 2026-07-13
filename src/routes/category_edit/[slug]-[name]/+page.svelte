<script lang="ts">
	import TdesignSetting1 from "~icons/tdesign/setting-1";
	import type { CategoryItem } from "$lib/server/types";
	import type { EventLogCategory } from "$lib/server/types";
	import { enhance } from "$app/forms";
	let { data, form } = $props();

	let categories = $derived<CategoryItem[]>(data.categories);

	let newCategory = $state("");
	let message = $state("");

	let eventLog = $state<EventLogCategory[]>([]);

	function handleUpdateName(c: any, e: any) {
		if (e.target.value.length > 0) {
			eventLog = [
				...eventLog,
				{
					action: "UPDATE",
					target: data.location.id,
					item: {
						id: c.id,
						location_id: Number(data.location.id),
						name: e.target.value.toUpperCase(),
					},
				},
			];
		}
	}
	function preventSubmit(e: KeyboardEvent) {
		if (e.code === "Enter") {
			e.preventDefault();
		}
	}

	function handleAdd() {
		eventLog = [
			...eventLog,
			{
				action: "ADD",
				target: data.location.id,
				item: {
					id: 999008899,
					location_id: Number(data.location.id),
					name: newCategory.toUpperCase(),
				},
			},
		];
		categories = [
			{
				id: 999,
				location_id: Number(data.location.id),
				name: newCategory.toUpperCase(),
			},
			...categories,
		];
		newCategory = "";
	}

	function deleteItem(c: any) {
		eventLog = [
			...eventLog,
			{
				action: "DELETE",
				target: data.location.id,
				item: c,
			},
		];
		categories = categories.filter((i) => i.id !== c.id);
	}
</script>

<div class="text-left text-gray-500">
	<a href={`/location/${data.location.id}-${data.location.name}`}>{`< Go back to ${data.location.name}`}</a>
</div>
<h1 class="mt-3 mb-5">
	{data.location.name.toUpperCase()}
	<span class="text">'s categories</span>
</h1>

<div>
	<div class="text-center text-blue-500">{message}</div>
	<form method="POST" action="?/edit_category" use:enhance>
		<input type="hidden" name="location_id" value={data.location.id} />
		<input type="hidden" name="events" value={JSON.stringify(eventLog)} />

		<div class="border-b text-right">
			<button
				type="submit"
				class="bg-black text-white w-20 mb-2"
				onclick={() => {
					message = "Saved!";
				}}
			>
				Save
			</button>
		</div>
		<table class="w-full">
			<tbody>
				<tr class="border-dotted border-b *:py-2">
					<td>
						<input
							bind:value={newCategory}
							defaultValue="Add category..."
							onkeydown={(e) => preventSubmit(e)}
						/>
					</td>
					<td class="">
						<button type="button" class="text-sm mr-1 border-dotted" onclick={() => handleAdd()}>
							+ Add
						</button>
					</td>
				</tr>
				{#each categories as c, i}
					<tr class="border-b *:py-2">
						<td>
							<input
								value={c.name.toUpperCase()}
								onchange={(e) => handleUpdateName(c, e)}
								onkeydown={(e) => preventSubmit(e)}
							/>
						</td>
						<td class="">
							<button type="button" class="text-sm mr-1" onclick={() => deleteItem(c)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</form>
</div>
