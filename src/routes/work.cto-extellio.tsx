import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const ctoExtellioFile = createFile({
	name: "cto-extellio.md",
	summary:
		"CTO at Extellio—a web analytics and UX insight product aimed at improving sites, journeys, and conversions.",
	route: "/work/cto-extellio",
	body: markdown([
		"# CTO at Extellio",
		"",
		"- **Company / product:** [Extellio](https://extellio.com)",
		"",
		"## What the product helps teams do",
		"",
		"Extellio is built to **improve websites and conversions**: where visitors **come from**, what they **do** on the site, where they **get stuck**, and what to **change** in layout, content, and UX. It combines **analytics**, **surveys**, **heatmaps**, and **session-style visibility** so teams can connect numbers to real behavior, with a **privacy-first** posture marketed toward European customers.",
		"",
		"## My role",
		"",
		"**CTO** with responsibility across **product development**, **technical direction**, and **execution**—translating that product promise into what the team ships and how the platform holds up over time.",
		"",
		"- **Engineering leadership** — priorities, quality, and sustainable pace.",
		"- **Product direction** — aligning technical bets with customer and business outcomes.",
		"- **Architecture and technical decisions** — foundations that support the roadmap without blocking delivery.",
	]),
});

export const Route = createFileRoute("/work/cto-extellio")({
	loader: () =>
		({
			routeKey: "/work/cto-extellio",
			selectedFile: ctoExtellioFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
