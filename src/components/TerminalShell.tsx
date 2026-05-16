import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { ListTree, ListX, X } from "lucide-react";
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
	type TerminalDirectory,
	type TerminalFile,
	type TerminalListingItem,
	type TerminalView,
} from "../lib/terminalFs";
import { HOME_LOGIN_MESSAGE_LINES } from "../routes/index";
import type { ThemeMode } from "../lib/themeMode";
import {
	applyThemeMode,
	cycleThemeMode,
	getInitialThemeMode,
} from "../lib/themeMode";
import ThemeToggle from "./ThemeToggle";

type HelpRow =
	| { kind: "title"; text: string }
	| {
			kind: "command";
			run: string;
			label: string;
			description: string;
	  };

type TerminalEntry =
	| {
			id: number;
			type: "command";
			cwd: string;
			value: string;
	  }
	| {
			id: number;
			type: "help";
			rows: HelpRow[];
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

function describeThemeToggleAction(mode: ThemeMode): string {
	switch (cycleThemeMode(mode)) {
		case "light":
			return "Switch to light theme";
		case "dark":
			return "Switch to dark theme";
		default:
			return "Follow system light or dark theme";
	}
}

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
	const [isCompactLayout, setIsCompactLayout] = useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia("(max-width: 768px)").matches,
	);
	const [autoLs, setAutoLs] = useState(() => getInitialAutoLs());
	const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
		getInitialThemeMode(),
	);

	const themeCycleCommand = useMemo(
		() => `theme ${cycleThemeMode(themeMode)}`,
		[themeMode],
	);

	const currentView = useMemo(
		() => getViewFromMatches(matches) ?? getViewForPathname(location.pathname),
		[location.pathname, matches],
	);

	const currentDirectorySegments = useMemo(() => {
		return currentView.directory.name ? [currentView.directory.name] : [];
	}, [currentView]);

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

	const locationCrumbs = useMemo(
		() => buildLocationCrumbs(currentView),
		[currentView],
	);

	const nextEntryId = useCallback(() => {
		entryIdRef.current += 1;
		return entryIdRef.current;
	}, []);

	useEffect(() => {
		applyThemeMode(themeMode);
		if (typeof window !== "undefined") {
			window.localStorage.setItem("theme", themeMode);
		}
	}, [themeMode]);

	useEffect(() => {
		if (themeMode !== "auto") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			applyThemeMode("auto");
		};

		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [themeMode]);

	useEffect(() => {
		if (isClosed) {
			return;
		}

		if (isCompactLayout) {
			return;
		}

		inputRef.current?.focus();
	}, [isClosed, isCompactLayout]);

	useEffect(() => {
		setCurrentHost(getCurrentHost());
	}, []);

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 768px)");
		function update() {
			setIsCompactLayout(mq.matches);
		}

		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
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
			setEntries(createInitialEntries(initialView, nextEntryId, autoLs));
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
				autoLs,
			),
		]);

		pendingNavigationRef.current = null;
	}, [autoLs, currentView, nextEntryId, viewKey]);

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
						type: "help",
						rows: buildHelpRows(
							currentDirectorySegments,
							currentView.directory,
						),
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
			case "exit": {
				appendCommand(trimmed);
				handleClose();
				return;
			}
			case "theme": {
				const sub = argument.trim().toLowerCase();
				if (sub !== "light" && sub !== "dark" && sub !== "auto") {
					appendError(
						trimmed,
						"theme: usage: theme light | theme dark | theme auto",
					);
					return;
				}

				const confirm =
					sub === "auto"
						? "Theme: auto (follows system light/dark)."
						: `Theme: ${sub}.`;
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
						lines: [confirm],
					},
				]);
				setThemeMode(sub as ThemeMode);
				return;
			}
			case "autols": {
				const sub = argument.trim().toLowerCase();
				if (sub === "on" || sub === "true" || sub === "1") {
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
							lines: ["Auto-list on folder change: on."],
						},
					]);
					setAutoLs(true);
					persistTerminalAutoLs(true);
					return;
				}
				if (sub === "off" || sub === "false" || sub === "0") {
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
							lines: ["Auto-list on folder change: off."],
						},
					]);
					setAutoLs(false);
					persistTerminalAutoLs(false);
					return;
				}
				if (!sub) {
					const next = !autoLs;
					const canonical = `autols ${next ? "on" : "off"}`;
					appendEntries([
						{
							id: nextEntryId(),
							type: "command",
							cwd: promptPath,
							value: canonical,
						},
						{
							id: nextEntryId(),
							type: "lines",
							tone: "muted",
							lines: [
								next
									? "Auto-list on folder change: on."
									: "Auto-list on folder change: off.",
							],
						},
					]);
					setAutoLs(next);
					persistTerminalAutoLs(next);
					return;
				}

				appendError(trimmed, "autols: usage: autols on | autols off");
				return;
			}
			case "uptime": {
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
						lines: [getUptimeLine()],
					},
				]);
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
						createViewEntries(
							currentView,
							{ type: "directory" },
							nextEntryId,
							autoLs,
						),
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

	function runTerminalCommand(rawValue: string) {
		const trimmed = rawValue.trim();
		if (!trimmed) {
			return;
		}

		executeCommand(trimmed);
		setCommandHistory((previous) => [...previous, trimmed]);
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmed = inputValue.trim();
		if (!trimmed) {
			return;
		}

		runTerminalCommand(trimmed);
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
					<div className="terminal-titlebar-tools">
						<button
							type="button"
							className={`terminal-auto-ls-toggle${autoLs ? "" : " is-off"}`}
							onClick={() =>
								runTerminalCommand(`autols ${autoLs ? "off" : "on"}`)
							}
							aria-pressed={autoLs}
							title={
								autoLs
									? "Turn off auto list on folder change"
									: "Turn on auto list on folder change"
							}
							aria-label={
								autoLs
									? "Turn off auto list on folder change"
									: "Turn on auto list on folder change"
							}
						>
							{autoLs ? (
								<ListTree size={16} aria-hidden="true" />
							) : (
								<ListX size={16} aria-hidden="true" />
							)}
						</button>
						<ThemeToggle
							mode={themeMode}
							label={describeThemeToggleAction(themeMode)}
							onCycle={() => runTerminalCommand(themeCycleCommand)}
						/>
					</div>
					<div className="terminal-window-controls">
						<button
							type="button"
							className="terminal-window-control"
							onClick={() => runTerminalCommand("exit")}
							aria-label="Close the terminal"
							title="Close the terminal"
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
								<section key={entry.id} className="terminal-listing-block">
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

						if (entry.type === "help") {
							return (
								<div
									key={entry.id}
									className="terminal-help"
									role="region"
									aria-label="Supported commands"
								>
									{entry.rows.map((row, index) => {
										if (row.kind === "title") {
											return (
												<p
													key={`title-${entry.id}-${index}`}
													className="terminal-help-title"
												>
													{row.text}
												</p>
											);
										}

										return (
											<div
												key={`cmd-${entry.id}-${index}`}
												className="terminal-help-row"
											>
												<button
													type="button"
													className="terminal-help-cmd"
													onClick={() => executeCommand(row.run)}
													title={row.description}
													aria-label={row.description}
												>
													{row.label}
												</button>
												<span className="terminal-help-desc">
													{row.description}
												</span>
											</div>
										);
									})}
								</div>
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

				<nav
					className="terminal-location-nav"
					aria-label="Current location"
				>
					<ol className="terminal-breadcrumb">
						{locationCrumbs.map((crumb, index) => {
							const isLast = index === locationCrumbs.length - 1;
							return (
								<li key={`${index}-${crumb.label}`}>
									{isLast ? (
										<span
											className="terminal-breadcrumb-current"
											aria-current="page"
										>
											{crumb.label}
										</span>
									) : (
										<button
											type="button"
											className="terminal-breadcrumb-link"
											onClick={() =>
												crumb.to && void navigate({ to: crumb.to })
											}
										>
											{crumb.label}
										</button>
									)}
								</li>
							);
						})}
					</ol>
				</nav>

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
	autoLs: boolean,
): TerminalEntry[] {
	const linesEntry: TerminalEntry = {
		id: nextId(),
		type: "lines",
		tone: "muted",
		lines: createWelcomeLines(),
	};

	return [linesEntry, ...createViewEntries(view, null, nextId, autoLs)];
}

function createViewEntries(
	view: ReturnType<typeof getViewForPathname>,
	_pendingNavigation: PendingNavigation | null,
	nextId: () => number,
	autoLs: boolean,
): TerminalEntry[] {
	if (view.selectedFile) {
		const directorySegments = view.directory.name ? [view.directory.name] : [];
		return [
			{
				id: nextId(),
				type: "file",
				pathLabel: formatPromptPath(directorySegments),
				file: view.selectedFile,
			},
		];
	}

	if (!autoLs) {
		return [];
	}

	const directorySegments = view.directory.name ? [view.directory.name] : [];
	const cwd = formatPromptPath(directorySegments);
	return [
		{
			id: nextId(),
			type: "command",
			cwd,
			value: "ls",
		},
		{
			id: nextId(),
			type: "listing",
			pathLabel: cwd,
			directorySegments,
			items: getListingForDirectory(view.directory),
		},
	];
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

function buildHelpRows(
	currentDirectorySegments: string[],
	directory: TerminalDirectory,
): HelpRow[] {
	const cdExample =
		currentDirectorySegments.length > 0
			? "cd .."
			: directory.directories[0]
				? `cd ${directory.directories[0].name}`
				: "cd /";

	const nonIndexFiles = directory.files.filter((f) => f.name !== "index.md");
	const pick =
		nonIndexFiles[0] ?? directory.files[0] ?? { name: "about-me.md" };
	const catExample = `cat ${pick.name}`;

	return [
		{ kind: "title", text: "Supported commands" },
		{
			kind: "command",
			run: "help",
			label: "help",
			description: "show available commands",
		},
		{
			kind: "command",
			run: "ls",
			label: "ls [path]",
			description: "list folders and files",
		},
		{
			kind: "command",
			run: "pwd",
			label: "pwd",
			description: "print the current directory",
		},
		{
			kind: "command",
			run: cdExample,
			label: "cd <path>",
			description: "move into a section",
		},
		{
			kind: "command",
			run: catExample,
			label: "cat <file>",
			description: "read a file",
		},
		{
			kind: "command",
			run: "uptime",
			label: "uptime",
			description: "show Carl uptime",
		},
		{
			kind: "command",
			run: "theme auto",
			label: "theme light|dark|auto",
			description: "set color theme",
		},
		{
			kind: "command",
			run: "autols on",
			label: "autols on|off",
			description: "auto-run ls when the folder changes",
		},
		{
			kind: "command",
			run: "clear",
			label: "clear",
			description: "clear the terminal output",
		},
		{
			kind: "command",
			run: "exit",
			label: "exit",
			description: "close the terminal",
		},
	];
}

function formatFileBreadcrumbLabel(file: TerminalFile): string {
	const base = file.name.replace(/\.md$/i, "");
	if (base === "index") {
		return "Overview";
	}

	return base
		.split("-")
		.filter(Boolean)
		.map(
			(part) =>
				part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
		)
		.join(" ");
}

function buildLocationCrumbs(
	view: TerminalView,
): { label: string; to?: string }[] {
	const crumbs: { label: string; to?: string }[] = [
		{ label: "~", to: "/" },
	];

	if (view.directory.route !== "/") {
		crumbs.push({
			label: view.directory.title,
			to: view.directory.route,
		});
	}

	if (view.selectedFile) {
		crumbs.push({
			label: formatFileBreadcrumbLabel(view.selectedFile),
			to: view.selectedFile.route,
		});
	}

	return crumbs;
}

function getQuickCommands(
	currentDirectorySegments: string[],
	directory: TerminalDirectory,
	selectedFile: TerminalFile | undefined,
) {
	const commands = ["help", "ls", "uptime"];

	if (currentDirectorySegments.length > 0) {
		commands.push("cd ..");
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

function getInitialAutoLs(): boolean {
	if (typeof window === "undefined") {
		return true;
	}

	const stored = window.localStorage.getItem("terminalAutoLs");
	if (stored === "false") {
		return false;
	}
	if (stored === "true") {
		return true;
	}

	return true;
}

function persistTerminalAutoLs(value: boolean) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem("terminalAutoLs", String(value));
}

function createWelcomeLines() {
	const contentLines = HOME_LOGIN_MESSAGE_LINES.filter(Boolean);

	return [
		"Last login: today on tty1",
		getUptimeLine(),
		"",
		...contentLines,
		"",
		"Type help to list commands.",
	];
}

function getUptimeLine() {
	return `Uptime: ${formatAgeUptime(new Date("1982-07-31"))}`;
}

function formatAgeUptime(birthDate: Date, now = new Date()) {
	let years = now.getFullYear() - birthDate.getFullYear();
	let months = now.getMonth() - birthDate.getMonth();
	let days = now.getDate() - birthDate.getDate();

	if (days < 0) {
		const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		days += previousMonth.getDate();
		months -= 1;
	}

	if (months < 0) {
		months += 12;
		years -= 1;
	}

	const parts = [`${years} year${years === 1 ? "" : "s"}`];

	if (months > 0) {
		parts.push(`${months} month${months === 1 ? "" : "s"}`);
	}

	if (days > 0 && months === 0) {
		parts.push(`${days} day${days === 1 ? "" : "s"}`);
	}

	return parts.join(", ");
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
