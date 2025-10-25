<script setup>
definePageMeta({
	middleware: ["public-only"],
});
</script>
<template>
  <div>
    <p>STR-01 Strava Analysis</p>
   <NuxtLink to="/api/auth/strava">Log in</NuxtLink> 
  </div>
</template>
