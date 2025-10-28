<script setup>
definePageMeta({
	middleware: ["public-only"],
})
</script>
<template>
	<div class="p-10">
		<p>STR-01 Strava Analysis</p>
		<NuxtLink external to="/api/auth/strava" class="underline">Log in</NuxtLink>
	</div>
</template>
