<script setup>
definePageMeta({
	middleware: ["authenticated"],
})
const { data: runs, pending } = useFetch("/api/runs", { lazy: true })
</script>

<template>
	<div v-if="pending">
		<AppSkeleton />
	</div>
	<div v-else>
		<StatHeader :runs />
		<RunList :runs />
	</div>
</template>
