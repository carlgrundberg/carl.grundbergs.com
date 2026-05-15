import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const elprIsFile = createFile({
	name: "elpr-is.md",
	summary:
		"Check today’s Swedish electricity area prices and short trends with a minimal, fast view.",
	route: "/side-projects/elpr-is",
	body: markdown([
		"# elpr.is",
		"",
		"- **Live site:** [elpr.is](https://elpr.is)",
		"- **Repository:** [github.com/carlgrundberg/elpr.is](https://github.com/carlgrundberg/elpr.is)",
		"",
		"## What it’s for",
		"",
		"It helps you quickly see **today’s Swedish elprices and short trends** without wading through heavier energy sites: **bidding areas (SE1–SE4)** and **simple charts** instead of noise.",
		"",
		"## What you can do",
		"",
		"- See **current** area prices and **average** views, including a **30‑day** perspective.",
		"- **Tomorrow’s prices** when they’re published (usually from around 13:30).",
		"- Prices are shown with **clear credit** to the upstream data source ([Elpriset just nu.se](https://www.elprisetjustnu.se/)).",
	]),
});

export const Route = createFileRoute("/side-projects/elpr-is")({
	loader: () =>
		({
			routeKey: "/side-projects/elpr-is",
			selectedFile: elprIsFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
