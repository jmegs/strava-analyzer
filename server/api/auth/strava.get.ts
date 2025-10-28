export default defineOAuthStravaEventHandler({
	config: {
		scope: ["read", "activity:read_all"],
	},
	async onSuccess(event, { user, tokens }) {
		console.log("Successfully logged in...")
		const session = await setUserSession(event, {
			user: {
				athleteId: user.id,
			},
			secure: {
				accessToken: tokens.access_token,
				expiresAt: tokens.expires_at,
				refreshToken: tokens.refresh_token,
			},
		})
		console.log(`Logged in user ${session.user?.athleteId}`)
		return sendRedirect(event, "/")
	},
	onError(event, error) {
		console.error("Strava OAuth error:", error)
		return sendRedirect(event, "/login")
	},
})
