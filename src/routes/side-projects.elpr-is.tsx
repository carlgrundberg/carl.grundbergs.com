import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const elprIsFile = createFile({
	name: "elpr-is.md",
	summary: "An older Next.js project with components, pages, and Prisma-backed structure.",
	route: "/side-projects/elpr-is",
	body: markdown([
		"# elpr.is",
		"",
		"- **Repository:** [github.com/carlgrundberg/elpr.is](https://github.com/carlgrundberg/elpr.is)",
		"- **Stack:** Next.js, JavaScript, CSS, Prisma",
		"",
		"## Notes",
		"",
		"This project looks like an earlier personal or product site built on the classic Next.js pages router structure.",
		"",
		"It includes `components`, `pages`, `lib`, `prisma`, `public`, and `styles`, which suggests a full-stack app shape rather than a simple static site.",
	]),
});

export const Route = createFileRoute("/side-projects/elpr-is")({
	loader: () =>
		({
			routeKey: "/side-projects/elpr-is",
			selectedFile: elprIsFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
