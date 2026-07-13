<script lang="ts">
	import CatSpeechLeft from "$lib/components/CatSpeechLeft.svelte";
	let { form } = $props();
	function preventSubmit(e: KeyboardEvent) {
		if (e.code === "Enter") {
			e.preventDefault();
		}
	}
</script>

<div class="w-full text-center">
	<div class="w-8/12 t m-[auto]">
		<CatSpeechLeft message="Hello, what's the password?" />
		{#if form?.error}
			<p class="text-red-800">{form.error}</p>
		{/if}
		<form method="POST" class="w-fit m-[auto] py-10 flex items-end gap-2">
			<label>
				<input name="password" autocomplete="off" type="password" onkeydown={(e) => preventSubmit(e)} />
			</label>
			<button class=" bg-black text-white" type="submit">Go!</button>
		</form>
	</div>
</div>
