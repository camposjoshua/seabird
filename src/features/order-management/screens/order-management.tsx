import { Typography } from "@heroui/react";
import { OrderTable } from "../components/order-table";

export const OrderManagementScreen = () => {
  return (
    <div className="flex flex-col gap-2 p-6">
      <Typography type="h2">Welcome, Admin!</Typography>
      <Typography type="body" className="text-gray-500">
        Manage your laundry orders and keep everything running smoothly.
      </Typography>

      <OrderTable />
    </div>
  );
};
