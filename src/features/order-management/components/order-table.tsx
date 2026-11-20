import { useEffect, useState } from "react";
import { Button, Spinner, Table, Chip, Typography } from "@heroui/react";

import type { Order } from "../../../services/types/order";
import { getOrders, type OrdersPage } from "../services/get-orders";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

import { formatOrderNumber } from "../../order-tracker/utils/format-order-number";
import { BRANCHES } from "../../../services/types/branch";
import { OrderViewport } from "./order-viewport";

const PAGE_SIZE = 10;

export const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageCursors, setPageCursors] = useState<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([null]);

  const [lastVisible, setLastVisible] =
    useState<OrdersPage["lastVisible"]>(null);

  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cursor = pageCursors[pageIndex];
        const data = await getOrders(PAGE_SIZE, cursor);

        if (!isMounted) return;

        setOrders(data.orders);
        setLastVisible(data.lastVisible);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to fetch orders:", error);
        setError("Failed to load orders.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [pageIndex, pageCursors]);

  const handleNextPage = () => {
    if (!hasNextPage || !lastVisible || isLoading) return;

    setPageCursors((current) => [
      ...current.slice(0, pageIndex + 1),
      lastVisible,
    ]);

    setPageIndex((current) => current + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex === 0 || isLoading) return;

    setPageIndex((current) => current - 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (orders.length === 0) {
    return <Typography>No orders found.</Typography>;
  }

  return (
    <div>
      {selectedOrder && (
        <OrderViewport key={selectedOrder.id} order={selectedOrder} />
      )}
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="w-full min-w-0 overflow-x-auto rounded-xl">
          <Table
            aria-label="Orders table"
            className="w-full table-auto text-sm"
          >
            <Table.Content
              onRowAction={(key) => {
                const order = orders.find((item) => item.id === key);

                if (order) {
                  setSelectedOrder(order);
                }
              }}
            >
              <Table.Header>
                <Table.Column
                  isRowHeader
                  className="w-px whitespace-nowrap px-2 py-2 text-xs"
                >
                  Order Number
                </Table.Column>

                <Table.Column className="w-px whitespace-nowrap px-2 py-2 text-xs">
                  Branch
                </Table.Column>

                <Table.Column className="w-px whitespace-nowrap px-2 py-2 text-xs">
                  Total
                </Table.Column>

                <Table.Column className="w-px whitespace-nowrap px-2 py-2 text-xs">
                  Status
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {orders.map((order) => (
                  <Table.Row
                    key={order.id}
                    id={order.id}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Table.Cell className="px-2 py-2 text-xs sm:px-3 sm:py-3">
                      {formatOrderNumber(order.orderNumber)}
                    </Table.Cell>

                    <Table.Cell className="px-2 py-2 text-xs sm:px-3 sm:py-3">
                      {BRANCHES.find((item) => item.id === order.branchId)
                        ?.name ?? "Unknown Branch"}
                    </Table.Cell>

                    <Table.Cell className="px-2 py-2 text-xs sm:px-3 sm:py-3">
                      ₱{order.total.toLocaleString("en-PH")}
                    </Table.Cell>

                    <Table.Cell className="px-2 py-2 text-xs sm:px-3 sm:py-3">
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

        {/* Pagination */}
        <div className="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <Button
              size="sm"
              variant="outline"
              isDisabled={pageIndex === 0 || isLoading}
              onPress={handlePreviousPage}
            >
              Prev
            </Button>
            <Typography color="muted" type="body-sm" className="mx-5">
              Page {pageIndex + 1}
            </Typography>
            <Button
              size="sm"
              variant="outline"
              isDisabled={!hasNextPage || isLoading}
              onPress={handleNextPage}
            >
              Next
            </Button>
          </div>

          <div className="flex justify-center gap-2 sm:justify-end"></div>
        </div>
      </div>
    </div>
  );
};
