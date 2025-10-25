<script setup>
const { loggedIn, user } = useUserSession();
useHead({
	htmlAttrs: { lang: "en" },
	link: [{ rel: "icon", type: "image/svg+xml", href: "/icon.svg" }],
});
useSeoMeta({
	title: "STR-01 Strava Analysis",
	description: "Personal running data viewer",
});
</script>
<template>
  <div class="font-mono text-xs">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
