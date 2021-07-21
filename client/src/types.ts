import { ActionContext } from "vuex";

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
	token?: string | null;
	email: string | null;
	username: string | null;
}

export type SetUserPayload = UserState;

export interface SetUserMutationFn<S, T extends SetUserPayload> {
	(state: S, payload: T): void;
}
export interface SetUserTokenMutationFn<S, T> {
	(state: S, payload: T): void;
}
export interface ClearUserTokenMutationFn<S, T> {
	(state: S, payload: T): void;
}
export interface SetUserActionFn<C extends ActionContext<MyStore["state"], MyStore["state"]>, T> {
	(context: C, payload: T): void;
}
export interface SetUserTokenActionFn<C extends ActionContext<MyStore["state"], MyStore["state"]>, T> {
	(context: C, payload: T): Promise<boolean>;
}
export interface ClearUserTokenActionFn<C extends ActionContext<MyStore["state"], MyStore["state"]>, T> {
	(context: C, payload: T): void;
}
export interface GetOneMemoryActionFn<C extends ActionContext<MyStore["state"], MyStore["state"]>, T> {
	(context: C, payload: T): Promise<Memory | never>;
}
export interface MyStore {
	state?: {
		user: UserState;
		memories: Memory[];
	};
	mutations?: {
		"SET_USER": () => SetUserMutationFn<MyStore["state"], SetUserPayload>;
		"SET_USER_TOKEN": () => SetUserTokenMutationFn<MyStore["state"], string>;
		"CLEAR_USER_TOKEN": () => ClearUserTokenMutationFn<MyStore["state"], "">;
	};
	actions?: {
		setUser: () => SetUserActionFn<ActionContext<MyStore["state"], MyStore["state"]>, SetUserPayload>;
		setUserToken: () => SetUserTokenActionFn<ActionContext<MyStore["state"], MyStore["state"]>, string>;
		clearUserToken: () => ClearUserTokenActionFn<ActionContext<MyStore["state"], MyStore["state"]>, "">;
		getOneMemory: () => GetOneMemoryActionFn<ActionContext<MyStore["state"], MyStore["state"]>, number>;
	};
}