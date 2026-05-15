import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const vbcFile = createFile({
	name: "vbc.md",
	summary:
		"Vittsjö Beer Club site: structured tasting flights with Untappd links and auto-filled beer details for a consistent archive.",
	route: "/side-projects/vbc",
	body: markdown([
		"# vbc (Vittsjö Beer Club)",
		"",
		"- **Live site:** [vittsjobeerclub.netlify.app](https://vittsjobeerclub.netlify.app)",
		"- **Repository:** [github.com/carlgrundberg/vbc](https://github.com/carlgrundberg/vbc)",
		"",
		"## What it’s for",
		"",
		"Website and admin for **Vittsjö Beer Club**—a small group that meets to **share and taste beer**. Each **meeting** is the unit that holds **beer flights**: ordered tastings, usually with **[Untappd](https://untappd.com/)** links so every row ties back to a real beer.",
		"",
		"## What you can do",
		"",
		"- **Define flights** for a meeting: an ordered set of beers linked from Untappd (or equivalent URLs) so the tasting has a clear structure.",
		"- **Keep the archive honest:** when a meeting is saved, **beer metadata** (name, brewery, style, ABV, IBU) is **fetched from the linked page when possible**, cutting down manual copy-paste and drift over time.",
		"- **See the club on a timeline:** a **public** view of **upcoming and past meetings**—hosts, attendees, optional cover art—so members get the schedule and history without digging through chats.",
		"- **Run it from an admin:** organizers **record meetings and flights** in a CMS-style back office; the public site is the surface members actually read.",
		"",
		"The headline is the **flight + archive** story; meetings are the **container** that makes each tasting easy to revisit later.",
	]),
});

export const Route = createFileRoute("/side-projects/vbc")({
	loader: () =>
		({
			routeKey: "/side-projects/vbc",
			selectedFile: vbcFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
