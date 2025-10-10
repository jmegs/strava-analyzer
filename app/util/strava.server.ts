import { Strava } from "strava"
import { getSession } from "./session.server"

export async function getAuthenticatedStravaClient(request: Request) {
	const session = await getSession(request.headers.get("Cookie"))
	const refreshToken = session.get("refreshToken")

	if (!refreshToken) {
		throw new Error("No refresh token found")
	}

	const clientId = process.env.STRAVA_CLIENT_ID
	const clientSecret = process.env.STRAVA_CLIENT_SECRET

	if (!clientId || !clientSecret) {
		throw new Error("Missing Strava client configuration")
	}

	return new Strava({
		client_id: clientId,
		client_secret: clientSecret,
		refresh_token: refreshToken,
	})
}
