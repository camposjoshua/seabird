import {
  Button,
  Description,
  Header,
  Label,
  ListBox,
  NumberField,
  Separator,
  Surface,
  Switch,
  Typography,
} from "@heroui/react";
import type { CartItem } from "../services/types/order";
import { BRANCHES, type Branch } from "../services/types/branch";
import { DropdownSelector } from "./dropdown-selector";
import { useState } from "react";

export interface OrderSummaryProps {
  cart: CartItem[];
  branch: Branch["id"];
  downPayment: number;
  isDownPaymentEnabled: boolean;

  onRemove?: (serviceId: string) => void;
  onDownPaymentEnable: (enabled: boolean) => void;
  onSetDownpayment: (amount: number) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  addService: () => void;
  onBranchSelect: (selectedBranch: Branch["id"]) => void;
  branchError: string;
}

export const OrderSummary = ({
  cart,
  branch,
  downPayment,
  isDownPaymentEnabled,
  branchError,
  onUpdateQuantity,
  onSetDownpayment,
  onDownPaymentEnable,
  addService,
  onBranchSelect,
}: OrderSummaryProps) => {
  const [downPaymentInput, setDownPaymentInput] = useState(downPayment);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = Math.max(
    0,
    subtotal - (isDownPaymentEnabled ? downPayment : 0),
  );

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
      {branchError && <p className="text-sm text-danger mb-2">{branchError}</p>}
      <DropdownSelector
        label="Branch"
        placeholder="Select a branch"
        value={branch}
        onChange={onBranchSelect}
        data={BRANCHES}
      />
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
          {isDownPaymentEnabled && (
            <ListBox.Item
              id="order-downpayment"
              textValue={`Total ₱${downPayment}`}
              className="w-full"
            >
              <div className="flex w-full items-center">
                <Typography className="text-orange-500" type="body-sm">
                  Down payment
                </Typography>

                <Typography
                  className="ml-auto font-semibold text-orange-500"
                  type="body-sm"
                >
                  -₱{downPayment}
                </Typography>
              </div>
            </ListBox.Item>
          )}
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

      <Separator />

      <div className="my-5 flex w-full flex-col gap-3">
        <div>
          <Switch
            isSelected={isDownPaymentEnabled}
            onChange={onDownPaymentEnable}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              Down payment
            </Switch.Content>
          </Switch>
        </div>

        <div>
          {isDownPaymentEnabled && (
            <div className="flex flex-row items-center justify-between">
              <div className="w-[240px]">
                <NumberField
                  value={downPaymentInput}
                  aria-label="down=payment"
                  onChange={setDownPaymentInput}
                  minValue={0}
                  maxValue={subtotal}
                >
                  <NumberField.Group className="w-full border border-default-500 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <NumberField.Input className="w-[240px]" />
                  </NumberField.Group>
                </NumberField>
              </div>

              <div>
                <Button
                  onPress={() =>
                    onSetDownpayment(
                      Math.min(Math.max(0, downPaymentInput), subtotal),
                    )
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Button variant="outline" size="sm" onPress={() => addService()}>
          Add another service
        </Button>
      </div>
    </Surface>
  );
};

export default OrderSummary;
