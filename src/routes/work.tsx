import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";
import { ctoExtellioFile } from "./work.cto-extellio";
import { frontendDeveloperHittahemFile } from "./work.frontend-developer-hittahem";

export const workIndexFile = createFile({
	name: "index.md",
	summary: "Overview of roles, experience areas, and strengths.",
	body: markdown([
		"# Work overview",
		"",
		"My work has centered on product development, frontend engineering, and technical leadership.",
		"",
		"## Common themes",
		"",
		"- building clear and usable product experiences",
		"- balancing technical direction with delivery",
		"- creating systems that are easier to maintain over time",
		"",
		"Files in this directory represent selected roles. Use `cat <file>` to inspect an individual position.",
	]),
});

export const workDirectory = createDirectory({
	name: "work",
	title: "Work",
	route: "/work",
	description: "Professional history, role summaries, and selected impact areas.",
	directories: [],
	files: [
		workIndexFile,
		ctoExtellioFile,
		frontendDeveloperHittahemFile,
	],
});

export const Route = createFileRoute("/work")({
	loader: () =>
		({
			routeKey: "/work",
			directory: workDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
