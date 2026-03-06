import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const vbcFile = createFile({
	name: "vbc.md",
	summary: "A TypeScript app with MongoDB, local storage, and Docker-based local setup.",
	route: "/side-projects/vbc",
	body: markdown([
		"# vbc",
		"",
		"- **Repository:** [github.com/carlgrundberg/vbc](https://github.com/carlgrundberg/vbc)",
		"- **Stack:** TypeScript, MongoDB, Docker, Next.js",
		"",
		"## Notes",
		"",
		"The repository describes itself as a blank starting point, but the structure suggests a fuller application setup with Docker, storage configuration, and a MongoDB-backed data model.",
		"",
		"It looks like a practical project scaffold or internal app foundation rather than a purely experimental demo.",
	]),
});

export const Route = createFileRoute("/side-projects/vbc")({
	loader: () =>
		({
			routeKey: "/side-projects/vbc",
			selectedFile: vbcFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
