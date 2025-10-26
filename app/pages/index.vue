<script setup>
definePageMeta({
	middleware: ["authenticated"],
});
const { data: runs, status } = useFetch("/api/runs", { lazy: true });
const isLoading = computed(() => status.value === "pending");
</script>
<template>
  <div v-if="isLoading"><AppSkeleton /></div>
  <div v-else>
    <StatHeader :runs />
    <RunList :runs />
  </div>
</template>
