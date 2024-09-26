import { expect, test } from "bun:test";
import { escape, replaceHeading } from "./utils";

test("escape", () => {
  expect(escape("<T>")).toEqual("&lt;T&gt;");
});

test("replaceHeading", () => {
  let raw = "# heading 1\n\n## heading 2\n\n## heading 2.1\n\n### heading 3";

  expect(replaceHeading(raw, 2)).toEqual(
    "### heading 1\n\n#### heading 2\n\n#### heading 2.1\n\n##### heading 3",
  );
  expect(replaceHeading(raw, 3)).toEqual(
    "#### heading 1\n\n##### heading 2\n\n##### heading 2.1\n\n###### heading 3",
  );

  raw = "## heading 2\n\n### heading 2.1\n\n#### heading 3";

  expect(replaceHeading(raw, 1)).toEqual(
    "## heading 2\n\n### heading 2.1\n\n#### heading 3",
  );
  expect(replaceHeading(raw, 3)).toEqual(
    "#### heading 2\n\n##### heading 2.1\n\n###### heading 3",
  );
});
