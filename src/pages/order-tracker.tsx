import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderTracking } from "../services/order-tracking";
import type { OrderStatus, OrderTracking } from "../services/types/order";

const ORDER_STATUSES: OrderStatus[] = [
  "received",
  "processing",
  "ready",
  "completed",
  "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Order Received",
  processing: "Confirmed",
  ready: "Ready for Pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

const OrderTracker = () => {
  const { token } = useParams<{ token: string }>();

  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!token) {
        setError("Invalid tracking link.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const trackingOrder = await getOrderTracking(token);

        if (isMounted) {
          setOrder(trackingOrder);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);

        if (isMounted) {
          setError("Unable to retrieve your order. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) {
    return <p>Loading your order...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return (
      <div>
        <h2>Order Not Found</h2>
        <p>We couldn't find an order associated with this tracking link.</p>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);

  return (
    <main>
      <h1>Laundry Tracker</h1>

      <h2>Order #{order.orderNumber}</h2>

      <p>
        Current Status:{" "}
        <strong>{STATUS_LABELS[order.status] ?? order.status}</strong>
      </p>

      <hr />

      <h3>Order Progress</h3>

      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;

        const historyEntry = order.statusHistory.find(
          (entry) => entry.status === status,
        );

        return (
          <div key={status}>
            <p>
              {isCompleted ? "✓" : "○"} <strong>{STATUS_LABELS[status]}</strong>
              {isCurrent && " — In Progress"}
            </p>

            {historyEntry?.timestamp && (
              <small>{new Date(historyEntry.timestamp).toLocaleString()}</small>
            )}
          </div>
        );
      })}
    </main>
  );
};

export default OrderTracker;
