import {
  Description,
  Header,
  Label,
  Surface,
  Typography,
  Button,
} from "@heroui/react";
import type { CartItem, CustomerDetails } from "../services/types/order";
import { BRANCHES } from "../services/types/branch";

type OrderReviewProps = {
  cart: CartItem[];
  branch: string;
  customerDetails: CustomerDetails;
  downPayment: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  placingOrder: boolean;
};

export const OrderReview = ({
  cart,
  customerDetails,
  downPayment,
  branch,
  onBack,
  onPlaceOrder,
  placingOrder,
}: OrderReviewProps) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const appliedDownPayment = Math.min(Math.max(0, downPayment || 0), subtotal);

  const total = subtotal - appliedDownPayment;

  return (
    <Surface className="w-full rounded-3xl shadow-surface p-3 mb-4">
      <section>
        <div>
          <Header className="w-full text-center">Customer Information</Header>
        </div>

        <div>
          <Typography type="body-sm">Name:</Typography>
          <Typography type="h5">{customerDetails.name}</Typography>
        </div>

        <div>
          <Typography type="body-sm">Email:</Typography>
          <Typography type="h5">{customerDetails.email}</Typography>
        </div>

        <div>
          <Typography type="body-sm">Phone:</Typography>
          <Typography type="h5">{customerDetails.phone}</Typography>
        </div>
      </section>

      <hr className="mt-3" />

      <section className="mb-3">
        <div className="mt-3">
          <Header className="w-full text-center">Branch Location</Header>
          <Typography type="h5" className="w-full text-center">
            {BRANCHES.find((item) => item.id === branch)?.name ??
              "Unknown Branch"}
          </Typography>
        </div>

        <div className="mt-3">
          <Header className="w-full text-center">Selected Services</Header>
        </div>

        {cart.map((item) => (
          <div
            key={item.serviceId}
            id={item.serviceId}
            className="grid w-full grid-cols-3 items-center gap-4 my-3"
          >
            <div className="flex min-w-0 flex-col">
              <Label>{item.name}</Label>
              <Description>
                ₱{item.price} / {item.unit}
              </Description>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Typography>{item.quantity}</Typography>
            </div>

            <div className="flex justify-end">
              <Typography className="font-semibold" type="h4">
                ₱{item.price * item.quantity}
              </Typography>
            </div>
          </div>
        ))}
      </section>

      <hr />

      <div className=" flex flex-row justify-between items-center my-3">
        <div>
          <Typography className="text-orange-500" type="body-sm">
            Down payment:
          </Typography>
        </div>

        <div>
          <Typography className="text-orange-500" type="body-sm">
            - ₱{downPayment}
          </Typography>
        </div>
      </div>

      <div className=" flex flex-row justify-between items-center my-3">
        <div>
          <Typography type="h3">Total:</Typography>
        </div>

        <div>
          <Typography className="text-blue-600" type="h3">
            ₱{total}
          </Typography>
        </div>
      </div>

      <div className=" flex flex-row justify-between items-center mt-10">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button onClick={onPlaceOrder} isDisabled={placingOrder}>
          {placingOrder ? "Booking Service..." : "Book Service"}
        </Button>
      </div>
    </Surface>
  );
};
