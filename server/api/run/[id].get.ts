import z from "zod"

export default defineEventHandler(async (event) => {
	const strava = await createStravaClient(event)
	const schema = z.object({ id: z.coerce.number() })
	const params = await getValidatedRouterParams(event, schema.parse)

	const act = await strava.activities.getActivityById({ id: params.id })

	const isoUTC = act.start_date
	const weather = act.start_latlng
		? await getWeather({
				lat: act.start_latlng[0],
				lng: act.start_latlng[1],
				isoUTC,
		  })
		: { temp_f: null, dewpoint_f: null, wind_mph: null }

	return {
		name: act.name,
		strava_activity_id: act.id,
		date: act.start_date,
		date_local: act.start_date_local,
		distance_mi: round2(mToMi(act.distance)),
		moving_time_s: act.moving_time,
		elapsed_time_s: act.elapsed_time,
		avg_pace_s_per_mi: Math.round(act.moving_time / mToMi(act.distance)),
		avg_pace_min_per_mile: msToMin(act.average_speed),
		avg_hr: Math.round(act.average_heartrate),
		cadence_spm: round2(act.average_cadence * 2),
		max_hr: act.max_heartrate,
		elev_gain_ft: round2(mToFt(act.total_elevation_gain)),
		route_start_latlng: act.start_latlng,
		workout_type_tag: getTag(act.workout_type),
		splits: act.splits_standard.map((split) => ({
			split: split.split,
			distance_mi: round2(mToMi(split.distance)),
			moving_time_s: split.moving_time,
			pace_s: round2(split.moving_time / mToMi(split.distance)),
			pace_min_per_mile: msToMin(split.average_speed),
			avg_hr: Math.round(split.average_heartrate),
			elev_gain_ft: round2(mToFt(split.elevation_difference)),
		})),
		...(isWorkout(act) && { laps: buildLaps(act) }),
		rpe: act.perceived_exertion || null,
		shoes: act.gear?.name,
		notes: act.description,
		private_notes: act.private_note || null,
		weather,
	}
})
