import { index, type RouteConfig, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	route("/detail/:id", "routes/detail.tsx"),
	route("/login", "routes/login.tsx"),
	route("/auth/callback", "routes/callback.tsx"),
] satisfies RouteConfig
