import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Heading,
	Button,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	InputGroup,
	InputRightAddon,
} from "@chakra-ui/react";

import { Formik, FormikHelpers } from "formik";
import React, { useRef } from "react";

type Values = { email: string };

export default function TeamInviteModal({
	isOpen,
	onClose,
	onSubmit,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (
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
			<Formik
				initialValues={{ email: "" }}
				onSubmit={onSubmit}
				validate={(values) => {
					const errors: Partial<Values> = {};
					if (!values.email) {
						errors.email = "This field is required.";
					} else if (
						!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
					) {
						errors.email = "Please enter in a valid email.";
					}

					return errors;
				}}
			>
				{({
					handleChange,
					handleBlur,
					values,
					handleSubmit,
					errors,
					isSubmitting,
				}) => (
					<form onSubmit={handleSubmit}>
						<ModalContent data-cy="team-invite-modal">
							<ModalHeader>
								<Heading as="h1">Invite a user</Heading>
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<FormControl isRequired isInvalid={!!errors.email}>
									<FormLabel mb={1}>Email</FormLabel>
									<InputGroup>
										<Input
											ref={initialRef}
											type="text"
											name="email"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.email}
											placeholder="bob@hackclub.com"
											data-cy="team-invite-modal-email"
										/>
									</InputGroup>
									<FormErrorMessage>{errors.email}</FormErrorMessage>
								</FormControl>
							</ModalBody>

							<ModalFooter>
								<Button
									variant="cta"
									isLoading={isSubmitting}
									type="submit"
									data-cy="team-invite-modal-submit"
								>
									Invite
								</Button>
							</ModalFooter>
						</ModalContent>
					</form>
				)}
			</Formik>
		</Modal>
	);
}
