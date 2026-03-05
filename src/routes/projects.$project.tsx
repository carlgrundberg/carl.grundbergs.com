import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$project")({
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
