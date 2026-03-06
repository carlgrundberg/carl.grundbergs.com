import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const frontendDeveloperHittahemFile = createFile({
	name: "frontend-developer-hittahem.md",
	summary: "Frontend development role focused on product experience and UI implementation.",
	route: "/work/frontend-developer-hittahem",
	body: markdown([
		"# Frontend Developer at HittaHem",
		"",
		"Worked on frontend development with focus on building product interfaces and improving the user experience.",
		"",
		"## Focus",
		"",
		"- frontend implementation",
		"- product UI",
		"- usability and interaction details",
		"- maintainable interface code",
	]),
});

export const Route = createFileRoute("/work/frontend-developer-hittahem")({
	loader: () =>
		({
			routeKey: "/work/frontend-developer-hittahem",
			selectedFile: frontendDeveloperHittahemFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
