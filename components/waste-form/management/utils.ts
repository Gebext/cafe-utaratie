import { WasteReport } from "./types";

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Dikonfirmasi":
      return "default" as const;
    case "Ditindaklanjuti":
      return "secondary" as const;
    case "Pending":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

export const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "Expired":
      return "destructive" as const;
    case "Waste":
      return "secondary" as const;
    case "Break":
      return "outline" as const;
    default:
      return "outline" as const;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const calculateStats = (reports: WasteReport[]) => {
  const totalWasted = reports.reduce(
    (sum, report) => sum + report.Jumlah_Terbuang,
    0
  );
  const pendingReports = reports.filter(
    (r) => r.Status_Laporan === "Pending"
  ).length;
  const expiredItems = reports.filter(
    (r) => r.Jenis_Laporan === "Expired"
  ).length;

  return {
    totalReports: reports.length,
    totalWasted,
    pendingReports,
    expiredItems,
  };
};

export const filterReports = (reports: WasteReport[], searchTerm: string) => {
  return reports.filter((report) => {
    const matchesSearch =
      report.Nama_Produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.Nama_Karyawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.Alasan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
};
