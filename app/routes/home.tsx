import { useState } from "react"
import { redirect } from "react-router"
import Polyline from "~/components/polyline"
import { getWorkoutTypeTag, metersToMiles, secondsToHMS } from "~/util/format"
import { getSession } from "~/util/session.server"
import { getAuthenticatedStravaClient } from "~/util/strava.server"
import type { Route } from "./+types/home"

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get("Cookie"))
	const loggedIn = session.has("refreshToken")
	if (!loggedIn) throw redirect("/login")

	const client = await getAuthenticatedStravaClient(request)

	const getStats = async () => {
		const me = await client.athletes.getLoggedInAthlete()
		const stats = await client.athletes.getStats({ id: me.id })
		return {
			mileage: metersToMiles(stats.ytd_run_totals.distance).toFixed(1),
			runs: stats.ytd_run_totals.count,
		}
	}

	const getList = async () => {
		const days = 90
		const after = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60
		const list = await client.activities.getLoggedInAthleteActivities({
			after,
			per_page: 200,
		})
		return list
			.filter((a) => a.type === "Run")
			.sort(
				(a, b) =>
					new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
			)
	}

	const [list, stats] = await Promise.all([getList(), getStats()])
	return { stats, list }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { stats, list } = loaderData

	return (
		<div className="">
			<header className="md:grid grid-cols-12 p-2 md:px-8 md:mb-[50dvh]">
				<div className="col-span-4 md:col-span-8 mb-2 md:mb-0">
					<p className="uppercase tracking-wider">anima sana in corpore sano</p>
				</div>
				<p className="col-span-2 md:text-right">{stats.mileage}&nbsp;mi</p>
				<p className="col-span-2 md:text-right">{stats.runs} runs</p>
			</header>
			<ul className="border-t divide-y">
				{list.map((run) => {
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
							className="grid grid-cols-[3fr_1fr_auto] md:grid-cols-12 px-2 md:px-8 py-1 items-center"
						>
							<div className="hidden md:flex col-span-1">
								<Polyline summary={map.summary_polyline} />
							</div>

							<div className="md:col-span-3 pr-2 md:pr-0">
								<span>{name}</span>
								<WorkoutTypeTag type={workout_type} />
							</div>
							<div className="hidden md:flex col-span-2 md:justify-end">
								{new Date(start_date_local).toISOString().split("T")[0]}
							</div>
							<div className="md:col-span-2 flex md:justify-end">
								{metersToMiles(distance).toFixed(2)}mi
							</div>
							<div className="hidden md:flex col-span-2 md:justify-end">
								{secondsToHMS(moving_time)}
							</div>
							<div className="md:col-span-2 flex justify-end">
								<CopyRun id={id} />
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

function WorkoutTypeTag({ type }: { type: number }) {
	return (
		getWorkoutTypeTag(type) && (
			<span className="ml-2 px-1 py-0.5 text-[9px] uppercase tracking-wide border">
				{getWorkoutTypeTag(type)}
			</span>
		)
	)
}

function CopyRun({ id }: { id: number }) {
	const [busy, setBusy] = useState(false)

	const handle = async (activityId: number) => {
		setBusy(true)
		// needs to be a native fetch because rr's `fetcher` doesn't return a promise
		// and safari can't do async clipboard writes
		try {
			const text = new ClipboardItem({
				"text/plain": fetch(`/detail/${activityId}`)
					.then((res) => res.json())
					.then(
						(data) =>
							new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" }),
					),
			})

			await navigator.clipboard.write([text])
		} catch (err) {
			console.error("Failed to copy: ", err)
		}
		setBusy(false)
	}

	return (
		<button
			type="button"
			onClick={() => handle(id)}
			className="px-2 py-0.5 inline-grid place-items-center border tracking-wide uppercase disabled:opacity-50 hover:opacity-50 cursor-pointer"
		>
			<span className="w-[4ch]">{busy ? "...." : "Copy"}</span>
		</button>
	)
}
