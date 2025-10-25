<script setup>
const { loggedIn, user } = useUserSession();
</script>
<template>
  <div class="font-mono text-xs">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
