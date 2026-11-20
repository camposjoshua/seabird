import { useState } from "react";
import { Chip, Surface, Typography, Button } from "@heroui/react";

import type { Order } from "../../../services/types/order";
import { BRANCHES } from "../../../services/types/branch";
import { formatOrderNumber } from "../../order-tracker/utils/format-order-number";

type OrderViewportProps = {
  order: Order;
};

export const OrderViewport = ({ order }: OrderViewportProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const branchName =
    BRANCHES.find((branch) => branch.id === order.branchId)?.name ??
    "Unknown Branch";

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString("en-PH")}`;

  return (
    <Surface className="mb-4 w-full rounded-3xl p-4 shadow-surface sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Collapsed Information */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography type="h3">
              {formatOrderNumber(order.orderNumber)}
            </Typography>

            <Chip size="sm" variant="soft">
              {order.status}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography color="muted" type="body-sm">
                Customer
              </Typography>
              <Typography>{order.customer.name}</Typography>
            </div>

            <div>
              <Typography color="muted" type="body-sm">
                Branch
              </Typography>
              <Typography>{branchName}</Typography>
            </div>

            <div>
              <Typography color="muted" type="body-sm">
                Items
              </Typography>
              <Typography>{order.items.length} services</Typography>
            </div>

            <div>
              <Typography color="muted" type="body-sm">
                Total Amount
              </Typography>
              <Typography className="font-semibold">
                {formatCurrency(order.total)}
              </Typography>
            </div>
          </div>
        </section>

        {/* Expanded Information */}
        {isExpanded && (
          <>
            <div className="border-t" />

            {/* Order Information */}
            <section className="flex flex-col gap-3">
              <Typography type="h4">Order Information</Typography>

              <div>
                <Typography color="muted" type="body-sm">
                  Order ID
                </Typography>
                <Typography className="break-all text-sm">
                  {order.id}
                </Typography>
              </div>
            </section>

            <div className="border-t" />

            {/* Customer Information */}
            <section className="flex flex-col gap-3">
              <Typography type="h4">Customer Information</Typography>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Typography color="muted" type="body-sm">
                    Email
                  </Typography>
                  <Typography className="break-all">
                    {order.customer.email}
                  </Typography>
                </div>

                <div>
                  <Typography color="muted" type="body-sm">
                    Phone Number
                  </Typography>
                  <Typography>{order.customer.phone}</Typography>
                </div>
              </div>
            </section>

            <div className="border-t" />

            {/* Order Items */}
            <section className="flex flex-col gap-3">
              <Typography type="h4">Order Items</Typography>

              <div className="flex flex-col divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.serviceId}-${index}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <Typography className="font-medium">
                        {item.name}
                      </Typography>

                      <Typography color="muted" type="body-sm">
                        {item.quantity} {item.unit} ×{" "}
                        {formatCurrency(item.price)}
                      </Typography>
                    </div>

                    <Typography className="shrink-0 font-medium">
                      {formatCurrency(item.subtotal)}
                    </Typography>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t" />

            {/* Status History */}
            <section className="flex flex-col gap-3">
              <Typography type="h4">Status History</Typography>

              <div className="flex flex-col gap-3">
                {order.statusHistory.map((history, index) => (
                  <div
                    key={`${history.status}-${history.timestamp}-${index}`}
                    className="flex flex-col gap-1"
                  >
                    <Typography className="font-medium capitalize">
                      {history.status}
                    </Typography>

                    <Typography color="muted" type="body-sm">
                      {new Date(history.timestamp).toLocaleString("en-PH")}
                    </Typography>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Expand / Collapse */}
        <div className="border-t pt-3">
          <Button
            variant="outline"
            className="w-full bg-gray-100"
            onPress={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Show less" : "More info"}
          </Button>
        </div>
      </div>
    </Surface>
  );
};
