import { Button } from "@heroui/react";

export const OrderSummary = ({
  cart,
  onRemove,
  onUpdateQuantity,
  addService,
}) => {
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
