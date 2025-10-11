import { useRef, useState } from "react"
import { redirect, useRevalidator } from "react-router"
import type { CopyButtonRef } from "~/components/copy-button"
import { Header } from "~/components/header"
import { Run } from "~/components/run"
import { metersToMiles } from "~/util/format"
import { getSession } from "~/util/session.server"
import { getAuthenticatedStravaClient } from "~/util/strava.server"
import { useKeyboard } from "~/util/use-keyboard"
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
	const len = list.length
	const [sel, setSel] = useState<number | null>(0)
	const runRefs = useRef<(CopyButtonRef | null)[]>([])
	const revalidator = useRevalidator()

	const moveDown = () => {
		setSel((prev) => (prev === null ? 0 : Math.min(prev + 1, len - 1)))
	}

	const moveUp = () => {
		setSel((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)))
	}

	const toTop = () => setSel(0)

	const refresh = () => revalidator.revalidate()

	const unselect = () => setSel(null)

	const copySelected = () => {
		if (sel === null) return
		if (runRefs.current[sel]) {
			runRefs.current[sel]?.copy()
		}
	}

	useKeyboard({
		bindings: {
			j: moveDown,
			k: moveUp,
			"g g": toTop,
			c: copySelected,
			r: refresh,
			Escape: unselect,
		},
	})

	return (
		<div className="">
			<Header stats={stats} />
			<ul className="border-t divide-y">
				{list.map((run, idx) => (
					<Run
						key={run.id}
						ref={(el) => (runRefs.current[idx] = el)}
						run={run}
						selected={sel === idx}
					/>
				))}
			</ul>
		</div>
	)
}
