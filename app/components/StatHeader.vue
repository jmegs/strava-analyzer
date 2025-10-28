<script setup lang="ts">
import { isWithinInterval, parseISO, subDays } from "date-fns"
import type { SummaryActivity } from "strava"

interface Props {
	runs: SummaryActivity[]
}

const props = defineProps<Props>()

// generic weighted average helper
function weightedAvg(values: number[], weights: number[]): number {
	const num = values.reduce((a, v, i) => a + v * (weights[i] ?? 0), 0)
	const den = weights.reduce((a, w) => a + (w ?? 0), 0)
	return den > 0 ? num / den : 0
}

// `now` captured once to make all windows coherent
const now = new Date()

// preprocessed runs with derived fields
const runs = computed(() =>
	props.runs.map((r) => ({
		...r,
		date: parseISO(r.start_date),
		miles: mToMi(r.distance ?? 0),
		mps: r.average_speed ?? 0,
		secs: r.moving_time ?? 0,
		hr: r.average_heartrate ?? null,
		tag: r.workout_type,
	}))
)

// helper: is a given run within last N days
function inLast(d: Date, days: number) {
	return isWithinInterval(d, { start: subDays(now, days), end: now })
}

// ----- volume metrics -----
const miles7 = computed(() =>
	runs.value.filter((r) => inLast(r.date, 7)).reduce((a, r) => a + r.miles, 0)
)

const miles28 = computed(() =>
	runs.value.filter((r) => inLast(r.date, 28)).reduce((a, r) => a + r.miles, 0)
)

const weeklyDelta = computed(() => miles7.value - miles28.value / 4)

// ----- easy runs only (untagged) -----
const easyRuns = computed(() =>
	runs.value.filter((r) => getTag(r.tag) === null)
)

const easy7 = computed(() => easyRuns.value.filter((r) => inLast(r.date, 7)))
const easy28 = computed(() => easyRuns.value.filter((r) => inLast(r.date, 28)))

// weighted avg pace (m/s), weighted by miles
const mps7 = computed(() =>
	weightedAvg(
		easy7.value.map((r) => r.mps),
		easy7.value.map((r) => r.miles)
	)
)

const mps28 = computed(() =>
	weightedAvg(
		easy28.value.map((r) => r.mps),
		easy28.value.map((r) => r.miles)
	)
)

const easyPct = computed(() =>
	mps28.value > 0 ? ((mps7.value - mps28.value) / mps28.value) * 100 : 0
)

// ----- HR: weighted by moving time -----
const e7HR = computed(() => easy7.value.filter((r) => r.hr != null))

const e28HR = computed(() => easy28.value.filter((r) => r.hr != null))

const hr7 = computed(() =>
	weightedAvg(
		e7HR.value.map((r) => r.average_heartrate ?? 0),
		e7HR.value.map((r) => r.moving_time ?? 0)
	)
)

const hr28 = computed(() =>
	weightedAvg(
		e28HR.value.map((r) => r.average_heartrate ?? 0),
		e28HR.value.map((r) => r.moving_time ?? 0)
	)
)

const hrDeltaBpm = computed(() => hr7.value - hr28.value)

// ----- Longest in last 28d -----
const longestRecent = computed(() =>
	runs.value
		.filter((r) => inLast(r.date, 28))
		.reduce((mx, r) => Math.max(mx, r.miles), 0)
)

// ----- formatted statlines for template -----
const milesCardLines = computed(() => [
	`${miles7.value.toFixed(1)} mi`,
	`${weeklyDelta.value >= 0 ? "+" : ""}${weeklyDelta.value.toFixed(
		1
	)} mi vs 28d avg`,
])

const easyPaceCardLines = computed(() => [
	msToMin(mps7.value),
	`${easyPct.value >= 0 ? "+" : ""}${easyPct.value.toFixed(1)}% vs 28d avg`,
])

const easyHRCardLines = computed(() => [
	`${Math.round(hr7.value)} bpm`,
	`${hrDeltaBpm.value > 0 ? "+" : ""}${hrDeltaBpm.value.toFixed(
		0
	)} bpm vs 28d avg`,
])

const longCardLines = computed(() => [
	longestRecent.value ? `${longestRecent.value.toFixed(1)} mi` : "–",
])
</script>

<template>
	<header
		class="px-2 py-4 md:p-8 grid grid-cols-12 grid-rows-[auto_1fr] gap-2 mb-2"
	>
		<StatHeaderCard
			title="Miles"
			timeframe="7d"
			:statlines="milesCardLines"
			className="col-span-6 md:col-span-3"
		/>
		<StatHeaderCard
			title="Long"
			timeframe="28d"
			:statlines="longCardLines"
			className="col-span-6 md:col-span-3"
		/>
		<StatHeaderCard
			title="Easy Pace"
			timeframe="7d"
			:statlines="easyPaceCardLines"
			className="col-span-6 md:col-span-3"
		/>
		<StatHeaderCard
			title="Easy HR"
			timeframe="28d"
			:statlines="easyHRCardLines"
			className="col-span-6 md:col-span-3"
		/>
	</header>
</template>
