import type { Dictionary } from "@/lib/dictionary";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export function orderStatusLabel(status: OrderStatus, t: Dictionary): string {
  switch (status) {
    case "requested":
      return t.dashStatusRequested;
    case "sourcing":
      return t.dashStatusSourcing;
    case "purchased":
      return t.dashStatusPurchased;
    case "in_transit":
      return t.dashStatusInTransit;
    case "delivered":
      return t.dashStatusDelivered;
  }
}

// Zero-based index of a status within the lifecycle.
export function statusIndex(status: OrderStatus): number {
  return ORDER_STATUSES.indexOf(status);
}

export function isActiveOrder(status: OrderStatus): boolean {
  return status !== "delivered";
}
