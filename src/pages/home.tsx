import "../App.css";
import { useEffect, useState } from "react";

import { Typography } from "@heroui/react";
import { OrderConfirmation } from "../components/order-confirmation";
import { Stepper } from "../components/stepper";
import { BookingForm } from "../components/booking-form";
import { OrderReview } from "../components/order-review";
import OrderSummary from "../components/order-summary";
import { ServiceCard } from "../components/service-card";
import { getLaundryServices } from "../services/laundry-services";
import { createOrder } from "../services/order-create";
import type { LaundryService } from "../services/types/laundry";
import type { CustomerDetails, CartItem, Order } from "../services/types/order";
import type { Branch } from "../services/types/branch";

const DEFAULT_CUSTOMER_DETAILS: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
};

//--Description Enum--

const STEP_TITLE = ["Selection", "Summary", "Review", "Details"];

const DESCRIPTION_TEXT = [
  " Welcome to our laundry service! Track your laundry from start to finish with ease.",
  "Review your selected services before continuing",
  "Review your selected services before continuing.",
  "Enter your details so we can process your laundry.",
];

export const Home = () => {
  const [services, setServices] = useState<LaundryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(
    DEFAULT_CUSTOMER_DETAILS,
  );
  const [branchId, setBranchId] = useState<Branch["id"]>("");
  const [branchError, setBranchError] = useState("");
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [downPayment, setDownPayment] = useState(0);
  const [isDownPaymentEnabled, setIsDownPaymentEnabled] = useState(false);

  const onSetDownPayment = (downpayment: number) => {
    setDownPayment(Number(downpayment));
  };

  const handlePlaceOrder = async () => {
    if (!branchId) {
      setBranchError("Please select a branch.");
      setStep(1);
      return;
    }

    try {
      setPlacingOrder(true);
      setOrderError("");

      const createdOrder = await createOrder({
        cart,
        customerDetails,
        branchId,
        downPayment,
      });

      setOrder(createdOrder);
      setStep(3);
    } catch (error) {
      console.error("Failed to create order:", error);
      setOrderError("We couldn't place your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleBookingSubmit = (form: CustomerDetails) => {
    if (!branchId) {
      setBranchError("Please select a branch before continuing.");
      return;
    }

    setBranchError("");
    setCustomerDetails(form);
    setStep(2);
  };

  const addService = () => {
    setStep(0);
  };

  const onSelectBranch = (selectedBranch: Branch["id"]) => {
    setBranchId(selectedBranch);
  };

  const handleAddToOrder = (service: {
    id: string;
    name: string;
    price: number;
    unit: string;
  }) => {
    setStep(1);
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
        setStep(0);
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
    <div className="p-5">
      <Typography.Heading className="mb-3" level={1}>
        Hello,
      </Typography.Heading>
      <Typography.Paragraph className="mb-3">
        {DESCRIPTION_TEXT[step]}
      </Typography.Paragraph>

      <div className="px-5 my-5">
        <Stepper currentStep={step} steps={STEP_TITLE} />
      </div>

      {step === 0 && (
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

      {step === 1 && cart.length !== 0 && (
        <>
          <OrderSummary
            cart={cart}
            branch={branchId}
            downPayment={downPayment}
            branchError={branchError}
            isDownPaymentEnabled={isDownPaymentEnabled}
            onDownPaymentEnable={setIsDownPaymentEnabled}
            onSetDownpayment={onSetDownPayment}
            addService={addService}
            onBranchSelect={onSelectBranch}
            onRemove={handleRemoveFromOrder}
            onUpdateQuantity={handleUpdateQuantity}
          />

          <BookingForm onSubmit={handleBookingSubmit} />
        </>
      )}

      {step === 2 && (
        <>
          <OrderReview
            cart={cart}
            branch={branchId}
            customerDetails={customerDetails}
            downPayment={downPayment}
            onBack={() => setStep(1)}
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />
          {orderError && <p>{orderError}</p>}
        </>
      )}

      {step === 3 && (
        <OrderConfirmation
          customerName={order?.customer.name}
          orderNumber={order?.orderNumber}
          trackingLink={order?.trackingLink}
        />
      )}
    </div>
  );
};
