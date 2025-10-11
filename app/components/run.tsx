import type { SummaryActivity } from "strava"
import {
	getWorkoutTypeTag as getTag,
	metersToMiles,
	secondsToHMS,
} from "~/util/format"
import { CopyButton, type CopyButtonRef } from "./copy-button"
import Polyline from "./polyline"

interface Props {
	run: SummaryActivity
	selected: boolean
	ref?: React.Ref<CopyButtonRef>
}

export function Run({ run, selected, ref }: Props) {
	const {
		id,
		name,
		map,
		workout_type,
		start_date_local,
		distance,
		moving_time,
	} = run

	return (
		<li
			key={id}
			className="grid grid-cols-[3fr_1fr_1fr_auto] md:grid-cols-12 px-2 md:px-8 py-1 items-center"
		>
			<div className="hidden md:flex col-span-1">
				<Polyline summary={map.summary_polyline} />
			</div>

			<div className="md:col-span-3 pr-2 md:pr-0 flex items-center">
				{selected && (
					<div className="h-2 w-2 rounded-full mr-2 bg-blue-500 dark:bg-amber-400" />
				)}
				<span>{name}</span>
				{getTag(workout_type) && <span>&nbsp;[{getTag(workout_type)}]</span>}
			</div>
			<div className="hidden md:flex col-span-2 md:justify-end">
				{new Date(start_date_local).toISOString().split("T")[0]}
			</div>
			<div className="md:col-span-2 flex md:justify-end">
				{metersToMiles(distance).toFixed(2)}mi
			</div>
			<div className="flex md:col-span-2 md:justify-end">
				{secondsToHMS(moving_time)}
			</div>
			<div className="md:col-span-2 flex justify-end">
				<CopyButton ref={ref} id={id} />
			</div>
		</li>
	)
}
