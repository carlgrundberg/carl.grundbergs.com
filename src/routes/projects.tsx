import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";
import { analyticsWorkbenchFile } from "./projects.analytics-workbench";
import { terminalPortfolioFile } from "./projects.terminal-portfolio";
import { workflowAutomationFile } from "./projects.workflow-automation";

export const projectsIndexFile = createFile({
	name: "index.md",
	summary: "High-level list of selected projects and what they solved.",
	body: markdown([
		"# Selected projects",
		"",
		"This directory contains a few representative case-study style files. Each one summarizes the problem, the approach, and the outcome.",
		"",
		"Use `cat <file>` to read more.",
	]),
});

export const projectsDirectory = createDirectory({
	name: "projects",
	title: "Projects",
	route: "/projects",
	description: "Selected work, project summaries, and implementation notes.",
	directories: [],
	files: [
		projectsIndexFile,
		terminalPortfolioFile,
		analyticsWorkbenchFile,
		workflowAutomationFile,
	],
});

export const Route = createFileRoute("/projects")({
	loader: () =>
		({
			routeKey: "/projects",
			directory: projectsDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
