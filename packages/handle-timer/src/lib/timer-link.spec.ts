import { ApolloLink, gql, Observable } from "@apollo/client";
import { testApolloLink } from "@apollo-link-debug/core";

import { TimerLink } from "./timer-link";

describe("TimerLink", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should report timings", async () => {
    const onResponseMock = vi.fn();
    const timerLink = new TimerLink({
      onResponse: onResponseMock,
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

    expect(onResponseMock).toHaveBeenCalledTimes(1);
    expect(onResponseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        difference: 3000,
      }),
    );
  });

  it("should use the default response handler", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const timerLink = new TimerLink();

    await testApolloLink(
      timerLink,
      () => ({
        query: gql`
          query TimerLink {
            noop
          }
        `,
      }),
      () => ({ data: {} }),
    );

    expect(logSpy).toHaveBeenCalledTimes(1);
    logSpy.mockRestore();
  });

  it("should complete without invoking the response callback", async () => {
    const onResponseMock = vi.fn();
    const timerLink = new TimerLink({ onResponse: onResponseMock });
    const completeLink = new ApolloLink(() => {
      return new Observable((observer) => {
        observer.complete();
        return () => undefined;
      });
    });

    await expect(
      testApolloLink(ApolloLink.from([timerLink, completeLink]), () => ({
        query: gql`
          query TimerLink {
            noop
          }
        `,
      })),
    ).resolves.toBeDefined();

    expect(onResponseMock).not.toHaveBeenCalled();
  });
});
