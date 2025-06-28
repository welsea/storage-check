<script lang="ts">
	import TdesignHomeFilled from "~icons/tdesign/home-filled";
	let { data } = $props();

	const S3_URL = "https://cabinweb.s3.fr-par.scw.cloud";
</script>

<div class="text-right pb-8">
	<a href="/location/edit" class="underline">Edit location list</a>
</div>

<!-- location list -->
<ul class="mt-2 flex flex-wrap justify-center">
	{#each data.locations as item}
		<li
			class="text-center w-full md:w-2/5 px-3 py-2 rounded-md inline-block mr-2"
		>
			<a href="/location/{item.id}-{item.name}">
				<span class="text-2xl md:text-3xl font-thin"
					>{item.name.toUpperCase()}</span
				>
				{#if item.cover}
					<img
						class="object-cover aspect-square rounded"
						src={`${S3_URL}/${item.cover}`}
						alt={`cover-${item.name}`}
						loading="lazy"
					/>
				{:else}
					<TdesignHomeFilled
						width="100%"
						height="100%"
						color="grey"
					/>
				{/if}
			</a>
		</li>
	{/each}
</ul>
