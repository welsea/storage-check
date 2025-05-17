<script lang="ts">
	import CatSpeechLeft from '$lib/components/CatSpeechLeft.svelte';
	import CatSpeechRight from '$lib/components/CatSpeechRight.svelte';
	let { form, data } = $props();
	function preventSubmit(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			e.preventDefault();
		}
	}
</script>

<div class="w-full text-center">
	<div class="w-8/12 m-[auto]">
		{#if !data.login}
			<CatSpeechLeft message="You need to know <i>the <b>WORD</b></i> to rest your password." />
		{:else}
			<CatSpeechLeft message="You can change your password here!" />
		{/if}
		<CatSpeechRight message="You need to login again after password is changed." />
		{#if form?.error}
			<p class="text-red-700">{form.error}</p>
		{/if}
		<form method="POST" class="w-fit m-[auto] py-10">
			{#if !data.login}
				<label>
					<span style="color: purple;"><i>the <b>WORD</b></i></span>
					<input
						class="border-purple-700"
						name="code"
						autocomplete="off"
						onkeydown={(e) => preventSubmit(e)}
					/>
				</label>

				<label class="block my-5">
					Your Username <input
						name="username"
						autocomplete="off"
						onkeydown={(e) => preventSubmit(e)}
					/></label
				>
			{:else}
				<input name="username" value={data.username} type="hidden" />
			{/if}

			<label>
				New Password
				<input
					name="password"
					autocomplete="off"
					type="password"
					onkeydown={(e) => preventSubmit(e)}
				/>
			</label>
			<div class="text-right">
				<button class="my-5 bg-black text-white px-4" type="submit">Reset</button>
			</div>
		</form>
	</div>
</div>
