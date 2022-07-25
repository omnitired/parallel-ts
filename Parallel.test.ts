import { runInParallel } from "./Parallel";

const testUrl = "https://uselessfacts.jsph.pl/random.txt";

test("throws error when concurrency is less than 1", async () => {
  try {
    const res = await runInParallel([testUrl], 0);
  } catch (e) {
    expect(e.message).toBe("please enter a valid concurrent value");
  }
});

test("runs 1 url without error", async () => {
  const res = await runInParallel([testUrl], 1);
  expect(res.length).toBe(1);
  expect(typeof res[0].text).toBe("string");
  expect(res[0].error).toBeUndefined;
});

test("runs 4 url without error and 1 with error", async () => {
  const testArr = new Array(5).fill(testUrl);

  // non existing url
  testArr[2] = "https://uselessfacts.jsph.pl/hellodarknessmyoldfriend";

  const res = await runInParallel(testArr, 5);
  expect(res.length).toBe(5);
  expect(res[2].error).toBe("Request failed with status code 404");
  expect(res[0].error).toBe(undefined);
});
