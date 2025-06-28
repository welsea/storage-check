<script lang="ts">
	import { enhance } from "$app/forms";
	import Route from "$lib/components/Route.svelte";

	let { data, form } = $props();
	const locations = data.locations;
	let fileInput: any = $state();
	let preview: string | null = $state(null);

	const S3_URL = "https://cabinweb.s3.fr-par.scw.cloud";

	let editId = $state<string>(locations.length > 0 ? locations[0].id : "");

	const isEdit = $derived(editId !== "add");
	const currentLocation = $derived(isEdit ? locations.find((e) => e.id === editId) : null);

	function handleFileSelect() {
		const file = fileInput.files[0];
		if (!file || !file.type.startsWith("image/")) return;

		preview = URL.createObjectURL(file);
	}

	function handleSubmit() {
		return async ({ update }: { update: any }) => {
			if (preview) URL.revokeObjectURL(preview);
			preview = null;
			await update();
		};
	}
</script>

<Route path="/location" name="location(s) list" />

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.success}
	<p>Successfully updated!</p>
{/if}

<label class="w-fit md:m-[auto] block py-2 border-b md:mb-10 mb-5">
	Locations:
	<div class="flex flex-wrap mb-2 *:mt-2">
		{#if locations.length > 0}
			{#each locations as location}
				<label class="button mr-2 {editId === location.id ? 'bg-black text-white' : ''}">
					{location.name.toUpperCase()}
					<input
						class="hidden"
						type="radio"
						value={location.id}
						aria-label={location.name}
						onclick={() => (editId = location.id)}
					/>
				</label>
			{/each}
		{/if}
		<label class="border-dashed button {editId === 'add' ? 'bg-black text-white' : ''}">
			+ Add a new location
			<input
				class="hidden"
				type="radio"
				value="add"
				aria-label="add a new location"
				onclick={() => (editId = "add")}
			/>
		</label>
	</div>
</label>

<form
	method="POST"
	enctype="multipart/form-data"
	action={isEdit ? "?/edit" : "?/create"}
	use:enhance={handleSubmit}
	class="w-fit md:m-[auto] *:block *:mb-4"
>
	{#if isEdit}
		<input type="hidden" name="id" value={editId} />
	{/if}

	<label>
		Name
		<input
			name="name"
			type="text"
			{...isEdit ? { value: currentLocation?.name.toUpperCase() } : { placeholder: "Enter a name" }}
		/>
	</label>

	<label>
		Cover
		<input
			type="file"
			id="image"
			name="image"
			accept="image/*"
			bind:this={fileInput}
			onchange={handleFileSelect}
			required
		/>
	</label>

	<div class="text-right w-full mt-5">
		<button type="submit" class="bg-black text-white">Save</button>
        <button type="submit" class="bg-red-800 text-white border-0">Delete</button>

	</div>
</form>

<div class="my-4 md:w-80 md:m-[auto]">
	Cover preview
	{#if preview}
		<img src={preview} class="object-cover aspect-square w-full rounded" alt="Preview" />
	{:else if editId !== "add"}
		<img
			src={`${S3_URL}/${locations.filter((e) => e.id === editId)[0].cover}`}
			class=" h-full object-cover aspect-square w-full rounded"
			alt="Preview"
		/>
	{:else}
		<div class="text-center bg-gray-300 text-gray-400 object-cover aspect-square w-full rounded">
			<span class="relative top-[40%]">Preview image</span>
		</div>
	{/if}
</div>
