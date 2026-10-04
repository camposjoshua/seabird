import { Button, Card } from "@heroui/react";
import type { LaundryService } from "../services/types/laundry";

type ServiceCardProps = {
  service: LaundryService;
  onSelect: (service: LaundryService) => void;
};

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  return (
    <Card className="w-full items-stretch md:flex-row">
      <div className="display-none relative shrink-0 overflow-hidden rounded-2xl md:h-[120px] md:w-[120px]">
        <img
          alt="Cherries"
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Card.Header className="gap-1">
          <Card.Title className="pe-8">{service.name}</Card.Title>
          <Card.Description>{service.description}</Card.Description>
        </Card.Header>
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {" "}
              ₱{service.price} / {service.unit}
            </span>
          </div>
          <Button
            onPress={() => onSelect(service)}
            className="w-full sm:w-auto"
          >
            Select Service
          </Button>
        </Card.Footer>
      </div>
    </Card>
  );
};
