import { createCookieSessionStorage } from "react-router"

type SessionData = {
	refreshToken: string
}

type SessionFlashData = {
	error: string
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>(
	{
		cookie: {
			name: "__session",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			path: "/",
			sameSite: "lax",
			secrets: [process.env.SESSION_SECRET!],
			secure: process.env.NODE_ENV === "production",
		},
	},
)

export { commitSession, destroySession, getSession }
