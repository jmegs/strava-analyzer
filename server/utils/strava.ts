import type { H3Event } from "h3"
import { Strava } from "strava"

export const createStravaClient = async (event: H3Event) => {
	const session = await requireUserSession(event)
	const { accessToken, refreshToken, expiresAt } = session.secure!
	const { clientId, clientSecret } = useRuntimeConfig().oauth.strava
	const client = new Strava(
		{
			client_id: clientId,
			client_secret: clientSecret,
			on_token_refresh: async (token) => {
				console.log("Refreshing Strava tokens...")
				await setUserSession(event, {
					secure: {
						accessToken: token.access_token,
						expiresAt: token.expires_at,
						refreshToken: token.refresh_token || refreshToken,
					},
				})
			},
		},
		{
			access_token: accessToken,
			refresh_token: refreshToken,
			expires_at: expiresAt,
		}
	)

	return client
}
