export type TerminalFile = {
	name: string;
	summary: string;
	body: string;
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

export type TerminalRouteMatchData = {
	routeKey: string;
	directory?: TerminalDirectory;
	selectedFile?: TerminalFile;
};

export function createFile(file: TerminalFile): TerminalFile {
	return file;
}

export function createDirectory(
	directory: TerminalDirectory,
): TerminalDirectory {
	return directory;
}

export function markdown(lines: string[]): string {
	return lines.join("\n");
}
