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

type Values = { slug: string };

export default function AppCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    // eslint-disable-next-line no-unused-vars
    values: Values,
    // eslint-disable-next-line no-unused-vars
    formikHelpers: FormikHelpers<Values>
  ) => void | Promise<any>;
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
        initialValues={{ slug: "" }}
        onSubmit={onSubmit}
        validate={(values) => {
          const errors: Partial<Values> = {};
          if (!values.slug) {
            errors.slug = "This field is required.";
          } else if (!/^[a-z0-9\-]*$/.test(values.slug)) {
            errors.slug =
              "Your app name may only contain lowercase letters, numbers, and dashes.";
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
            <ModalContent>
              <ModalHeader>
                <Heading as="h1">Create An App</Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired mb={3} isInvalid={!!errors.slug}>
                  <FormLabel mb={1}>Name</FormLabel>
                  <InputGroup>
                    <Input
                      ref={initialRef}
                      type="text"
                      name="slug"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.slug}
                      placeholder="hackclub"
                    />
                    <InputRightAddon>.hackclub.app</InputRightAddon>
                  </InputGroup>
                  <FormErrorMessage>{errors.slug}</FormErrorMessage>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  variant="cta"
                  ml={3}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
