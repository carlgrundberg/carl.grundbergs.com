import { LaptopMinimal, MoonStar, Sun } from "lucide-react";
import type { ThemeMode } from "../lib/themeMode";

type Props = {
	mode: ThemeMode;
	/** What clicking the button does (tooltips / screen readers). */
	label: string;
	onCycle: () => void;
};

export default function ThemeToggle({ mode, label, onCycle }: Props) {
	return (
		<button
			type="button"
			onClick={onCycle}
			aria-label={label}
			title={label}
			className="terminal-theme-toggle"
		>
			{mode === "auto" ? (
				<LaptopMinimal size={16} aria-hidden="true" />
			) : mode === "dark" ? (
				<MoonStar size={16} aria-hidden="true" />
			) : (
				<Sun size={16} aria-hidden="true" />
			)}
		</button>
	);
}
