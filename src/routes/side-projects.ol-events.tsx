import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const olEventsFile = createFile({
	name: "ol-events.md",
	summary:
		"Find upcoming orienteering races faster, with filters and a location-aware view on Eventor-backed listings.",
	route: "/side-projects/ol-events",
	body: markdown([
		"# ol-events",
		"",
		"- **Live site:** [eventor.nu](https://eventor.nu)",
		"- **Repository:** [github.com/carlgrundberg/ol-events](https://github.com/carlgrundberg/ol-events)",
		"",
		"## What it’s for",
		"",
		"For **people who orienteer**: a quicker way to **discover upcoming races** than clicking around the usual calendar flows—especially when you care about **what’s on**, **what type of race it is**, and **how far away** it is.",
		"",
		"## What you can do",
		"",
		"- **Browse races** sourced from the **Eventor** world (classifications and disciplines you already use in the sport).",
		"- **Filter and search** so the list matches how you actually pick races—not a single undifferentiated feed.",
		"- Use **location** so “**near me**” style discovery is part of the workflow, not an afterthought.",
		"",
		"The point is less about novelty and more about **less friction** from intent (“I want a race”) to a short list worth acting on.",
	]),
});

export const Route = createFileRoute("/side-projects/ol-events")({
	loader: () =>
		({
			routeKey: "/side-projects/ol-events",
			selectedFile: olEventsFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
