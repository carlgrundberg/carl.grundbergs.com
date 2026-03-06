import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const staffProductEngineerFile = createFile({
	name: "staff-product-engineer.md",
	summary:
		"Led product direction and frontend architecture for a B2B platform.",
	updated: "2025-11-12",
	route: "/career/staff-product-engineer",
	body: markdown([
		"# Staff Product Engineer",
		"",
		"- **Company:** Example Platform Co.",
		"- **Dates:** 2023 - present",
		"",
		"## Highlights",
		"",
		"- Reworked a fragmented admin experience into a coherent workflow-driven UI.",
		"- Introduced a shared component and state model that reduced duplicate logic.",
		"- Partnered with product and design to ship features with tighter feedback loops.",
		"",
		"## Focus areas",
		"",
		"- frontend architecture",
		"- design systems",
		"- product discovery",
		"- mentoring and technical direction",
	]),
});

export const Route = createFileRoute("/career/staff-product-engineer")({
	loader: () =>
		({
			routeKey: "/career/staff-product-engineer",
			selectedFile: staffProductEngineerFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
