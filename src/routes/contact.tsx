import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const contactIndexFile = createFile({
	name: "index.md",
	summary: "Preferred contact channels and collaboration notes.",
	updated: "2026-03-05",
	body: markdown([
		"# Contact",
		"",
		"Best for project discussions or opportunities:",
		"",
		"- email: [hello@carlgrundbergs.com](mailto:hello@carlgrundbergs.com)",
		"- github: [github.com/your-handle](https://github.com/your-handle)",
		"- linkedin: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)",
		"",
		"I am most interested in product engineering, frontend-heavy roles, and teams that care about usability as much as code quality.",
		"",
		"> Replace the placeholder profile URLs with real ones before launch.",
	]),
});

export const contactDirectory = createDirectory({
	name: "contact",
	title: "Contact",
	route: "/contact",
	description: "Ways to reach out, collaborate, or continue the conversation.",
	directories: [],
	files: [contactIndexFile],
});

export const Route = createFileRoute("/contact")({
	loader: () =>
		({
			routeKey: "/contact",
			directory: contactDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
