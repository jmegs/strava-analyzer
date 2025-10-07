import type { Route } from "./+types/login"

export async function loader({ request }: Route.LoaderArgs) {
	const origin = new URL(request.url)
	const redirectUri = new URL("/auth/callback", origin)

	const params = new URLSearchParams({
		client_id: process.env.STRAVA_CLIENT_ID!,
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
		<div className="p-10">
			<p>Login Page</p>
			<a href={loaderData.authorizeUrl}>Sign in with Strava</a>
		</div>
	)
}
