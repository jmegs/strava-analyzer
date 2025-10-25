<script setup>
definePageMeta({
	middleware: ["authenticated"],
});
const { data: runs, pending, error } = useFetch("/api/runs");
</script>
<template>
  <div>
    <StatHeader :runs />
    <RunList :runs />
  </div>
</template>
