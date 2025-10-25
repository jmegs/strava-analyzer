<script setup lang="ts">
import type { SummaryActivity } from "strava";

const props = defineProps<{
	run: SummaryActivity;
	selected: boolean;
}>();

const liRef = ref<HTMLLIElement | null>(null);

const { copying, copied, copyRun } = useCopyRun();

const copyFn = () => copyRun(props.run.id);
const scrollFn = () => liRef.value?.scrollIntoView();

defineExpose({ copy: copyFn, scrollIntoView: scrollFn });

const dateStr = computed(
	() => new Date(props.run.start_date_local).toISOString().split("T")[0],
);
const miles = computed(() => mToMi(props.run.distance).toFixed(2) + "mi");
const pace = computed(() => secToHMS(props.run.moving_time));
const hr = computed(() => props.run.average_heartrate.toFixed(0) + "bpm");
const tag = computed(() => getTag(props.run.workout_type));
</script>

<template>
  <li
    ref="liRef"
    class="grid grid-cols-12 gap-x-2 px-2 md:px-8 py-1 items-center scroll-mt-(--li-scroll-margin)"
  >
    <div class="col-span-6 md:col-span-3 pr-2 flex items-center overflow-hidden">
      <div class="hidden md:flex mr-6">
        <PolyLine :summary="run.map.summary_polyline" />
      </div>

      <span
        v-if="selected"
        class="h-2 w-2 bg-blue-500 dark:bg-amber-500 rounded-full mr-2 max-sm:hidden"
      />

      <span class="truncate mr-2">{{ run.name }}</span>
      <span v-if="tag">[{{ tag }}]</span>
    </div>

    <div class="hidden md:flex col-span-2">
      {{ dateStr }}
    </div>

    <div class="col-span-2 flex">
      {{ miles }}
    </div>

    <div class="flex col-span-2">
      {{ pace }}
    </div>

    <div class="hidden md:flex col-span-2">
      {{ hr }}
    </div>

    <div class="col-span-2 md:col-span-1 flex justify-end">
      <button
        type="button"
        class="px-2 py-0.5 inline-grid place-items-center border tracking-wide uppercase disabled:opacity-50 hover:opacity-50 cursor-pointer"
        :disabled="copying"
        @click="copyFn"
      >
        <span class="w-[4ch]">
          <template v-if="copying">....</template>
          <template v-else-if="copied">√</template>
          <template v-else>Copy</template>
        </span>
      </button>
    </div>
  </li>
</template>
