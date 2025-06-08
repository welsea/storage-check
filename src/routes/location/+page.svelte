<script lang="ts">
	import TdesignHomeFilled from '~icons/tdesign/home-filled';
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let add = $state(false);

	let edit = $state(false);
	let editId = $state<string>(data.locations.length > 0 ? data.locations[0].id:'');

	let preview: string | null = $state(null);
	let fileInput: any = $state();

	const S3_URL = "https://cabinweb.s3.fr-par.scw.cloud";

	function handleFileSelect() {
		const file = fileInput.files[0];
		if (!file || !file.type.startsWith('image/')) return;

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

<!-- <h1 class="border-b border-gray-200">Locations</h1> -->

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<ul class="mt-2 flex flex-wrap justify-center">
	{#each data.locations as item}
		<li class="text-center w-full md:basis-2/5 px-3 py-2 rounded-md inline-block mr-2">
			<a href="/location/{item.id}-{item.name}">
				<span class="text-2xl md:text-3xl font-thin">{item.name.toUpperCase()}</span>
				{#if item.cover}
					<img class=" object-cover" src={`${S3_URL}/${item.cover}`} alt="cover" loading="lazy" />
				{:else}
					<TdesignHomeFilled width="100%" height="100%" color="grey" />
				{/if}
			</a>
		</li>
	{/each}
	<li class="text-center w-full md:basis-2/5 px-3 py-2 border border-dashed border-gray-400 rounded-md inline-block mr-2">
		<button
			onclick={() => {
				add = !add;
				edit = false;
			}}
			class="border-0">Add location</button
		>
	</li>
</ul>

<div class="md:mt-40 mt-20 text-right">
	<button
		onclick={() => {
			edit = !edit;
			add = false;
		}}>Edit location</button
	>

	{#if edit || add}
		<div
			class="border border-dashed w-full py-5 px-5 text-left mt-4 rounded-md flex justify-around flex-wrap"
		>
			<div class="w-50 h-50 border-dotted border">
				{#if preview}
					<img src={preview} class=" h-full" alt="Preview" />
				{:else}
					<div class="text-center text-gray-400">Preview image</div>
				{/if}
			</div>

			{#if edit && data.locations.length > 0}
				<form
					method="POST"
					enctype="multipart/form-data"
					action="?/edit"
					use:enhance={handleSubmit}
					class="w-fit"
				>
					<input type="hidden" name="id" value={editId} />
					<label class="inline-block py-2"
						>Select location:
						{#each data.locations as location}
							<label
								class="border border-black rounded-sm mr-2 px-1 inline-block w-fit {editId ===
								location.id
									? 'bg-black text-white'
									: ''}"
							>
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
					</label>
					<label class="block mb-5"
						>Enter a new name: <input
							name="name"
							type="text"
							defaultValue={data.locations.filter((e) => e.id === editId)[0].name.toUpperCase()}
						/></label
					>
					<label
						>Select a cover: <input
							type="file"
							id="image"
							name="image"
							accept="image/*"
							bind:this={fileInput}
							onchange={handleFileSelect}
							required
						/></label
					>
					<div class="text-right w-full mt-5">
						<button type="submit" class="bg-black text-white">Save</button>
						<button
							class=""
							onclick={() => {
								edit = false;
								preview = null;
							}}>Cancel</button
						>
					</div>
				</form>
			{:else if add}
				<form
					method="POST"
					action="?/create"
					enctype="multipart/form-data"
					class="w-fit"
					use:enhance={handleSubmit}
				>
					<label class="block mb-5 mt-2">Enter a name: <input name="name" type="text" /></label>
					<label
						>Select a cover: <input
							type="file"
							id="image"
							name="image"
							accept="image/*"
							bind:this={fileInput}
							onchange={handleFileSelect}
							required
						/></label
					>
					<div class="text-right w-full mt-5">
						<button type="submit" class="bg-black text-white">Save</button>
						<button
							class=""
							onclick={() => {
								add = false;
								preview = null;
							}}>Cancel</button
						>
					</div>
				</form>
			{/if}
		</div>
	{/if}
</div>
