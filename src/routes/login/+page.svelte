<script lang="ts">
	import CatSpeechLeft from '$lib/components/CatSpeechLeft.svelte';
	import CatSpeechRight from '$lib/components/CatSpeechRight.svelte';
	let { form } = $props();
	function preventSubmit(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			e.preventDefault();
		}
	}
</script>

<div class="w-full text-center">
	<div class="w-8/12 t m-[auto]">
		<CatSpeechLeft message="You need to log in!" />
		{#if form?.error}
			<p class="text-red-800">{form.error}</p>
		{/if}
		<form method="POST" class="w-fit m-[auto] py-10">
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
				<button class="my-5 bg-black text-white px-4" type="submit">Log in</button>
			</div>
		</form>

		<div class="italic mt-10">
			<CatSpeechLeft
				message={`Forget password? <a href="/reset_password" class="underline">Reset password</a>.`}
			/>

			<CatSpeechRight
				message={`Don't have a account? <a href="/register" class="underline">Create one</a>.`}
			/>
		</div>
	</div>
</div>
