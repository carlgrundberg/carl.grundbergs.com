import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const hobbiesIndexFile = createFile({
	name: "index.md",
	summary: "Interests and pursuits outside of day-to-day product work.",
	body: markdown([
		"# Hobbies",
		"",
		"This section is for the interests, routines, and experiments that sit outside of work.",
		"",
		"## Current hobbies",
		"",
		"- craft beer",
		"- running",
		"- orienteering",
		"- floorball",
	]),
});

export const hobbiesDirectory = createDirectory({
	name: "hobbies",
	title: "Hobbies",
	route: "/hobbies",
	description: "Interests, routines, and life outside of software work.",
	directories: [],
	files: [hobbiesIndexFile],
});

export const Route = createFileRoute("/hobbies")({
	loader: () =>
		({
			routeKey: "/hobbies",
			directory: hobbiesDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
