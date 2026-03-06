import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { TerminalRouteMatchData } from "../lib/terminalContent";
import {
	formatPromptPath,
	getDirectoryBySegments,
	getDirectoryRoute,
	getFileBySegments,
	getListingForDirectory,
	getViewForPathname,
	normalizeInputPath,
	rootDirectory,
	type TerminalDirectory,
	type TerminalFile,
	type TerminalListingItem,
	type TerminalView,
} from "../lib/terminalFs";
import ThemeToggle from "./ThemeToggle";

type TerminalEntry =
	| {
			id: number;
			type: "command";
			cwd: string;
			value: string;
	  }
	| {
			id: number;
			type: "lines";
			tone?: "default" | "muted" | "error";
			lines: string[];
	  }
	| {
			id: number;
			type: "listing";
			pathLabel: string;
			directorySegments: string[];
			items: TerminalListingItem[];
	  }
	| {
			id: number;
			type: "file";
			pathLabel: string;
			file: TerminalFile;
	  };

type PendingNavigation =
	| {
			type: "directory";
	  }
	| {
			type: "file";
	  };

const HELP_LINES = [
	"Supported commands",
	"help                 show available commands",
	"ls [path]            list folders and files",
	"pwd                  print the current directory",
	"cd <path>            move into a section",
	"cat <file>           read a file",
	"clear                clear the terminal output",
];

export default function TerminalShell() {
	const location = useLocation();
	const matches = useMatches();
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const transcriptRef = useRef<HTMLDivElement>(null);
	const initializedRef = useRef(false);
	const entryIdRef = useRef(0);
	const lastViewKeyRef = useRef<string | null>(null);
	const pendingNavigationRef = useRef<PendingNavigation | null>(null);
	const pendingRootLaunchRef = useRef(false);

	const [entries, setEntries] = useState<TerminalEntry[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState<number | null>(null);
	const [currentHost, setCurrentHost] = useState("domain");
	const [isClosed, setIsClosed] = useState(false);

	const currentView = useMemo(
		() => getViewFromMatches(matches) ?? getViewForPathname(location.pathname),
		[location.pathname, matches],
	);

	const currentDirectorySegments = useMemo(() => {
		return location.pathname
			.replace(/\/+$/, "")
			.split("/")
			.filter(Boolean)
			.slice(0, 1);
	}, [location.pathname]);

	const promptPath = formatPromptPath(currentDirectorySegments);
	const viewKey =
		currentView.selectedFile?.route ?? currentView.directory.route;
	const entryCount = entries.length;
	const terminalIdentity = `anonymous@${currentHost}`;
	const quickCommands = useMemo(
		() =>
			getQuickCommands(
				currentDirectorySegments,
				currentView.directory,
				currentView.selectedFile,
			),
		[currentDirectorySegments, currentView.directory, currentView.selectedFile],
	);

	const nextEntryId = useCallback(() => {
		entryIdRef.current += 1;
		return entryIdRef.current;
	}, []);

	useEffect(() => {
		if (isClosed) {
			return;
		}

		inputRef.current?.focus();
	}, [isClosed]);

	useEffect(() => {
		setCurrentHost(getCurrentHost());
	}, []);

	useEffect(() => {
		if (isClosed) {
			return;
		}

		if (entryCount === 0) {
			return;
		}

		transcriptRef.current?.scrollTo({
			top: transcriptRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, [entryCount, isClosed]);

	useEffect(() => {
		if (pendingRootLaunchRef.current && viewKey !== "/") {
			return;
		}

		if (!initializedRef.current) {
			initializedRef.current = true;
			const initialView = pendingRootLaunchRef.current
				? getViewForPathname("/")
				: currentView;
			lastViewKeyRef.current =
				initialView.selectedFile?.route ?? initialView.directory.route;
			pendingRootLaunchRef.current = false;
			setEntries(createInitialEntries(initialView, nextEntryId));
			return;
		}

		if (lastViewKeyRef.current === viewKey) {
			return;
		}

		lastViewKeyRef.current = viewKey;

		setEntries((previous) => [
			...previous,
			...createViewEntries(
				currentView,
				pendingNavigationRef.current,
				nextEntryId,
			),
		]);

		pendingNavigationRef.current = null;
	}, [currentView, nextEntryId, viewKey]);

	function appendEntries(newEntries: TerminalEntry[]) {
		setEntries((previous) => [...previous, ...newEntries]);
	}

	function appendCommand(value: string) {
		appendEntries([
			{
				id: nextEntryId(),
				type: "command",
				cwd: promptPath,
				value,
			},
		]);
	}

	function appendError(value: string, message: string) {
		appendEntries([
			{
				id: nextEntryId(),
				type: "command",
				cwd: promptPath,
				value,
			},
			{
				id: nextEntryId(),
				type: "lines",
				tone: "error",
				lines: [message],
			},
		]);
	}

	function executeCommand(rawValue: string) {
		const trimmed = rawValue.trim();
		if (!trimmed) {
			return;
		}

		const [command, ...rest] = trimmed.split(/\s+/);
		const argument = rest.join(" ");

		switch (command) {
			case "help": {
				appendEntries([
					{
						id: nextEntryId(),
						type: "command",
						cwd: promptPath,
						value: trimmed,
					},
					{
						id: nextEntryId(),
						type: "lines",
						lines: HELP_LINES,
					},
				]);
				return;
			}
			case "pwd": {
				appendEntries([
					{
						id: nextEntryId(),
						type: "command",
						cwd: promptPath,
						value: trimmed,
					},
					{
						id: nextEntryId(),
						type: "lines",
						lines: [promptPath],
					},
				]);
				return;
			}
			case "clear": {
				setEntries([]);
				return;
			}
			case "ls": {
				const targetSegments = normalizeInputPath(
					argument,
					currentDirectorySegments,
				);
				const directory = getDirectoryBySegments(targetSegments);
				const file = getFileBySegments(targetSegments);

				if (directory) {
					appendEntries([
						{
							id: nextEntryId(),
							type: "command",
							cwd: promptPath,
							value: trimmed,
						},
						{
							id: nextEntryId(),
							type: "listing",
							pathLabel: formatPromptPath(targetSegments),
							directorySegments: targetSegments,
							items: getListingForDirectory(directory),
						},
					]);
					return;
				}

				if (file) {
					appendEntries([
						{
							id: nextEntryId(),
							type: "command",
							cwd: promptPath,
							value: trimmed,
						},
						{
							id: nextEntryId(),
							type: "lines",
							tone: "muted",
							lines: [file.name],
						},
					]);
					return;
				}

				appendError(
					trimmed,
					`ls: cannot access '${argument || "."}': No such file or directory`,
				);
				return;
			}
			case "cd": {
				const targetSegments = normalizeInputPath(
					argument || "/",
					currentDirectorySegments,
				);
				const targetRoute = getDirectoryRoute(targetSegments);

				if (!targetRoute) {
					appendError(
						trimmed,
						`cd: no such file or directory: ${argument || "/"}`,
					);
					return;
				}

				appendCommand(trimmed);

				if (targetRoute === viewKey && !currentView.selectedFile) {
					appendEntries(
						createViewEntries(currentView, { type: "directory" }, nextEntryId),
					);
					return;
				}

				pendingNavigationRef.current = { type: "directory" };
				void navigate({ to: targetRoute });
				return;
			}
			case "cat": {
				if (!argument) {
					appendError(trimmed, "cat: missing file operand");
					return;
				}

				const targetSegments = normalizeInputPath(
					argument,
					currentDirectorySegments,
				);
				const file = getFileBySegments(targetSegments);

				if (!file) {
					appendError(trimmed, `cat: ${argument}: No such file`);
					return;
				}

				appendCommand(trimmed);

				if (file.route && file.route !== viewKey) {
					pendingNavigationRef.current = { type: "file" };
					void navigate({ to: file.route });
					return;
				}

				appendEntries([
					{
						id: nextEntryId(),
						type: "file",
						pathLabel: formatPromptPath(targetSegments.slice(0, -1)),
						file,
					},
				]);
				return;
			}
			default: {
				appendError(trimmed, `command not found: ${command}`);
			}
		}
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmed = inputValue.trim();
		if (!trimmed) {
			return;
		}

		executeCommand(trimmed);
		setCommandHistory((previous) => [...previous, trimmed]);
		setHistoryIndex(null);
		setInputValue("");
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "ArrowUp") {
			if (commandHistory.length === 0) {
				return;
			}

			event.preventDefault();
			const nextIndex =
				historyIndex === null
					? commandHistory.length - 1
					: Math.max(0, historyIndex - 1);

			setHistoryIndex(nextIndex);
			setInputValue(commandHistory[nextIndex] ?? "");
			return;
		}

		if (event.key === "ArrowDown") {
			if (commandHistory.length === 0 || historyIndex === null) {
				return;
			}

			event.preventDefault();

			if (historyIndex >= commandHistory.length - 1) {
				setHistoryIndex(null);
				setInputValue("");
				return;
			}

			const nextIndex = historyIndex + 1;
			setHistoryIndex(nextIndex);
			setInputValue(commandHistory[nextIndex] ?? "");
		}
	}

	function handleClose() {
		entryIdRef.current = 0;
		lastViewKeyRef.current = null;
		pendingNavigationRef.current = null;
		pendingRootLaunchRef.current = false;
		initializedRef.current = false;

		setEntries([]);
		setInputValue("");
		setCommandHistory([]);
		setHistoryIndex(null);
		setIsClosed(true);
	}

	function handleOpenFromShortcut() {
		pendingRootLaunchRef.current = true;
		setIsClosed(false);
		void navigate({ to: "/" });
	}

	if (isClosed) {
		return (
			<main className="terminal-page terminal-page-closed">
				<button
					type="button"
					className="terminal-shortcut"
					onClick={handleOpenFromShortcut}
					aria-label="Open terminal"
					title="Open terminal"
				>
					<span className="terminal-shortcut-icon" aria-hidden="true">
						&gt;_
					</span>
					<span className="terminal-shortcut-label">Terminal</span>
				</button>
			</main>
		);
	}

	return (
		<main className="terminal-page">
			<section className="terminal-window">
				<header className="terminal-titlebar">
					<div className="terminal-app-frame">
						<span className="terminal-app-icon" aria-hidden="true">
							&gt;_
						</span>
						<div className="terminal-title-group">
							<p className="terminal-title">Carl Grundberg</p>
						</div>
					</div>
					<ThemeToggle />
					<div className="terminal-window-controls">
						<button
							type="button"
							className="terminal-window-control"
							onClick={handleClose}
							aria-label="Close terminal window"
							title="Close"
						>
							<X size={14} />
						</button>
					</div>
				</header>

				<div ref={transcriptRef} className="terminal-transcript">
					{entries.map((entry) => {
						if (entry.type === "command") {
							return (
								<div key={entry.id} className="terminal-command">
									<span className="terminal-prompt" suppressHydrationWarning>
										{terminalIdentity}
									</span>
									<span className="terminal-prompt-path">{entry.cwd}</span>
									<span className="terminal-prompt-symbol">$</span>
									<span>{entry.value}</span>
								</div>
							);
						}

						if (entry.type === "listing") {
							return (
								<section key={entry.id} className="terminal-block">
									<div className="terminal-section-label">
										contents of {entry.pathLabel}
									</div>
									<div className="terminal-listing-grid">
										{entry.items.map((item) => (
											<button
												key={`${entry.id}-${item.name}`}
												type="button"
												className={`terminal-listing-item is-${item.type}`}
												onClick={() =>
													executeCommand(
														item.type === "directory"
															? `cd ${getClickCommandPath(
																	currentDirectorySegments,
																	entry.directorySegments,
																	item.name.replace(/\/$/, ""),
																)}`
															: `cat ${getClickCommandPath(
																	currentDirectorySegments,
																	entry.directorySegments,
																	item.name,
																)}`,
													)
												}
											>
												<span className="terminal-listing-name">
													{item.name}
												</span>
												<span className="terminal-listing-summary">
													{item.summary}
												</span>
											</button>
										))}
									</div>
								</section>
							);
						}

						if (entry.type === "file") {
							return (
								<section
									key={entry.id}
									className="terminal-block terminal-file-block"
								>
									<div className="terminal-section-label">
										{entry.pathLabel}/{entry.file.name}
									</div>
									<div className="terminal-markdown">
										<ReactMarkdown>{entry.file.body}</ReactMarkdown>
									</div>
								</section>
							);
						}

						return (
							<pre
								key={entry.id}
								className={`terminal-pre${entry.tone ? ` is-${entry.tone}` : ""}`}
							>
								{entry.lines.join("\n")}
							</pre>
						);
					})}
				</div>

				<div className="terminal-quick-actions">
					{quickCommands.map((command) => (
						<button
							key={command}
							type="button"
							className="terminal-chip"
							onClick={() => executeCommand(command)}
						>
							{command}
						</button>
					))}
				</div>

				<form className="terminal-input-row" onSubmit={handleSubmit}>
					<label className="sr-only" htmlFor="terminal-command-input">
						Terminal command input
					</label>
					<span className="terminal-prompt" suppressHydrationWarning>
						{terminalIdentity}
					</span>
					<span className="terminal-prompt-path">{promptPath}</span>
					<span className="terminal-prompt-symbol">$</span>
					<input
						ref={inputRef}
						id="terminal-command-input"
						className="terminal-input"
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						spellCheck={false}
						value={inputValue}
						onChange={(event) => setInputValue(event.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="enter a command"
					/>
				</form>
			</section>
		</main>
	);
}

function createInitialEntries(
	view: ReturnType<typeof getViewForPathname>,
	nextId: () => number,
): TerminalEntry[] {
	const linesEntry: TerminalEntry = {
		id: nextId(),
		type: "lines",
		tone: "muted",
		lines: createWelcomeLines(),
	};

	return [linesEntry, ...createViewEntries(view, null, nextId)];
}

function createViewEntries(
	view: ReturnType<typeof getViewForPathname>,
	_pendingNavigation: PendingNavigation | null,
	nextId: () => number,
): TerminalEntry[] {
	if (view.selectedFile) {
		return [
			{
				id: nextId(),
				type: "file",
				pathLabel: formatPromptPath([view.directory.name]),
				file: view.selectedFile,
			},
		];
	}

	return [];
}

function getClickCommandPath(
	currentDirectorySegments: string[],
	baseSegments: string[],
	itemName: string,
) {
	if (arePathSegmentsEqual(currentDirectorySegments, baseSegments)) {
		return itemName;
	}

	const absolutePath = [...baseSegments, itemName].filter(Boolean).join("/");
	return `/${absolutePath}`;
}

function arePathSegmentsEqual(left: string[], right: string[]) {
	if (left.length !== right.length) {
		return false;
	}

	return left.every((segment, index) => segment === right[index]);
}

function getQuickCommands(
	currentDirectorySegments: string[],
	directory: TerminalDirectory,
	selectedFile: TerminalFile | undefined,
) {
	const commands = ["help", "ls"];

	if (currentDirectorySegments.length > 0) {
		commands.push("pwd", "cd ..");
	}

	const directoryCommands = directory.directories
		.slice(0, 3)
		.map((item) => `cd ${item.name}`);
	const fileCommands = directory.files
		.slice(0, 3)
		.map((item) => `cat ${item.name}`);

	if (selectedFile) {
		commands.push(`cat ${selectedFile.name}`);
	} else if (currentDirectorySegments.length === 0) {
		commands.push(...directoryCommands, ...fileCommands);
	} else {
		commands.push(...fileCommands, ...directoryCommands);
	}

	return Array.from(new Set(commands)).slice(0, 6);
}

function getCurrentHost() {
	if (typeof window === "undefined") {
		return "domain";
	}

	return window.location.hostname || "domain";
}

function createWelcomeLines() {
	const homeIndexFile = rootDirectory.files.find((file) => file.name === "index.md");
	if (!homeIndexFile) {
		return ["Welcome.", "Type help to list commands."];
	}

	const contentLines = homeIndexFile.body
		.split("\n")
		.map((line) => line.replace(/^#+\s*/, "").trim())
		.filter(Boolean);

	return [
		"Last login: today on tty1",
		"",
		...contentLines,
		"",
		"Type help to list commands.",
	];
}

function getViewFromMatches(
	matches: ReadonlyArray<{ loaderData?: unknown }>,
): TerminalView | undefined {
	let directory: TerminalDirectory | undefined;
	let selectedFile: TerminalFile | undefined;

	for (const match of matches) {
		if (!isTerminalRouteMatchData(match.loaderData)) {
			continue;
		}

		if (match.loaderData.directory) {
			directory = match.loaderData.directory;
		}

		if (match.loaderData.selectedFile) {
			selectedFile = match.loaderData.selectedFile;
		}
	}

	if (!directory) {
		return undefined;
	}

	return {
		directory,
		selectedFile,
	};
}

function isTerminalRouteMatchData(
	value: unknown,
): value is TerminalRouteMatchData {
	if (!value || typeof value !== "object") {
		return false;
	}

	return "routeKey" in value && typeof value.routeKey === "string";
}
