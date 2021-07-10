import { ANSI_ESCAPES } from "../../types";

export function logJson(input: any): void {
	return (() => console.log(`${ANSI_ESCAPES.yellow}`, `${JSON.stringify(input, null, 2)}`, `${ANSI_ESCAPES.reset}`))();
};