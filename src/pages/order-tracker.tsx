import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderTracking } from "../services/order-tracking";
import type { OrderStatus, OrderTracking } from "../services/types/order";
import { Surface, Typography } from "@heroui/react";
import { formatOrderNumber } from "../features/order-tracker/utils/format-order-number";
import { Stepper } from "../components/stepper";

const ORDER_STATUSES: OrderStatus[] = ["received", "preparing", "ready"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Order Received",
  preparing: "Preparing",
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

  return (
    <div className="w-full min-h-screen bg-blue-100">
      <div className="p-5">
        <Surface className="flex flex-col w-full rounded-3xl shadow-surface p-5 gap-5">
          <div>
            <Typography type="body" className="">
              Order number:
            </Typography>
            <Typography type="h2">
              {formatOrderNumber(order.orderNumber)}
            </Typography>
          </div>
          <div>
            <Typography type="body" className="">
              status:
            </Typography>
            <Typography type="h3">
              {STATUS_LABELS[order.status] ?? order.status}
            </Typography>
          </div>

          <div>
            <Typography type="body-sm" className="mb-3">
              progress:
            </Typography>
            <Stepper
              currentStep={ORDER_STATUSES.indexOf(order.status)}
              steps={ORDER_STATUSES}
            />
          </div>
        </Surface>
      </div>
    </div>
  );
};

export default OrderTracker;
