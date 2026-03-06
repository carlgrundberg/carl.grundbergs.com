import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const ctoExtellioFile = createFile({
	name: "cto-extellio.md",
	summary: "CTO role focused on product, engineering direction, and delivery.",
	route: "/work/cto-extellio",
	body: markdown([
		"# CTO at Extellio",
		"",
		"Worked as CTO with responsibility across product development, technical direction, and execution.",
		"",
		"## Focus",
		"",
		"- engineering leadership",
		"- product direction",
		"- architecture and technical decisions",
		"- helping teams move from idea to delivery",
	]),
});

export const Route = createFileRoute("/work/cto-extellio")({
	loader: () =>
		({
			routeKey: "/work/cto-extellio",
			selectedFile: ctoExtellioFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
