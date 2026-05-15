import { createFileRoute } from "@tanstack/react-router";
import {
	createFile,
	markdown,
	type TerminalRouteMatchData,
} from "../lib/terminalContent";

export const frontendDeveloperHittahemFile = createFile({
	name: "frontend-developer-hittahem.md",
	summary:
		"Frontend at HittaHem—a Swedish housing product spanning map search, watches, and mäklare discovery.",
	route: "/work/frontend-developer-hittahem",
	body: markdown([
		"# Frontend Developer at HittaHem",
		"",
		"- **Product:** [HittaHem.se](https://hittahem.se)",
		"",
		"## What the product covers",
		"",
		"HittaHem is a **Swedish housing** service that sits in two places at once: helping people **discover homes**—including **map-driven search**, **watch areas**, and staying on top of **new listings**—and helping them **find and compare real estate agents (mäklare)** when they want support **buying or selling**. Public positioning stresses a **straightforward, user-friendly** experience in a category that is often noisy and ad-heavy.",
		"",
		"## My role",
		"",
		"**Frontend developer** shipping the **interfaces** where that story shows up: flows had to stay **clear and fast** for people under real homebuying pressure.",
		"",
		"- **Frontend implementation** — turning designs and product intent into stable UI.",
		"- **Product UI** — pages and components that match how people actually search and decide.",
		"- **Usability and interaction** — details that reduce friction (maps, filters, feedback, empty states).",
		"- **Maintainable interface code** — structure that keeps velocity as the product grows.",
	]),
});

export const Route = createFileRoute("/work/frontend-developer-hittahem")({
	loader: () =>
		({
			routeKey: "/work/frontend-developer-hittahem",
			selectedFile: frontendDeveloperHittahemFile,
		}) satisfies TerminalRouteMatchData,
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
