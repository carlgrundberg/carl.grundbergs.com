import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const carlGrundbergsComFile = createFile({
	name: "carl-grundbergs-com.md",
	summary: "The current personal website, built with TanStack Start and file-based routing.",
	route: "/side-projects/carl-grundbergs-com",
	body: markdown([
		"# carl.grundbergs.com",
		"",
		"- **Repository:** [github.com/carlgrundberg/carl.grundbergs.com](https://github.com/carlgrundberg/carl.grundbergs.com)",
		"- **Stack:** TanStack Start, TypeScript, Tailwind CSS",
		"",
		"## Notes",
		"",
		"This is the site you are looking at now: a route-driven personal website presented through a terminal metaphor.",
		"",
		"It started from a TanStack Start app and has been reshaped into a filesystem-style interface where shell commands and router state work together.",
	]),
});

export const Route = createFileRoute("/side-projects/carl-grundbergs-com")({
	loader: () =>
		({
			routeKey: "/side-projects/carl-grundbergs-com",
			selectedFile: carlGrundbergsComFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
