import { aboutMeFile } from "../routes/about-me";
import { contactFile } from "../routes/contact";
import { hobbiesDirectory } from "../routes/hobbies";
import { sideProjectsDirectory } from "../routes/side-projects";
import { workDirectory } from "../routes/work";
import {
	createDirectory,
	type TerminalDirectory,
	type TerminalFile,
	type TerminalListingItem,
	type TerminalView,
} from "./terminalContent";

export type {
	TerminalDirectory,
	TerminalFile,
	TerminalListingItem,
	TerminalView,
} from "./terminalContent";

export const rootDirectory = createDirectory({
	name: "",
	title: "Home",
	route: "/",
	description: "Root directory for the terminal portfolio.",
	directories: [
		workDirectory,
		sideProjectsDirectory,
		hobbiesDirectory,
	],
	files: [aboutMeFile, contactFile],
});

export function formatPromptPath(pathSegments: string[]): string {
	return pathSegments.length === 0 ? "~" : `~/${pathSegments.join("/")}`;
}

export function normalizeInputPath(
	rawInput: string | undefined,
	currentDirectorySegments: string[],
): string[] {
	if (!rawInput || rawInput.trim() === "") {
		return currentDirectorySegments;
	}

	const normalizedInput = rawInput.trim();
	const isHomePath = normalizedInput === "~" || normalizedInput.startsWith("~/");
	const isAbsolute = normalizedInput.startsWith("/") || isHomePath;
	const sourceSegments = isAbsolute ? [] : [...currentDirectorySegments];

	for (const part of normalizedInput.split("/")) {
		if (!part || part === ".") {
			continue;
		}

		if (part === "~") {
			sourceSegments.length = 0;
			continue;
		}

		if (part === "..") {
			sourceSegments.pop();
			continue;
		}

		sourceSegments.push(part);
	}

	return sourceSegments;
}

export function getDirectoryBySegments(
	pathSegments: string[],
): TerminalDirectory | undefined {
	let directory: TerminalDirectory = rootDirectory;

	for (const segment of pathSegments) {
		const nextDirectory = directory.directories.find(
			(item) => item.name === segment,
		);
		if (!nextDirectory) {
			return undefined;
		}

		directory = nextDirectory;
	}

	return directory;
}

export function getFileBySegments(
	pathSegments: string[],
): TerminalFile | undefined {
	if (pathSegments.length === 0) {
		return undefined;
	}

	const directory = getDirectoryBySegments(pathSegments.slice(0, -1));
	if (!directory) {
		return undefined;
	}

	return directory.files.find((file) => file.name === pathSegments.at(-1));
}

export function getListingForDirectory(
	directory: TerminalDirectory,
): TerminalListingItem[] {
	const directoryItems: TerminalListingItem[] = directory.directories.map(
		(item) => ({
			type: "directory",
			name: `${item.name}/`,
			summary: item.description,
			route: item.route,
		}),
	);

	const fileItems: TerminalListingItem[] = directory.files.map((item) => ({
		type: "file",
		name: item.name,
		summary: item.summary,
		route: item.route,
	}));

	return [...directoryItems, ...fileItems];
}

export function getDirectoryRoute(pathSegments: string[]): string | undefined {
	return getDirectoryBySegments(pathSegments)?.route;
}

export function getFileRoute(pathSegments: string[]): string | undefined {
	return getFileBySegments(pathSegments)?.route;
}

export function getViewForPathname(pathname: string): TerminalView {
	const trimmed = pathname.replace(/\/+$/, "");
	const segments = trimmed.split("/").filter(Boolean);

	if (segments.length === 0) {
		return { directory: rootDirectory };
	}

	const topLevelDirectory = getDirectoryBySegments([segments[0]]);
	if (!topLevelDirectory) {
		const rootFileName = `${segments[0]}.md`;
		const selectedFile = rootDirectory.files.find(
			(file) => file.route === trimmed || file.name === rootFileName,
		);
		if (selectedFile) {
			return {
				directory: rootDirectory,
				selectedFile,
			};
		}
	}

	if (!topLevelDirectory) {
		return { directory: rootDirectory };
	}

	if (segments.length === 1) {
		return { directory: topLevelDirectory };
	}

	const fileName = `${segments[1]}.md`;
	const selectedFile = topLevelDirectory.files.find(
		(file) => file.route === trimmed || file.name === fileName,
	);

	return {
		directory: topLevelDirectory,
		selectedFile,
	};
}
