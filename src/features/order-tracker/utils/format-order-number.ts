export const formatOrderNumber = (orderNumber: string) => {
  return `LAU-${orderNumber.slice(-4)}`;
};
