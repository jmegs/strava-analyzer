import { redirect } from "react-router"
import { commitSession, getSession } from "~/util/session.server"
import type { Route } from "./+types/callback"

export async function loader({ request }: Route.LoaderArgs) {
	// get code from search params
	const url = new URL(request.url)
	const code = url.searchParams.get("code")

	if (!code) {
		throw new Error("No code provided")
	}

	const clientId = process.env.STRAVA_CLIENT_ID
	const clientSecret = process.env.STRAVA_CLIENT_SECRET

	if (!clientId || !clientSecret) {
		throw new Error("Missing Strava client configuration")
	}

	// exchange code for access token
	const params = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		code,
	})

	const response = await fetch("https://www.strava.com/oauth/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params,
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message)
	}

	// save access token to session
	const session = await getSession(request.headers.get("Cookie"))
	session.set("refreshToken", data.refresh_token)

	return redirect("/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	})
}
