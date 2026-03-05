export type TerminalFile = {
	name: string;
	title: string;
	summary: string;
	body: string;
	updated: string;
	route?: string;
};

export type TerminalDirectory = {
	name: string;
	title: string;
	route: string;
	description: string;
	directories: TerminalDirectory[];
	files: TerminalFile[];
};

export type TerminalListingItem =
	| {
			type: "directory";
			name: string;
			summary: string;
			route: string;
	  }
	| {
			type: "file";
			name: string;
			summary: string;
			route?: string;
	  };

export type TerminalView = {
	directory: TerminalDirectory;
	selectedFile?: TerminalFile;
};

function createFile(file: TerminalFile): TerminalFile {
	return file;
}

function createDirectory(directory: TerminalDirectory): TerminalDirectory {
	return directory;
}

function markdown(lines: string[]): string {
	return lines.join("\n");
}

const aboutDirectory = createDirectory({
	name: "about",
	title: "About",
	route: "/about",
	description:
		"Background, working style, and how this portfolio is structured.",
	directories: [],
	files: [
		createFile({
			name: "index.md",
			title: "About Carl",
			summary: "Short profile, strengths, and what kind of work to expect.",
			updated: "2026-03-05",
			body: markdown([
				"# Carl Grundberg",
				"",
				"Programmer focused on building products that feel clear, fast, and dependable.",
				"",
				"I like working on the layer where product thinking, frontend craft, and systems design overlap. The goal is usually the same: reduce complexity for users without hiding the important details from the team maintaining it.",
				"",
				"## Current interests",
				"",
				"- developer experience",
				"- internal tools that remove repeated work",
				"- resilient frontend architecture",
				"- product interfaces that explain themselves",
				"",
				"> This site is intentionally structured like a filesystem. Use `cd` to move between sections and `cat` to read Markdown files.",
			]),
		}),
	],
});

const careerDirectory = createDirectory({
	name: "career",
	title: "Career",
	route: "/career",
	description:
		"Professional history, role summaries, and selected impact areas.",
	directories: [],
	files: [
		createFile({
			name: "index.md",
			title: "Career Index",
			summary: "Overview of roles, experience areas, and strengths.",
			updated: "2026-03-05",
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
		}),
		createFile({
			name: "staff-product-engineer.md",
			title: "Staff Product Engineer",
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
		}),
		createFile({
			name: "senior-fullstack-engineer.md",
			title: "Senior Fullstack Engineer",
			summary: "Owned user-facing flows and the supporting APIs behind them.",
			updated: "2023-08-01",
			route: "/career/senior-fullstack-engineer",
			body: markdown([
				"# Senior Fullstack Engineer",
				"",
				"- **Company:** Example SaaS Team",
				"- **Dates:** 2020 - 2023",
				"",
				"## Highlights",
				"",
				"- Built and maintained business-critical onboarding and reporting flows.",
				"- Improved delivery confidence through better test coverage and clearer boundaries.",
				"- Reduced support load by replacing hidden system behavior with visible feedback.",
				"",
				"## Stack",
				"",
				"- React",
				"- TypeScript",
				"- Node.js",
				"- PostgreSQL",
			]),
		}),
		createFile({
			name: "frontend-engineer.md",
			title: "Frontend Engineer",
			summary:
				"Built polished interfaces and performance-sensitive user journeys.",
			updated: "2020-02-14",
			route: "/career/frontend-engineer",
			body: markdown([
				"# Frontend Engineer",
				"",
				"- **Company:** Example Digital Product Studio",
				"- **Dates:** 2017 - 2020",
				"",
				"## Highlights",
				"",
				"- Delivered production React interfaces for multiple client products.",
				"- Worked closely with designers to turn visual systems into reusable components.",
				"- Optimized bundle size, render performance, and perceived responsiveness.",
			]),
		}),
	],
});

const projectsDirectory = createDirectory({
	name: "projects",
	title: "Projects",
	route: "/projects",
	description: "Selected work, project summaries, and implementation notes.",
	directories: [],
	files: [
		createFile({
			name: "index.md",
			title: "Project Index",
			summary: "High-level list of selected projects and what they solved.",
			updated: "2026-03-05",
			body: markdown([
				"# Selected projects",
				"",
				"This directory contains a few representative case-study style files. Each one summarizes the problem, the approach, and the outcome.",
				"",
				"Use `cat <file>` to read more.",
			]),
		}),
		createFile({
			name: "terminal-portfolio.md",
			title: "Terminal Portfolio",
			summary: "A route-backed personal site that behaves like a Linux shell.",
			updated: "2026-03-05",
			route: "/projects/terminal-portfolio",
			body: markdown([
				"# Terminal Portfolio",
				"",
				"- **Type:** Personal website experiment",
				"",
				"## Problem",
				"",
				"Most developer portfolios explain technical identity but do not express it.",
				"",
				"## Approach",
				"",
				"- model content as folders and files",
				"- map shell commands to real routes",
				"- make the interface feel like a modern terminal, not a gimmick",
				"",
				"## Outcome",
				"",
				"A portfolio that is more memorable, more exploratory, and more aligned with how I actually like to work.",
			]),
		}),
		createFile({
			name: "analytics-workbench.md",
			title: "Analytics Workbench",
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
		}),
		createFile({
			name: "workflow-automation.md",
			title: "Workflow Automation",
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
		}),
	],
});

const contactDirectory = createDirectory({
	name: "contact",
	title: "Contact",
	route: "/contact",
	description: "Ways to reach out, collaborate, or continue the conversation.",
	directories: [],
	files: [
		createFile({
			name: "index.md",
			title: "Contact",
			summary: "Preferred contact channels and collaboration notes.",
			updated: "2026-03-05",
			body: markdown([
				"# Contact",
				"",
				"Best for project discussions or opportunities:",
				"",
				"- email: [hello@carlgrundbergs.com](mailto:hello@carlgrundbergs.com)",
				"- github: [github.com/your-handle](https://github.com/your-handle)",
				"- linkedin: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)",
				"",
				"I am most interested in product engineering, frontend-heavy roles, and teams that care about usability as much as code quality.",
				"",
				"> Replace the placeholder profile URLs with real ones before launch.",
			]),
		}),
	],
});

export const rootDirectory = createDirectory({
	name: "",
	title: "Home",
	route: "/",
	description: "Root directory for the terminal portfolio.",
	directories: [
		aboutDirectory,
		careerDirectory,
		projectsDirectory,
		contactDirectory,
	],
	files: [
		createFile({
			name: "README.md",
			title: "Welcome",
			summary: "Quick guide for exploring the portfolio from the shell.",
			updated: "2026-03-05",
			body: markdown([
				"# Welcome",
				"",
				"Welcome to the portfolio terminal.",
				"",
				"## Suggested commands",
				"",
				"- `help`",
				"- `ls`",
				"- `cd about`",
				"- `cd career`",
				"- `cat README.md`",
				"- `cat projects/terminal-portfolio.md`",
				"",
				"Everything on the site is organized as directories and Markdown files.",
			]),
		}),
	],
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

	const isAbsolute = rawInput.startsWith("/");
	const sourceSegments = isAbsolute ? [] : [...currentDirectorySegments];

	for (const part of rawInput.split("/")) {
		if (!part || part === ".") {
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
