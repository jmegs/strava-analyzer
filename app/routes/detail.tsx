import type { Route } from "./+types/detail"

export async function loader({ params }: Route.LoaderArgs) {
	const { id } = params
	return { id }
}
