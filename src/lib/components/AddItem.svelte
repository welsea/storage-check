<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade, fly } from "svelte/transition";
	import type { CategoryItem } from "$lib/server/types";

	export let form;
	export let open = false;
	export let categories = [] as CategoryItem[];
	export let user_id = 0;
	export let location_id = 0;
	export let current_category = 0;

	let name = "";
	let category_id = current_category;
	$: category_id = current_category;
	let have = 0;
	let need = 0;

	function close() {
		have = 0;
		need = 0;
		name = "";
		open = false;
	}

	async function handleCancel(e: any) {
		if (e.target === e.currentTarget) close();
	}
</script>

{#if open}
	<div class="backdrop" transition:fade={{ duration: 150 }}>
		<form method="POST" action="?/add_item" use:enhance>
			<div class="sheet" transition:fly={{ y: 300, duration: 200 }}>
				<!-- hidden-->
				<input type="hidden" name="location_id" value={location_id} />
				<input type="hidden" name="user_id" value={user_id} />
				<h2>Add item</h2>
				<label>
					Name
					<input id="name" name="name" type="text" placeholder="hmmm..." bind:value={name} />
				</label>
				<label>
					Category
					<select bind:value={category_id} name="category">
						{#each categories as c}
							<option value={c.id}>{c.name.toUpperCase()}</option>
						{/each}
					</select>
				</label>
				<div class="row">
					<label>
						Have
						<input name="have" type="number" class="w-6/12" min="0" bind:value={have} />
					</label>
					<label>
						Need
						<input name="need" type="number" class="w-6/12" min="0" bind:value={need} />
					</label>
				</div>

				<div class="flex *:flex-1 gap-1">
					<button class="primary" type="submit" onclick={handleCancel}>Add item</button>
					<button class="" onclick={handleCancel}>Cancel</button>
				</div>
			</div>
		</form>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 50;
	}

	.sheet {
		width: 100%;
		max-width: 480px;
		background: white;
		border-radius: 16px 16px 0 0;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	h2 {
		font-size: 16px;
		font-weight: 500;
		margin: 0;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 14px;
		color: #555;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	button.primary {
		background: black;
		color: white;
		border: none;
	}

	button {
		padding: 10px;
		border-radius: 8px;
		font-size: 15px;
		margin-top: 4px;
	}
</style>
