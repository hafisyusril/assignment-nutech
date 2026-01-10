export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${randomNum.toString().padStart(3, "0")}`;
}
