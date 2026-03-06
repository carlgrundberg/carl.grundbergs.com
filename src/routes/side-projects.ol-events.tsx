import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const olEventsFile = createFile({
	name: "ol-events.md",
	summary: "A Next.js app-router project for events, written mostly in TypeScript.",
	route: "/side-projects/ol-events",
	body: markdown([
		"# ol-events",
		"",
		"- **Repository:** [github.com/carlgrundberg/ol-events](https://github.com/carlgrundberg/ol-events)",
		"- **Stack:** Next.js, TypeScript, CSS",
		"",
		"## Notes",
		"",
		"This project uses the newer Next.js app router structure with `app`, `components`, `lib`, and `public`.",
		"",
		"It reads like a more modern TypeScript-heavy application and looks like a focused product or event-oriented build.",
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
