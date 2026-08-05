export const RESULTS_STYLES = ["classic", "compact", "minimal"] as const;
export type ResultsStyle = (typeof RESULTS_STYLES)[number];
