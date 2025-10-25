export default defineEventHandler(async (event) => {
	const strava = await createStravaClient(event);
	const days = 90;
	const after = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
	const list = await strava.activities.getLoggedInAthleteActivities({
		after,
		per_page: 200,
	});
	return list
		.filter((a) => a.type === "Run")
		.sort((a, b) => b.start_date.localeCompare(a.start_date));
});
