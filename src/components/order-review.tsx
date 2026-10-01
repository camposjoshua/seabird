export const OrderReview = ({
  cart,
  customerDetails,
  onBack,
  onPlaceOrder,
  placingOrder,
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Review Your Order</h2>

      <section>
        <h3>Customer Information</h3>

        <p>
          <strong>Name:</strong> {customerDetails.name}
        </p>

        <p>
          <strong>Email:</strong> {customerDetails.email}
        </p>

        <p>
          <strong>Phone:</strong> {customerDetails.phone}
        </p>
      </section>

      <hr />

      <section>
        <h3>Services</h3>

        {cart.map((item) => (
          <div key={item.serviceId}>
            <h4>{item.name}</h4>

            <p>
              {item.quantity} {item.unit} × ₱{item.price}
            </p>

            <p>Subtotal: ₱{item.price * item.quantity}</p>
          </div>
        ))}
      </section>

      <hr />

      <h3>Total: ₱{total}</h3>

      <div>
        <button onClick={onBack}>Back</button>

        <button onClick={onPlaceOrder} disabled={placingOrder}>
          {placingOrder ? "Booking Service..." : "Book Service"}
        </button>
      </div>
    </div>
  );
};
