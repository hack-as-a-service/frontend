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
  FormHelperText,
  Input,
  Text,
} from "@chakra-ui/react";

import { Formik, FormikHelpers } from "formik";

type Values = { id: string; name: string };

export default function AppCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => void | Promise<any>;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <Formik
        initialValues={{ id: "", name: "" }}
        onSubmit={onSubmit}
        validate={(values) => {
          const errors: { id?: string } = {};
          if (!values.id) {
            errors.id = "This field is required.";
          } else if (!/^[a-z0-9][^/:_A-Z\s\.]*$/.test(values.id)) {
            errors.id = "Your app ID can't contain spaces or most punctuation.";
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
          <ModalContent>
            <ModalHeader>
              <Heading as="h1" fontWeight="normal">
                Create an app
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <FormControl id="id" isRequired my={1}>
                  <FormLabel mb={1}>App ID</FormLabel>
                  <Input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.id}
                  />
                  {errors.id && (
                    <Text color="red" my={0}>
                      {errors.id}
                    </Text>
                  )}
                  {values.id != "" && !errors.id && (
                    <FormHelperText mt={1}>
                      Your app will be accessible at{" "}
                      <Text display="inline" fontWeight="bold" color="inherit">
                        {values.id}
                      </Text>
                      .haas.hackclub.com
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl id="name">
                  <FormLabel mb={1}>App Name</FormLabel>
                  <Input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && (
                    <Text color="red" my={0}>
                      {errors.name}
                    </Text>
                  )}
                  <FormHelperText mt={1}>
                    An optional name for your app
                  </FormHelperText>
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                variant="cta"
                ml={3}
                onClick={() => handleSubmit()}
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
}
