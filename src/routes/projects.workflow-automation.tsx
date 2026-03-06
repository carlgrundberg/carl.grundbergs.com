import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const workflowAutomationFile = createFile({
	name: "workflow-automation.md",
	summary:
		"Reduced manual back-office steps through productized internal tools.",
	updated: "2024-10-09",
	route: "/projects/workflow-automation",
	body: markdown([
		"# Workflow Automation",
		"",
		"- **Type:** Internal operations platform",
		"",
		"## Goal",
		"",
		"Replace repetitive support and operations work with auditable tooling.",
		"",
		"## Contribution",
		"",
		"- mapped high-friction manual processes",
		"- introduced reusable task orchestration patterns",
		"- built interfaces that made automation states visible and trustworthy",
		"",
		"## Impact",
		"",
		"Less manual handling, fewer mistakes, and better operational visibility.",
	]),
});

export const Route = createFileRoute("/projects/workflow-automation")({
	loader: () =>
		({
			routeKey: "/projects/workflow-automation",
			selectedFile: workflowAutomationFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
