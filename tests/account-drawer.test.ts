import { describe, expect, it } from "vitest";

import { openAccountDrawer, useAccountDrawerStore } from "../src/features/account/accountDrawerStore";

describe("account drawer integration store", () => {
  it("opens account drawer and switches tabs without page navigation", () => {
    openAccountDrawer("orders");
    expect(useAccountDrawerStore.getState().open).toBe(true);
    expect(useAccountDrawerStore.getState().tab).toBe("orders");
    useAccountDrawerStore.getState().setTab("inbox");
    expect(useAccountDrawerStore.getState().tab).toBe("inbox");
    useAccountDrawerStore.getState().closeDrawer();
    expect(useAccountDrawerStore.getState().open).toBe(false);
  });
});
