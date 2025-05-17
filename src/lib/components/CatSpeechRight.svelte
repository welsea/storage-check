<script lang="ts">
	import TdesignCatFilled from '~icons/tdesign/cat-filled';
	export let message : string

</script>

<div class="py-5 pr-5 flex items-center w-full justify-end">
	<div class="speech-bubble-right px-3 py-1 rounded-md mr-3">
		{@html message}
	</div>
	<TdesignCatFilled width="1.5em" height="1.5em" />
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.speech-bubble-right {
		position: relative;
		background: white;
		width: fit-content;
		border: 1px solid black;
	}

	.speech-bubble-right:before {
		content: ' ';
		position: absolute;
		width: 0;
		height: 0;
		top: 50%;
		right: 0;
		margin-right: -1rem;
		margin-top: -0.5rem;
		border: 0.4rem solid;
		border: 0.5rem solid transparent;
		border-left-color: black;
	}

	.speech-bubble-right:after {
		content: ' ';
		position: absolute;
		width: 0;
		height: 0;
		top: 50%;
		right: 0;
		margin-right: -0.9rem;
		margin-top: -0.5rem;
		border: 0.5rem solid;
		border: 0.5rem solid transparent;
		border-left-color: white;
	}
</style>
