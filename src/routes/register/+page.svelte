<script lang="ts">
	import CatSpeechLeft from '$lib/components/CatSpeechLeft.svelte';
	let { form } = $props();

	function preventSubmit(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			e.preventDefault();
		}
	}
</script>

<div class="w-full text-center">
	<div class="w-8/12 t m-[auto]">
		<CatSpeechLeft message="You need a invitation code to register." />

		{#if form?.error}
			<p class="text-red-700">{form.error}</p>
		{/if}
		<form method="POST" class="w-fit m-[auto] py-10">
			<label
				>Invitation code: <input
					name="code"
					autocomplete="off"
					onkeydown={(e) => preventSubmit(e)}
				/>
			</label>
			<label class="block my-5">
				Username <input
					name="username"
					autocomplete="off"
					onkeydown={(e) => preventSubmit(e)}
				/></label
			>
			<label>
				Password
				<input
					name="password"
					autocomplete="off"
					type="password"
					onkeydown={(e) => preventSubmit(e)}
				/>
			</label>
			<div class="text-right">
				<button class="my-5 bg-black text-white px-4" type="submit">Register</button>
			</div>
		</form>
	</div>
</div>
