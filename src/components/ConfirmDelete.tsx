import {
	Button,
	Text,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

import { useState } from "react";

export function ConfirmDelete(props: {
	name: string;
	onConfirmation: () => void;
	onCancellation: () => void;
	buttonText?: string;
	verb?: string;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}) {
	const {
		name,
		onConfirmation,
		onCancellation,
		buttonText,
		isOpen,
		verb,
		onClose,
	} = props;

	const [value, setValue] = useState("");
	const [markedForDeletion, setDelete] = useState(false);

	function handleChange(evt) {
		const v: string = evt.target.value;
		setValue(v);
		v.trim().includes(name.trim()) ? setDelete(true) : setDelete(false);
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
				onCancellation();
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Are you sure you want to {verb ?? "delete"} {name}?
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					<Text margin="initial" padding="initial">
						Type {name} into the box below to confirm this action.
					</Text>
					<Input
						margin="initial"
						my={3}
						onChange={handleChange}
						value={value}
						placeholder={name}
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						mr={3}
						onClick={() => {
							onClose();
							onCancellation();
						}}
					>
						Cancel
					</Button>
					<Button
						isDisabled={!markedForDeletion}
						onClick={() => {
							setValue("");
							onClose();
							onConfirmation();
						}}
						colorScheme="red"
					>
						{buttonText ??
							(verb && verb.toUpperCase().substr(0, 1) + verb.substr(1)) ??
							"Delete"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
