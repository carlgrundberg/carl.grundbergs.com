import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const contactFile = createFile({
	name: "contact.md",
	summary: "Ways to reach out and open an issue on this website repository.",
	route: "/contact",
	body: markdown([
		"# Contact",
		"",
		"The easiest way to leave feedback about this website is through the repository issues page:",
		"",
		"- [github.com/carlgrundberg/carl.grundbergs.com/issues](https://github.com/carlgrundberg/carl.grundbergs.com/issues)",
	]),
});

export const Route = createFileRoute("/contact")({
	loader: () =>
		({
			routeKey: "/contact",
			selectedFile: contactFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
