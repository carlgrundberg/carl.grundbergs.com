import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const aboutMeFile = createFile({
	name: "about-me.md",
	summary: "Short profile, strengths, and what kind of work to expect.",
	route: "/about-me",
	body: markdown([
		"# Carl Grundberg",
		"",
		"Programmer focused on building products that feel clear, fast, and dependable.",
		"",
		"I like working on the layer where product thinking, frontend craft, and systems design overlap. The goal is usually the same: reduce complexity for users without hiding the important details from the team maintaining it.",
		"",
		"## Key competences",
		"",
		"- System architecture",
		"- Full stack web developer",
		"- Relational and analytical databases",
		"- Server and serverless hosting",
	]),
});

export const Route = createFileRoute("/about-me")({
	loader: () =>
		({
			routeKey: "/about-me",
			selectedFile: aboutMeFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
