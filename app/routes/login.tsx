import type { Route } from "./+types/login"

export async function loader({ request }: Route.LoaderArgs) {
	const origin = new URL(request.url)
	const redirectUri = new URL("/auth/callback", origin)

	const clientId = process.env.STRAVA_CLIENT_ID
	if (!clientId) {
		throw new Error("STRAVA_CLIENT_ID environment variable is required")
	}

	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri.toString(),
		response_type: "code",
		scope: "read,activity:read_all",
	})

	const authorizeUrl = new URL("https://www.strava.com/oauth/authorize")
	authorizeUrl.search = params.toString()

	return { authorizeUrl: authorizeUrl.toString() }
}

export default function Login({ loaderData }: Route.ComponentProps) {
	return (
		<div className="p-2 h-dvh grid place-items-center">
			<a href={loaderData.authorizeUrl} className="underline">
				Sign in with Strava
			</a>
		</div>
	)
}
