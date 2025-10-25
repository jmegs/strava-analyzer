<script setup lang="ts">
interface Props {
	title: string;
	timeframe: string;
	statlines: string[];
	className?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="aspect-square flex flex-col justify-between px-4 py-3 border"
    :class="props.className"
  >
    <div class="flex justify-between items-center">
      <span>{{ props.title }}</span>
      <span>{{ props.timeframe }}</span>
    </div>

    <div class="flex flex-col space-y-1">
      <span
        v-for="line in props.statlines"
        :key="line"
      >
        {{ line }}
      </span>
    </div>
  </div>
</template>
