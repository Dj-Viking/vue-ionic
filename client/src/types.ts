/**
 * image will be a URL link to get load an image
 */
export interface Memory extends Object {
	id: number;
	name: string;
	image: string;
	description: string;
	route: string;
}
export class ListItemClass implements Memory {
	id!: number; route!: string; name!: string; description!: string; image!: string;
	constructor(memory: Memory) {
		Object.assign(this, {
			...memory
		});
	}
}
/**
 * intended register mutation arguments
 */
export interface RegisterArgs {
	email: string;
	username: string;
	password: string;
}
/**
 * the response expected after executing a register mutation
 */
export interface RegisterResponse {
	register: {
		token: string;
		errors: null
		| [{
			field: string;
			message: string;
		}];
		user: null
		| {
			email: string;
		};
	};
}
/**
 * intended login mutation arguments
 */
export interface LoginArgs {
	email: string;
	password: string;
}
/**
 * the response expected after executing a login mutation
 */
export interface LoginResponse {
	login: {
		errors: null
		| [{
			field: string;
			message: string;
		}];
		user: null
		| {
			email: string;
			username: string;
			token: string;
		};
	};
}
export interface LogoutResponse {
	logout: {
			errors: [{
					field: string;
					message: string;
			}] | null;
			user: {
					username: string;
					email: string;
					token: string;
			} | null;
	};
}
/**
 * expected me query response
 */
export interface MeQueryResponse {
	errors: null
	| [{
		field: string;
		message: string;
	}];
	username: string;
	id: number;
	email: string;
}

export interface UserState {
	token?: string;
	email: string;
	username: string;
}