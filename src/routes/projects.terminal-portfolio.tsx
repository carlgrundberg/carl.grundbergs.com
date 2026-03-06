import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const terminalPortfolioFile = createFile({
	name: "terminal-portfolio.md",
	summary: "A route-backed personal site that behaves like a Linux shell.",
	route: "/projects/terminal-portfolio",
	body: markdown([
		"# Terminal Portfolio",
		"",
		"- **Type:** Personal website experiment",
		"",
		"## Problem",
		"",
		"Most developer portfolios explain technical identity but do not express it.",
		"",
		"## Approach",
		"",
		"- model content as folders and files",
		"- map shell commands to real routes",
		"- make the interface feel like a modern terminal, not a gimmick",
		"",
		"## Outcome",
		"",
		"A portfolio that is more memorable, more exploratory, and more aligned with how I actually like to work.",
	]),
});

export const Route = createFileRoute("/projects/terminal-portfolio")({
	loader: () =>
		({
			routeKey: "/projects/terminal-portfolio",
			selectedFile: terminalPortfolioFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
