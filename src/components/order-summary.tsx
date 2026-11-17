import {
  Button,
  Description,
  Header,
  Label,
  ListBox,
  Separator,
  Surface,
  Typography,
} from "@heroui/react";
import type { CartItem } from "../services/types/order";

export interface OrderSummaryProps {
  cart: CartItem[];
  onRemove?: (serviceId: string) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  addService: () => void;
}

export const OrderSummary = ({
  cart,
  onUpdateQuantity,
  addService,
}: OrderSummaryProps) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div>
        <h2>Your Order</h2>
        <p>No services selected yet.</p>
      </div>
    );
  }

  return (
    <Surface className="w-full rounded-3xl shadow-surface p-3 mb-4">
      <ListBox
        aria-label="File actions"
        className="w-full"
        selectionMode="none"
        onAction={(key) => alert(`Selected item: ${key}`)}
      >
        <ListBox.Section>
          <Header className="w-full text-center">Your Order</Header>
          <Header>Selected Service:</Header>
          {cart.map((item) => (
            <ListBox.Item
              key={item.serviceId}
              id={item.serviceId}
              textValue={item.name}
              className="grid w-full grid-cols-3 items-center gap-4"
            >
              <div className="flex min-w-0 flex-col">
                <Label>{item.name}</Label>
                <Description>
                  ₱{item.price} / {item.unit}
                </Description>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.serviceId, item.quantity - 1)
                  }
                >
                  -
                </button>

                <span> {item.quantity} </span>

                <button
                  onClick={() =>
                    onUpdateQuantity(item.serviceId, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="flex justify-end">
                <Typography className="font-semibold" type="h4">
                  ₱{item.price * item.quantity}
                </Typography>
              </div>
            </ListBox.Item>
          ))}
        </ListBox.Section>
        <Separator />
        <ListBox.Section>
          <ListBox.Item
            id="order-total"
            textValue={`Total ₱${total}`}
            className="w-full"
          >
            <div className="flex w-full items-center">
              <Typography type="h4">Total</Typography>

              <Typography className="ml-auto font-semibold" type="h3">
                ₱{total}
              </Typography>
            </div>
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
      <div>
        <Button variant="outline" size="sm" onPress={() => addService()}>
          Add another service
        </Button>
      </div>
    </Surface>
  );
};

export default OrderSummary;
