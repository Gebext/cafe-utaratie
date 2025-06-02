export const formatCurrency = (amount: string | number): string => {
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numAmount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPaymentStatusBadge = (isPaid: number | string | boolean) => {
  // Handle all possible types: number, string, boolean
  let paidStatus: boolean;

  if (typeof isPaid === "boolean") {
    paidStatus = isPaid;
  } else if (typeof isPaid === "string") {
    // Handle string values like "1", "0", "true", "false"
    paidStatus = isPaid === "1" || isPaid.toLowerCase() === "true";
  } else {
    // Handle number values
    paidStatus = isPaid === 1;
  }

  return paidStatus
    ? { variant: "default" as const, label: "Lunas" }
    : { variant: "destructive" as const, label: "Belum Lunas" };
};
