import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Enzyme, { render } from "enzyme";
import React from "react";
import App from "../../pages/index";


Enzyme.configure({ adapter: new Adapter() });

describe("Landing page", () => {
  it('Landing shows "Coming Soon" as a header', () => {
    const app = render(<App />);
    expect(app.find("h1").text()).toEqual("Coming Soon");
  });
});