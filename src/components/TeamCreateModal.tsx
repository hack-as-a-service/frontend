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

import { Formik, FormikHelpers } from "formik";
import React, { useRef } from "react";
import TeamCreateForm from "./forms/team-create";

type Values = { slug: string; name?: string };

export default function TeamCreateModal({
	isOpen,
	onClose,
	onCreate,
}: {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (
		values: Values,
		formikHelpers: FormikHelpers<Values>
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

					<TabPanels>
						<TabPanel>
							<ModalBody>
								<TeamCreateForm onClose={onClose} onSubmit={onCreate} />
							</ModalBody>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</ModalContent>
		</Modal>
	);
}
