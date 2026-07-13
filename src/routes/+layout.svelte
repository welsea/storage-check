<script lang="ts">
	import "../app.css";

	let { children, data } = $props();
</script>

<svelte:head>
	<title>Storage!</title>
</svelte:head>

<nav class="bg-black text-white px-3 flex justify-between items-baseline max-h-1/12">
	<h1>
		<a href="/">
			Storage!
			<span class="text-base italic">beta</span>
		</a>
	</h1>
</nav>

<main class="min-h-full md:min-h-11/12 py-5 px-5">
	{@render children()}
</main>

<footer class="bg-gray-100 text-gray-600 py-5 text-center">
	© 2025-2026 Nisse Production. Code licensed under the MIT License.
</footer>
