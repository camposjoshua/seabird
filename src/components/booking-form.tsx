import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";

export const BookingForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pickupDate: "",
    pickupTime: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 12) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(form);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Client form</Card.Title>
        <Card.Description>Enter your information</Card.Description>
      </Card.Header>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <TextField name="email" type="email" isRequired>
            <Label>Email</Label>
            <Input
              placeholder="email@example.com"
              variant="secondary"
              onChange={handleChange}
              value={form.email}
              required
            />
          </TextField>

          <TextField name="name" type="text">
            <Label>Name</Label>
            <Input
              placeholder="Name"
              variant="secondary"
              onChange={handleChange}
              value={form.name}
            />
          </TextField>

          <TextField name="phone">
            <Label>Phone</Label>
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder="09XX XXX XXXX"
              variant="secondary"
              onChange={handleChange}
              value={form.phone}
            />
          </TextField>
        </div>

        <Button type="submit">Proceed to checkout</Button>
      </form>
    </Card>
  );
};
