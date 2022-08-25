export interface IUser {
	id: string;
	name: string;
	avatar?: string;
	slack_user_id: string;
}

export interface ITeam {
	id: number;
	name?: string;
	avatar?: string;
	slug: string;
	personal: boolean;
  invite: string;
}

export interface IApp {
	id: number;
	team_id: number;
	slug: string;
	enabled: boolean;
	created_at: string;
}

export interface IDomain {
	id: number;
	domain: string;
	verified: boolean;
	app_id: number;
}

export interface IBuild {
	id: number;
	app_id: number;
	started_at: string;
	ended_at?: string;
	events: string[];
}

export type KVConfig = {
	[id: string]: {
		key: string;
		keyEditable: boolean;
		valueEditable: boolean;
		obscureValue: boolean;
		value: string;
	};
};

export interface IAddon {
	name: string;
	activated: boolean;
	description: string;
	img: string;
	id: string;
	config: KVConfig;
	storage: string;
	price: string;
}
