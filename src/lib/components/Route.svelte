<script lang="ts">
	export let path: string;
	export let name: string;
</script>

<div class="pb-8">
    <a href={path}><span class="border w-fit px-2 py-1 rounded-md mr-1">{'<'}</span> Return to {name}</a>
</div>
