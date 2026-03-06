import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const homeIndexFile = createFile({
	name: "index.md",
	summary: "Introduction to Carl Grundberg and this personal website.",
	body: markdown([
		"# Welcome to my personal website",
		"",
		"This is a place to share who I am, what I work on, and how I think about building software.",
		"",
		"This website is structured like a small filesystem. You can move through it like a terminal, or use the router by navigating directly to each section.",
	]),
});

export const Route = createFileRoute("/")({
	loader: () =>
		({
			routeKey: "/",
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
