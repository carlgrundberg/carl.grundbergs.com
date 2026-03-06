import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const analyticsWorkbenchFile = createFile({
	name: "analytics-workbench.md",
	summary:
		"Unified several disconnected reporting tools into one product surface.",
	updated: "2025-06-18",
	route: "/projects/analytics-workbench",
	body: markdown([
		"# Analytics Workbench",
		"",
		"- **Role:** Product and frontend lead",
		"",
		"## Challenge",
		"",
		"Reporting workflows were spread across multiple screens with inconsistent filters, exports, and terminology.",
		"",
		"## What I did",
		"",
		"- designed a shared data exploration model",
		"- simplified advanced filtering without removing power",
		"- coordinated implementation across frontend and backend boundaries",
		"",
		"## Result",
		"",
		"Faster reporting flows, lower training overhead, and a cleaner path for future feature expansion.",
	]),
});

export const Route = createFileRoute("/projects/analytics-workbench")({
	loader: () =>
		({
			routeKey: "/projects/analytics-workbench",
			selectedFile: analyticsWorkbenchFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
