export default defineOAuthStravaEventHandler({
	config: {
		scope: ["read", "activity:read_all"],
	},
	async onSuccess(event, { user, tokens }) {
		await setUserSession(event, {
			user: {
				athleteId: user.id,
			},
			secure: {
				accessToken: tokens.access_token,
				expiresAt: tokens.expires_at,
				refreshToken: tokens.refresh_token,
			},
		});
		return sendRedirect(event, "/");
	},
	onError(event, error) {
		console.error("Strava OAuth error:", error);
		return sendRedirect(event, "/login");
	},
});
