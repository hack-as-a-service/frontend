import { Selector } from "testcafe";

fixture`Landing page`.page`http://localhost:3000`;

test("Text is correct", async (t) => {
  // TODO: Needs better selectors - every element should get a unique ID. #2
  await t.expect(Selector(".chakra-heading").innerText).eql("Coming Soon");
  await t
    .expect(Selector(".chakra-text").innerText)
    .contains("Hack as a Service");
});
