declare module "#auth-utils" {
	interface User {
		athleteId: number;
	}

	interface UserSession {
		// Add your own fields
	}

	interface SecureSessionData {
		accessToken: string;
		expiresAt: string;
		refreshToken: string;
	}
}

export {};
