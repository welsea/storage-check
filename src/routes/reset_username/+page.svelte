<script lang="ts">
    import CatSpeechLeft from "$lib/components/CatSpeechLeft.svelte";
    import CatSpeechRight from "$lib/components/CatSpeechRight.svelte";
	let { form, data } = $props();
	function preventSubmit(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			e.preventDefault();
		}
	}
</script>

<div class="w-full text-center">
	<div class="w-8/12 t m-[auto]">
        <CatSpeechLeft message="You can change your username here!" />
		<CatSpeechRight message="You need to login again after username is changed." />
		{#if form?.error}
			<p class="text-red-800">{form.error}</p>
		{/if}
		<form method="POST" class="w-fit m-[auto] py-10">
			<input name="user_id" value={data.userid} type="hidden" />
			<label class="block my-5">
				New Username <input
					name="username"
					autocomplete="off"
					onkeydown={(e) => preventSubmit(e)}
				/></label
			>
			<div class="text-right">
				<button class="my-5 bg-black text-white px-4" type="submit">Save</button>
			</div>
		</form>
	</div>
</div>
