import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const frontendEngineerFile = createFile({
	name: "frontend-engineer.md",
	summary: "Built polished interfaces and performance-sensitive user journeys.",
	route: "/career/frontend-engineer",
	body: markdown([
		"# Frontend Engineer",
		"",
		"- **Company:** Example Digital Product Studio",
		"- **Dates:** 2017 - 2020",
		"",
		"## Highlights",
		"",
		"- Delivered production React interfaces for multiple client products.",
		"- Worked closely with designers to turn visual systems into reusable components.",
		"- Optimized bundle size, render performance, and perceived responsiveness.",
	]),
});

export const Route = createFileRoute("/career/frontend-engineer")({
	loader: () =>
		({
			routeKey: "/career/frontend-engineer",
			selectedFile: frontendEngineerFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
