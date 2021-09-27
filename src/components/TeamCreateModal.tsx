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
  FormErrorMessage,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";

import { Formik, FormikHelpers } from "formik";
import React, { useRef } from "react";

type Values = { slug: string; name?: string };

export default function TeamCreateModal({
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
            <ModalContent>
              <ModalHeader>
                <Heading as="h1">Create A Team</Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired mb={3} isInvalid={!!errors.slug}>
                  <FormLabel mb={1}>URL</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>https://hackclub.app/teams/</InputLeftAddon>
                    <Input
                      ref={initialRef}
                      type="text"
                      name="slug"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.slug}
                      placeholder="hackclub"
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
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                  <FormHelperText>
                    An optional display name for your team.
                  </FormHelperText>
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
