import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/career/$entry")({
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
