import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const aboutIndexFile = createFile({
	name: "index.md",
	summary: "Short profile, strengths, and what kind of work to expect.",
	updated: "2026-03-05",
	body: markdown([
		"# Carl Grundberg",
		"",
		"Programmer focused on building products that feel clear, fast, and dependable.",
		"",
		"I like working on the layer where product thinking, frontend craft, and systems design overlap. The goal is usually the same: reduce complexity for users without hiding the important details from the team maintaining it.",
		"",
		"## Current interests",
		"",
		"- developer experience",
		"- internal tools that remove repeated work",
		"- resilient frontend architecture",
		"- product interfaces that explain themselves",
		"",
		"> This site is intentionally structured like a filesystem. Use `cd` to move between sections and `cat` to read Markdown files.",
	]),
});

export const aboutDirectory = createDirectory({
	name: "about",
	title: "About",
	route: "/about",
	description:
		"Background, working style, and how this portfolio is structured.",
	directories: [],
	files: [aboutIndexFile],
});

export const Route = createFileRoute("/about")({
	loader: () =>
		({
			routeKey: "/about",
			directory: aboutDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
