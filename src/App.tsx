import "./App.css";
import { useEffect, useState } from "react";
import { getLaundryServices } from "./services/laundry-services";
import { ServiceCard } from "./components/service-card";
import OrderSummary from "./components/order-summary";
import { BookingForm } from "./components/booking-form";
import { OrderReview } from "./components/order-review";
import { createOrder } from "./services/order-services";

import type { LaundryService } from "./services/types/laundry";
import type { CartItem, CustomerDetails, Order } from "./services/types/order";
import { Typography } from "@heroui/react";

const DEFAULT_CUSTOMER_DETAILS: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
};

const App = () => {
  const [services, setServices] = useState<LaundryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(
    DEFAULT_CUSTOMER_DETAILS,
  );
  const [step, setStep] = useState<LaundryStep>("selection");
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setOrderError("");

      const createdOrder = await createOrder({
        cart,
        customerDetails,
      });

      setOrder(createdOrder);
      setStep("details");
    } catch (error) {
      console.error("Failed to create order:", error);

      setOrderError("We couldn't place your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleBookingSubmit = (form: CustomerDetails) => {
    setCustomerDetails(form);
    setStep("review");
  };

  const addService = () => {
    setStep("selection");
  };

  const handleAddToOrder = (service: {
    id: string;
    name: string;
    price: number;
    unit: string;
  }) => {
    setStep("summary");
    setCart((currentCart: CartItem[]) => {
      const existingItem = currentCart.some(
        (item) => item.serviceId === service.id,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.serviceId === service.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          unit: service.unit,
          quantity: 1,
        },
      ];
    });
  };

  const handleRemoveFromOrder = (serviceId: string) => {
    setCart((currentCart) => {
      const updated = currentCart.filter(
        (item) => item.serviceId !== serviceId,
      );

      if (updated.length === 0) {
        setStep("selection");
      }

      return updated;
    });
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromOrder(serviceId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.serviceId === serviceId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getLaundryServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load laundry services:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadServices();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  //--Description Enum--

  type LaundryStep = "selection" | "summary" | "review" | "details";

  const DESCRIPTION_TEXT: Record<LaundryStep, string> = {
    selection:
      " Welcome to our laundry service! Track your laundry from start to finish with ease.",
    review: "Review your selected services before continuing",
    summary: "Review your selected services before continuing.",
    details: "Enter your details so we can process your laundry.",
  };

  return (
    <div className="p-5">
      <Typography.Heading className="mb-3" level={1}>
        Hello,
      </Typography.Heading>
      <Typography.Paragraph className="mb-3">
        {DESCRIPTION_TEXT[step]}
      </Typography.Paragraph>

      {step === "selection" && (
        <div>
          <Typography.Paragraph color="muted" size="sm" className="mb-3">
            {cart.length === 0 ? "Service offered" : "Select Additional"} :
          </Typography.Paragraph>

          <div className="grid grid-cols-2 gap-4">
            {services.map((service: LaundryService) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={handleAddToOrder}
              />
            ))}
          </div>
        </div>
      )}

      {(step === "summary" || cart.length !== 0) && (
        <>
          <OrderSummary
            cart={cart}
            addService={addService}
            onRemove={handleRemoveFromOrder}
            onUpdateQuantity={handleUpdateQuantity}
          />

          <BookingForm onSubmit={handleBookingSubmit} />
        </>
      )}

      {step === "review" && (
        <>
          <OrderReview
            cart={cart}
            customerDetails={customerDetails}
            onBack={() => setStep("summary")}
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />
          {orderError && <p>{orderError}</p>}
        </>
      )}

      {step === "details" && (
        <>
          <hr />

          <h2>Order Received!</h2>

          <p>Thank you, {order?.customer.name}.</p>

          <p>
            Your order number is: <strong> {order?.orderNumber}</strong>
          </p>

          <p>
            We've received your laundry order and will begin processing it soon.
          </p>
        </>
      )}
    </div>
  );
};

export default App;
