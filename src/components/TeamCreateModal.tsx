import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Tabs,
	Tab,
	TabList,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";

import { FormikHelpers } from "formik";
import React, { useRef } from "react";
import TeamCreateForm from "./forms/team-create";
import TeamJoinForm from "./forms/team-join";

type CreateValues = { slug: string; name?: string };
type JoinValues = { invite: string };

export default function TeamCreateModal({
	isOpen,
	onClose,
	onCreate,
	onJoin,
}: {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (
		values: CreateValues,
		formikHelpers: FormikHelpers<CreateValues>
	) => void | Promise<unknown>;
	onJoin: (
		values: JoinValues,
		formikHelpers: FormikHelpers<JoinValues>
	) => void | Promise<unknown>;
}) {
	const initialRef = useRef();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			initialFocusRef={initialRef}
			size="xl"
		>
			<ModalOverlay />
			<ModalContent data-cy="team-create-modal">
				<Tabs>
					<TabList>
						<Tab _focus={{ boxShadow: "none" }}>Create</Tab>
						<Tab _focus={{ boxShadow: "none" }}>Join</Tab>
					</TabList>
					<ModalBody>
						<TabPanels>
							<TabPanel>
								<TeamCreateForm onClose={onClose} onSubmit={onCreate} />
							</TabPanel>
							<TabPanel>
								<TeamJoinForm onClose={onClose} onSubmit={onJoin} />
							</TabPanel>
						</TabPanels>
					</ModalBody>
				</Tabs>
			</ModalContent>
		</Modal>
	);
}
