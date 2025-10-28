<script setup lang="ts">
import type { SummaryActivity } from "strava"

const props = defineProps<{
	run: SummaryActivity
	selected: boolean
}>()

const liRef = ref<HTMLLIElement | null>(null)

const { copying, copied, copyRun } = useCopyRun()

const copyFn = () => copyRun(props.run.id)
const scrollFn = () => liRef.value?.scrollIntoView()
const stravaUrl = computed(
	() => `https://www.strava.com/activities/${props.run.id}`
)
const viewFn = async () =>
	await navigateTo(stravaUrl.value, { open: { target: "_blank" } })

defineExpose({ copy: copyFn, scrollIntoView: scrollFn, visit: viewFn })

const dateStr = computed(
	() => new Date(props.run.start_date_local).toISOString().split("T")[0]
)
const miles = computed(() => mToMi(props.run.distance).toFixed(2) + "mi")
const movingTime = computed(() => secToHMS(props.run.moving_time))
const hr = computed(() => props.run.average_heartrate.toFixed(0) + "bpm")
const tag = computed(() => getTag(props.run.workout_type))
</script>

<template>
	<li
		ref="liRef"
		class="grid grid-cols-12 gap-x-2 px-2 md:px-8 py-1 items-center scroll-mt-(--li-scroll-margin)"
	>
		<div
			class="col-span-6 md:col-span-3 pr-2 flex items-center overflow-hidden"
		>
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
			{{ movingTime }}
		</div>

		<div class="hidden md:flex col-span-2">
			{{ hr }}
		</div>

		<div class="col-span-2 md:col-span-1 flex gap-2 justify-end">
			<button
				type="button"
				@click="viewFn"
				class="px-1 py-0.5 inline-grid place-items-center border tracking-wide uppercase disabled:opacity-50 hover:opacity-50 cursor-pointer"
			>
				<span class="w-[3ch]">VST</span>
			</button>
			<button
				type="button"
				class="px-1 py-0.5 inline-grid place-items-center border tracking-wide uppercase disabled:opacity-50 hover:opacity-50 cursor-pointer"
				:disabled="copying"
				@click="copyFn"
			>
				<span class="w-[3ch]">
					<template v-if="copying">...</template>
					<template v-else-if="copied">√</template>
					<template v-else>CPY</template>
				</span>
			</button>
		</div>
	</li>
</template>
