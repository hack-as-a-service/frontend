import { IndexPage } from "./IndexPage"
import React, { ComponentProps } from 'react';

import { Story, Meta } from '@storybook/react';

export default {
  title: 'Pages/ComingSoon',
  component: IndexPage,
} as Meta;

const Template: Story<ComponentProps<typeof IndexPage>> = (args) => <IndexPage {...args} />;

export const Page = Template.bind({});
// Page.args = {};