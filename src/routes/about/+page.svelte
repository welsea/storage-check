<script lang="ts">
	import TdesignDoge from '~icons/tdesign/doge';

	import TdesignCat from '~icons/tdesign/cat';

	let messageDog = $state<string>();
	let messageCat = $state<string>();
</script>

<div class="flex">
	<div class="text-center basis-1/2">
		<div class="w-full flex justify-center mt-[20%] mb-10">
			<TdesignDoge width="3em" height="3em" />
		</div>

		{#if messageDog}
			<p class="text-xl my-2">{messageDog}</p>
		{/if}

		<button class="border-0 hover:underline" onclick={() => (messageDog = 'Yes! Woof woof!')}
			>This is a dog!</button
		>
		<button class="border-0 hover:underline" onclick={() => (messageDog = ':( ')}
			>This a cat!</button
		>
	</div>

	<div class="text-center basis-1/2">
		<div class="w-full flex justify-center mt-[20%] mb-10">
			<TdesignCat width="3em" height="3em" />
		</div>

		{#if messageCat}
			<p class="text-xl my-2">{messageCat}</p>
		{/if}

		<button class="border-0 hover:underline" onclick={() => (messageCat = '...')}
			>This is a dog!</button
		>
		<button class="border-0 hover:underline" onclick={() => (messageCat = ': )')}
			>This a cat!</button
		>
	</div>
</div>
