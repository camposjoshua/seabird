import {
  Button,
  Description,
  Header,
  Kbd,
  Label,
  ListBox,
  Separator,
  Surface,
  Typography,
} from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";
import type { CartItem } from "../services/types/order";

export interface OrderSummaryProps {
  cart: CartItem[];
  onRemove: (serviceId: string) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  addService: () => void;
}

export const OrderSummary = ({
  cart,
  onRemove,
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
    <div>
      <Surface className="w-full rounded-3xl shadow-surface">
        <ListBox
          aria-label="File actions"
          className="w-full p-2"
          selectionMode="none"
          onAction={(key) => alert(`Selected item: ${key}`)}
        >
          <ListBox.Section>
            <Header>Selected Service:</Header>
            {cart.map((item) => (
              <ListBox.Item
                key={item.serviceId}
                id={item.serviceId}
                textValue={item.name}
                className="flex justify-between"
              >
                <div className="flex flex-col">
                  <Label>{item.name}</Label>
                  <Description>
                    ₱{item.price} / {item.unit}
                  </Description>
                </div>

                <div>
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

                <div className="flex flex-row items-center">
                  <div className="mr-5">
                    <Typography className="font-semibold" type="h3">
                      ₱{item.price * item.quantity}
                    </Typography>
                  </div>
                  <Button
                    onClick={() => onRemove(item.serviceId)}
                    isIconOnly
                    aria-label="Delete"
                    variant="secondary"
                  >
                    <TrashBin />
                  </Button>
                </div>
              </ListBox.Item>
            ))}
          </ListBox.Section>
          <Separator />
          <ListBox.Section>
            <ListBox.Item
              id="delete-file"
              textValue="Delete file"
              variant="danger"
            >
              <div className="flex h-8 items-start justify-center pt-px"></div>
              <div className="flex flex-col">
                <Typography type="h4">Total</Typography>
              </div>
              <Kbd className="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Abbr keyValue="shift" />
                <Kbd.Content>D</Kbd.Content>
              </Kbd>
            </ListBox.Item>
          </ListBox.Section>
        </ListBox>
      </Surface>
      <h2>Your Order</h2>

      {cart.map((item) => (
        <div key={item.serviceId}>
          <h3>{item.name}</h3>

          <p>
            ₱{item.price} / {item.unit}
          </p>

          <div>
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

          <p>Subtotal: ₱{item.price * item.quantity}</p>

          <button onClick={() => onRemove(item.serviceId)}>Remove</button>
        </div>
      ))}

      <hr />

      <h3>Total: ₱{total}</h3>

      <Button onPress={() => addService()}>Add another service</Button>
    </div>
  );
};

export default OrderSummary;
