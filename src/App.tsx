import "./App.css";
import { useEffect, useState, type SetStateAction } from "react";
import { getLaundryServices } from "./services/laundry-services";
import { ServiceCard } from "./components/service-card";
import OrderSummary from "./components/order-summary";
import { BookingForm } from "./components/booking-form";
import { OrderReview } from "./components/order-review";
import { createOrder } from "./services/order-services";

import type { LaundryService } from "./services/types/laundry";
import type { CartItem, CustomerDetails, Order } from "./services/types/order";

function App() {
  const [services, setServices] = useState<LaundryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handlePlaceOrder = async () => {
    if (!customerDetails) {
      return;
    }
    try {
      setPlacingOrder(true);
      setOrderError("");

      const createdOrder = await createOrder({
        cart,
        customerDetails,
      });

      setOrder(createdOrder);
      setStep(4);
    } catch (error) {
      console.error("Failed to create order:", error);

      setOrderError("We couldn't place your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleBookingSubmit = (
    form: SetStateAction<CustomerDetails | null>,
  ) => {
    setCustomerDetails(form);
    setStep(3);
  };

  const addService = () => {
    setStep(1);
  };

  const handleAddToOrder = (service: {
    id: string;
    name: string;
    price: number;
    unit: string;
  }) => {
    setStep(2);
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
        setStep(1);
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

  return (
    <div className="px-5">
      <h1>Laundry App</h1>
      <p>Welcome to our laundry service.</p>

      {step === 1 && (
        <div>
          <h1>Laundry Services</h1>

          <div className="grid grid-flow-col grid-rows-2 gap-5">
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

      {step === 2 && (
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

      {step === 3 && (
        <>
          <OrderReview
            cart={cart}
            customerDetails={customerDetails}
            onBack={() => setStep(2)}
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />
          {orderError && <p>{orderError}</p>}
        </>
      )}

      {step === 4 && (
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
}

export default App;
