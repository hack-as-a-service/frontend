import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Heading,
	Button,
	InputLeftAddon,
	InputGroup,
	Flex,
	useColorModeValue,
} from "@chakra-ui/react";

import React, { useRef } from "react";

export default function TeamInviteModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const initialRef = useRef();
	const border = useColorModeValue("#00000033", "#ffffff33");
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			initialFocusRef={initialRef}
			size="xl"
		>
			<ModalOverlay />
			<ModalContent data-cy="team-invite-modal">
				<ModalHeader>
					<Heading as="h1" mb={1}>
						Invite a user
					</Heading>
					<Heading as="h3" size="md" fontWeight="normal">
						Send the invite code to your teammates!
					</Heading>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<InputGroup mb={4}>
						<InputLeftAddon>Invite code</InputLeftAddon>
						<Flex
							sx={{ px: 4, borderTop: 4 }}
							alignItems="center"
							justifyContent="center"
              borderColor={border}
						>
							Invite code
						</Flex>
					</InputGroup>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
