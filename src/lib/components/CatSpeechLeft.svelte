<script lang="ts">
	import TdesignCat from '~icons/tdesign/cat';
	export let message : string
</script>

<div class="py-5 pl-3 flex items-center">
	<TdesignCat width="1.5em" height="1.5em" />
	<div class="speech-bubble-left px-3 py-1 rounded-md ml-3">{@html message}</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.speech-bubble-left {
		position: relative;
		background: black;
		color: white;
		width: fit-content;
	}

	.speech-bubble-left:after {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 0;
		height: 0;
		border: 0.5rem solid transparent;
		border-right-color: black;
		border-left: 0;
		margin-top: -0.5rem;
		margin-left: -0.5rem;
	}
</style>
