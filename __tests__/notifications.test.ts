import * as Notifications from "expo-notifications";
import { rescheduleAll } from "../src/lib/notifications";
import type { Subscription } from "../src/db/schema";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: { DATE: "date" },
}));

const mocked = jest.mocked(Notifications);

const sub = (overrides: Partial<Subscription> = {}): Subscription => ({
  id: "netflix",
  name: "Netflix",
  price: 1599,
  currency: "EUR",
  cycle: "monthly",
  firstPaymentDate: "2026-01-20",
  category: "streaming",
  color: "#E50914",
  notes: "",
  reminderEnabled: true,
  active: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

/** Trigger date passed to the n-th scheduleNotificationAsync call. */
const triggerDate = (call = 0) =>
  (mocked.scheduleNotificationAsync.mock.calls[call][0].trigger as { date: Date }).date;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  // Now: 10 March 2026, 12:00 local time
  jest.setSystemTime(new Date(2026, 2, 10, 12, 0));
  mocked.getPermissionsAsync.mockResolvedValue({ status: "granted" } as never);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("rescheduleAll", () => {
  it("does nothing without notification permission", async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ status: "denied" } as never);

    await rescheduleAll([sub()], 9, 0, "fr-FR");

    expect(mocked.cancelAllScheduledNotificationsAsync).not.toHaveBeenCalled();
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("cancels existing reminders before scheduling new ones", async () => {
    await rescheduleAll([sub()], 9, 0, "fr-FR");

    const cancelOrder = mocked.cancelAllScheduledNotificationsAsync.mock.invocationCallOrder[0];
    const scheduleOrder = mocked.scheduleNotificationAsync.mock.invocationCallOrder[0];
    expect(cancelOrder).toBeLessThan(scheduleOrder);
  });

  it("schedules the reminder the day before the next payment, at the chosen time", async () => {
    // Next payment of a monthly sub started on 20 Jan: 20 March → reminder 19 March 09:30
    await rescheduleAll([sub()], 9, 30, "fr-FR");

    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(triggerDate()).toEqual(new Date(2026, 2, 19, 9, 30, 0, 0));
  });

  it("uses one identifier per subscription and includes its name and amount", async () => {
    await rescheduleAll([sub()], 9, 0, "en-US");

    const request = mocked.scheduleNotificationAsync.mock.calls[0][0];
    expect(request.identifier).toBe("sub-netflix");
    expect(request.content.body).toContain("Netflix");
    expect(request.content.body).toContain("15.99");
    expect(request.content.data).toEqual({ subscriptionId: "netflix" });
  });

  it("skips subscriptions whose reminder is disabled", async () => {
    await rescheduleAll(
      [sub(), sub({ id: "spotify", name: "Spotify", reminderEnabled: false })],
      9,
      0,
      "fr-FR",
    );

    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(mocked.scheduleNotificationAsync.mock.calls[0][0].identifier).toBe("sub-netflix");
  });

  it("does not schedule a reminder whose time has already passed", async () => {
    // Payment tomorrow (11 March) → reminder today at 09:00, but it is already 12:00
    await rescheduleAll([sub({ firstPaymentDate: "2026-02-11" })], 9, 0, "fr-FR");

    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("still schedules today's reminder when its time is later today", async () => {
    // Payment tomorrow (11 March) → reminder today at 18:00, still ahead
    await rescheduleAll([sub({ firstPaymentDate: "2026-02-11" })], 18, 0, "fr-FR");

    expect(triggerDate()).toEqual(new Date(2026, 2, 10, 18, 0, 0, 0));
  });

  it("handles weekly cycles", async () => {
    // Weekly from Tuesday 3 March → next payment 10 March (today) → reminder 9 March: past
    // so nothing is scheduled; from Wednesday 4 March → 11 March → reminder 10 March 20:00
    await rescheduleAll(
      [
        sub({ id: "today", cycle: "weekly", firstPaymentDate: "2026-03-03" }),
        sub({ id: "tomorrow", cycle: "weekly", firstPaymentDate: "2026-03-04" }),
      ],
      20,
      0,
      "fr-FR",
    );

    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(mocked.scheduleNotificationAsync.mock.calls[0][0].identifier).toBe("sub-tomorrow");
    expect(triggerDate()).toEqual(new Date(2026, 2, 10, 20, 0, 0, 0));
  });
});
