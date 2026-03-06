import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const seniorFullstackEngineerFile = createFile({
	name: "senior-fullstack-engineer.md",
	summary: "Owned user-facing flows and the supporting APIs behind them.",
	route: "/career/senior-fullstack-engineer",
	body: markdown([
		"# Senior Fullstack Engineer",
		"",
		"- **Company:** Example SaaS Team",
		"- **Dates:** 2020 - 2023",
		"",
		"## Highlights",
		"",
		"- Built and maintained business-critical onboarding and reporting flows.",
		"- Improved delivery confidence through better test coverage and clearer boundaries.",
		"- Reduced support load by replacing hidden system behavior with visible feedback.",
		"",
		"## Stack",
		"",
		"- React",
		"- TypeScript",
		"- Node.js",
		"- PostgreSQL",
	]),
});

export const Route = createFileRoute("/career/senior-fullstack-engineer")({
	loader: () =>
		({
			routeKey: "/career/senior-fullstack-engineer",
			selectedFile: seniorFullstackEngineerFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
