import { createFileRoute } from "@tanstack/react-router";
import type { TerminalRouteMatchData } from "../lib/terminalContent";

export const HOME_LOGIN_MESSAGE_LINES = [
	"Welcome to my personal website",
	"This is a place to share who I am, what I work on, and how I think about building software.",
	"This website is structured like a small filesystem. Use `ls` to list sections, `cd` to move between sections and `cat` to read content.",
];

export const Route = createFileRoute("/")({
	loader: () =>
		({
			routeKey: "/",
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
