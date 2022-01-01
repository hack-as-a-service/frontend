// see https://github.com/hack-as-a-service/api/blob/06c43ad2284e12a0877e2af564df22b866895804/crates/provisioner/src/lib.rs, lines 30-62 for context

export type IDockerBuildEvent = {
	id?: string;
	stream?: string;
	error?: string;
	error_detail?: {
		code: number;
		message?: string;
	};
	status?: string;
	progress?: string;
	progressDetail?: {
		current: number;
		total: number;
	};
	aux?: {
		id?: string;
	};
};

export type TGitCloneEvent = string;

export type TProvisionerDeployEvent = string;

export type IPayload = {
	ts: string;
} & ({ Ok: Event; } | { Err: string; });

type Event =
	| { type: "docker_build"; event: IDockerBuildEvent; }
	| { type: "git_clone"; event: TGitCloneEvent; }
	| { type: "deploy"; event: TProvisionerDeployEvent; };

// ProvisionerDeployEvent interfaces

interface IDeployBeginEvent {
	deploy_begin: {
		app_id: number;
		image_id: string;
	};
}

interface ICreatingNetworkEvent {
	creating_network: { network_name: string };
}

interface ICreatedNetworkEvent {
	created_network: { network_id: string };
}

interface IUsingExistingNetworkEvent {
	using_existing_network: { network_id: string };
}

interface ICreatingNewContainerEvent {
	creating_new_container: unknown;
}

interface ICreatedNewContainerEvent {
	created_new_container: {
		container_id: string;
	};
}

interface IStartingNewContainerEvent {
	starting_new_container: unknown;
}

interface IStartedNewContainerEvent {
	started_new_container: unknown;
}

interface IRetrievingContainerIPEvent {
	retrieving_container_i_p: unknown;
}

interface IRetrievedContainerIPEvent {
	retrieved_container_i_p: {
		container_ip: string;
	};
}

interface IAddingNewContainerAsUpstreamEvent {
	adding_new_container_as_upstream: unknown;
}

interface ICreatingNewRouteEvent {
	creating_new_route: {
		route_id: string;
	};
}

interface IRemovingOldContainerAsUpstreamEvent {
	removing_old_container_as_upstream: unknown;
}

interface IStoppingOldContainerEvent {
	stopping_old_container: {
		container_id: string;
	};
}

interface IDeletingOldContainerEvent {
	deleting_old_container: unknown;
}

interface IDeployEndEvent {
	deploy_end: {
		app_id: number;
		app_slug: string;
	};
}

interface IOtherEvent {
	other: {
		log: string;
	};
}
