import { createFileRoute } from "@tanstack/react-router";
import {
	createDirectory,
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";
import { carlGrundbergsComFile } from "./side-projects.carl-grundbergs-com";
import { elprIsFile } from "./side-projects.elpr-is";
import { olEventsFile } from "./side-projects.ol-events";
import { vbcFile } from "./side-projects.vbc";

export const sideProjectsIndexFile = createFile({
	name: "index.md",
	summary: "Selected repositories and personal builds from GitHub.",
	body: markdown([
		"# Side projects",
		"",
		"This directory contains a curated set of GitHub repositories and personal builds.",
		"",
		"Use `cat <file>` to read more.",
	]),
});

export const sideProjectsDirectory = createDirectory({
	name: "side-projects",
	title: "Side Projects",
	route: "/side-projects",
	description: "Experiments, personal builds, and selected side projects.",
	directories: [],
	files: [
		sideProjectsIndexFile,
		elprIsFile,
		olEventsFile,
		vbcFile,
		carlGrundbergsComFile,
	],
});

export const Route = createFileRoute("/side-projects")({
	loader: () =>
		({
			routeKey: "/side-projects",
			directory: sideProjectsDirectory,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
