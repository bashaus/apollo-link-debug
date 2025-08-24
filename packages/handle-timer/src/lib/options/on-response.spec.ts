import { testApolloLink } from "@apollo-link-debug/core";

import { createTimerLink } from "../timer-link";
import { onResponseHandler } from "./on-response";

const OPERATION_NAME = "createTimerLink";

describe("createTimerLink", () => {
  describe("#onResponse", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should console log", async () => {
      const timerLink = createTimerLink({
        onResponse: onResponseHandler,
      });

      const logSpy = jest.spyOn(console, "log");
      logSpy.mockImplementationOnce(() => {
        /* */
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

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(OPERATION_NAME, "took 3 sec");
    });
  });
});
