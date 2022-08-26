import {
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftAddon,
	Input,
	FormErrorMessage,
	FormHelperText,
	Button,
	Flex,
	Heading,
} from "@chakra-ui/react";
import { Formik, FormikHelpers } from "formik";

type Values = { invite: string };

export default function TeamJoinForm({
	onClose,
	onSubmit,
}: {
	onClose: () => void;
	onSubmit: (
		values: Values,
		formikHelpers: FormikHelpers<Values>
	) => void | Promise<unknown>;
}) {
	return (
		<Formik
			initialValues={{ invite: "" }}
			onSubmit={onSubmit}
			validate={(values) => {
				const errors: Partial<Values> = {};
				if (!values.invite) {
					errors.invite = "This field is required.";
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
					<FormControl isRequired mb={3} isInvalid={!!errors.invite}>
						<Heading as="h1" mb={2}>
							Join A Team
						</Heading>
						<FormLabel mb={1}>Invite ID</FormLabel>
						<InputGroup>
							<InputLeftAddon>Invite ID</InputLeftAddon>
							<Input
								type="text"
								name="invite"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.invite}
								placeholder="7-digit ID"
								data-cy="join-team-modal-invite"
                autoComplete="off"
							/>
						</InputGroup>
						<FormErrorMessage>{errors.invite}</FormErrorMessage>
            <FormHelperText>Ask a team member to send you their team's unique invite code!</FormHelperText>
					</FormControl>

          <Flex mt={4} px={0} alignItems="center" justifyContent="end">
							<Button onClick={onClose} type="button">
								Cancel
							</Button>
							<Button
								variant="cta"
								ml={3}
								isLoading={isSubmitting}
								type="submit"
								data-cy="join-team-modal-submit"
							>
								Join
							</Button>
						</Flex>
				</form>
			)}
		</Formik>
	);
}
