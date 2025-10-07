import { redirect } from "react-router"
import { Strava } from "strava"
import { getSession } from "~/util/session.server"
import type { Route } from "./+types/home"

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get("Cookie"))
	const loggedIn = session.has("refreshToken")
	if (!loggedIn) throw redirect("/login")

	const client = new Strava({
		client_id: process.env.STRAVA_CLIENT_ID!,
		client_secret: process.env.STRAVA_CLIENT_SECRET!,
		refresh_token: session.get("refreshToken")!,
	})

	const getStats = async () => {
		const me = await client.athletes.getLoggedInAthlete()
		const stats = await client.athletes.getStats({ id: me.id })
		return {
			mileage: stats.ytd_run_totals.distance,
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
				(a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
			)
	}

	const [list, stats] = await Promise.all([getList(), getStats()])
	return { stats, list }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { stats, list } = loaderData

	const handle = async (activityId: number) => {
		// needs to be a native fetch because rr's `fetcher` doesn't return a promise
		// and safari can't do async clipboard writes
		const response = await fetch(`/detail/${activityId}`)
		const data = await response.json()

		const text = new ClipboardItem({
			"text/plain": new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" }),
		})

		await navigator.clipboard.write([text])
	}

	return (
		<div className="p-10">
			<p>hello.</p>
			<pre>
				{JSON.stringify(stats, null, 2)}
			</pre>
			<ul>
				{list.map(i => {
					const { id, name } = i
					return (
						<li key={id} className="flex gap-2">
							<p>{name}</p>
							<button onClick={() => handle(id)}>Deets</button>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
