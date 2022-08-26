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

type Values = { slug: string; name?: string };

export default function TeamCreateForm({
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
			initialValues={{ slug: "" }}
			onSubmit={onSubmit}
			validate={(values) => {
				const errors: Partial<Values> = {};
				if (!values.slug) {
					errors.slug = "This field is required.";
				} else if (!/^[a-z0-9\-]*$/.test(values.slug)) {
					errors.slug =
						"Your team URL may only contain lowercase letters, numbers, and dashes.";
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
					<FormControl isRequired mb={3} isInvalid={!!errors.slug}>
						<Heading as="h1" mb={2}>
							Create A Team
						</Heading>
						<FormLabel mb={1}>URL</FormLabel>
						<InputGroup>
							<InputLeftAddon>https://haas.hackclub.com/teams/</InputLeftAddon>
							<Input
								type="text"
								name="slug"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.slug}
								placeholder="hackclub"
								data-cy="create-team-modal-slug"
								autoComplete="off"
							/>
						</InputGroup>
						<FormErrorMessage>{errors.slug}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={!!errors.name}>
						<FormLabel mb={1}>Display Name</FormLabel>
						<Input
							type="text"
							name="name"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							placeholder="Hack Club"
							data-cy="create-team-modal-name"
							autoComplete="off"
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
						<FormHelperText>
							An optional display name for your team.
						</FormHelperText>
						<Flex mt={4} px={0} alignItems="center" justifyContent="end">
							<Button onClick={onClose} type="button">
								Cancel
							</Button>
							<Button
								variant="cta"
								ml={3}
								isLoading={isSubmitting}
								type="submit"
								data-cy="create-team-modal-submit"
							>
								Create
							</Button>
						</Flex>
					</FormControl>
				</form>
			)}
		</Formik>
	);
}
