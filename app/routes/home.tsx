import { redirect } from "react-router"
import { getSession } from "~/util/session.server"
import type { Route } from "./+types/home"

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get("Cookie"))
	const loggedIn = session.has("refreshToken")
	if (!loggedIn) throw redirect("/login")
	return { loggedIn }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div className="p-10">
			<p>hello.</p>
			<p>you are {loaderData.loggedIn ? "logged in" : "logged out"}</p>
		</div>
	)
}
