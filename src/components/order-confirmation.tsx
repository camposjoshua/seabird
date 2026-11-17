import { Button } from "@heroui/react";

type OrderConfirmationProps = {
  customerName?: string;
  orderNumber?: string;
  trackingLink?: string;
};

export const OrderConfirmation = ({
  customerName,
  orderNumber,
  trackingLink,
}: OrderConfirmationProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-8 text-center">
      <div className="flex h-13 w-13 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        ✓
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Order Received!</h2>

        <p className="text-sm text-default-500">
          Thank you, {customerName || "Customer"}! We've received your laundry
          order.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-default-200 bg-default-50 p-4">
        <p className="text-xs text-default-500">Your Order Number</p>

        <p className="mt-1 text-xl font-bold tracking-wide">
          {orderNumber || "N/A"}
        </p>
      </div>

      <p className="max-w-sm text-sm text-default-500">
        We'll begin processing your laundry order soon. You can now track your
        order status.
      </p>

      {trackingLink && (
        <Button onPress={() => window.location.assign(trackingLink)}>
          Order Tracker
        </Button>
      )}
    </div>
  );
};
