import { Label, ListBox, Select } from "@heroui/react";

export type DropdownOption = {
  id: string;
  name: string;
};

type DropdownSelectProps<T extends DropdownOption> = {
  label: string;
  placeholder?: string;
  data: T[];
  value: T["id"] | "";
  onChange: (value: T["id"]) => void;
};

export const DropdownSelector = <T extends DropdownOption>({
  label,
  placeholder = "Select an option",
  data,
  value,
  onChange,
}: DropdownSelectProps<T>) => {
  return (
    <Select
      className="w-full"
      placeholder={placeholder}
      value={value || null}
      onChange={(key) => {
        if (key !== null) {
          onChange(key as T["id"]);
        }
      }}
    >
      <Label>{label}</Label>

      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          {data.map((item) => (
            <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
              {item.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
