import { gql } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { TimerLink } from "../timer-link";
import { onResponseHandler } from "./on-response";

describe("TimerLink", () => {
  describe("#onResponse", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should console log", async () => {
      const timerLink = new TimerLink({
        onResponse: onResponseHandler,
      });

      const logSpy = vi.spyOn(console, "log");
      logSpy.mockImplementationOnce(() => {
        /* */
      });

      await testApolloLink(
        timerLink,
        () => {
          vi.setSystemTime(new Date("1970-01-01T00:00:00Z"));
          return {
            query: gql`
              query TimerLink {
                noop
              }
            `,
          };
        },
        () => {
          vi.setSystemTime(new Date("1970-01-01T00:00:03Z"));
          return { data: {} };
        },
      );

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith("TimerLink", "took 3 sec");
    });
  });
});
