import { createCookieSessionStorage } from "react-router"

type SessionData = {
	refreshToken: string
}

type SessionFlashData = {
	error: string
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
	throw new Error("SESSION_SECRET environment variable is required")
}

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: "__session",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			path: "/",
			sameSite: "lax",
			secrets: [sessionSecret],
			secure: process.env.NODE_ENV === "production",
		},
	})

export { commitSession, destroySession, getSession }
