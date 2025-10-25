<script setup lang="ts">
import type { SummaryActivity } from "strava";

const props = defineProps<{
	runs: SummaryActivity[];
}>();

const selectedIdx = ref(0);
// map of run.id -> component instance which exposes copy() and scrollIntoView()
const itemRefs = ref(new Map<number, any>());

const selected = computed(() => props.runs[selectedIdx.value]);
const selectedId = computed(() => selected.value?.id);

function copySelected() {
	const inst = itemRefs.value.get(selectedId.value!);
	if (inst && inst.copy) inst.copy();
}

function scrollSelected() {
	const inst = itemRefs.value.get(selectedId.value!);
	if (inst && inst.scrollIntoView) {
		inst.scrollIntoView({ block: "nearest" });
	}
}

useKeyboard({
	j: () => {
		selectedIdx.value = Math.min(selectedIdx.value + 1, props.runs.length - 1);
	},
	k: () => {
		selectedIdx.value = Math.max(selectedIdx.value - 1, 0);
	},
	c: () => {
		copySelected();
	},
	"g g": () => {
		selectedIdx.value = 0;
	},
});

// auto scroll
watch(selectedId, (newVal) => {
	if (newVal !== null) {
		scrollSelected();
	}
});

function setItemRef(id: number) {
	return (el: any | null) => {
		if (el) {
			itemRefs.value.set(id, el);
		} else {
			itemRefs.value.delete(id);
		}
	};
}
</script>

<template>
  <ul class="border-t divide-y">
    <RunListItem
      v-for="(run, i) in runs"
      :key="run.id"
      :run="run"
      :selected="i === selectedIdx"
      :ref="setItemRef(run.id)"
    />
  </ul>
</template>
