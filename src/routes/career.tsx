import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";
import { frontendEngineerFile } from "./career.frontend-engineer";
import { seniorFullstackEngineerFile } from "./career.senior-fullstack-engineer";
import { staffProductEngineerFile } from "./career.staff-product-engineer";

export const careerIndexFile = createFile({
	name: "index.md",
	summary: "Overview of roles, experience areas, and strengths.",
	body: markdown([
		"# Career overview",
		"",
		"I have mostly worked in product engineering environments where ownership extends beyond shipping UI. The work often includes architecture, design collaboration, performance, and making teams faster at delivering changes.",
		"",
		"## Common themes",
		"",
		"- translating complex workflows into usable interfaces",
		"- improving maintainability in fast-moving codebases",
		"- creating systems that make future changes easier",
		"",
		"Files in this directory represent selected roles. Use `cat <file>` to inspect an individual position.",
	]),
});

export const careerDirectory = createDirectory({
	name: "career",
	title: "Career",
	route: "/career",
	description:
		"Professional history, role summaries, and selected impact areas.",
	directories: [],
	files: [
		careerIndexFile,
		staffProductEngineerFile,
		seniorFullstackEngineerFile,
		frontendEngineerFile,
	],
});

export const Route = createFileRoute("/career")({
	loader: () =>
		({
			routeKey: "/career",
			directory: careerDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
