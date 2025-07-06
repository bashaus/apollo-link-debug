import { testApolloLink } from "@apollo-link-debug/core";

import { createTimerLink } from "./createTimerLink";

const OPERATION_NAME = "createTimerLink";

describe("createTimerLink", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should report timings", async () => {
    const onResponseMock = jest.fn();
    const timerLink = createTimerLink({
      onResponse: onResponseMock,
    });

    await testApolloLink(
      timerLink,
      () => {
        jest.setSystemTime(new Date("1970-01-01T00:00:00Z"));
        return { operationName: OPERATION_NAME };
      },
      () => {
        jest.setSystemTime(new Date("1970-01-01T00:00:03Z"));
        return { data: {} };
      },
    );

    expect(onResponseMock).toHaveBeenCalledTimes(1);
    expect(onResponseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        difference: 3000,
      }),
    );
  });
});
