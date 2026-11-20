import { useEffect, useState } from "react";
import { Spinner, Table, Chip, Typography } from "@heroui/react";

import type { Order } from "../../../services/types/order";
import { getOrders } from "../services/get-orders";

export const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrders();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <Typography>{error}</Typography>;
  if (orders.length === 0) return <Typography>No orders found.</Typography>;

  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-xl">
      <Table aria-label="Orders table" className="min-w-[700px]">
        <Table.Content>
          <Table.Header>
            <Table.Column isRowHeader>Order Number</Table.Column>
            <Table.Column>Customer</Table.Column>
            <Table.Column>Items</Table.Column>
            <Table.Column>Total</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>

          <Table.Body>
            {orders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell>{order.orderNumber}</Table.Cell>
                <Table.Cell>{order.customer.name}</Table.Cell>
                <Table.Cell>{order.items.length}</Table.Cell>
                <Table.Cell>₱{order.total.toLocaleString("en-PH")}</Table.Cell>
                <Table.Cell>
                  <Chip size="sm" variant="soft">
                    {order.status}
                  </Chip>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </div>
  );
};
