import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Purchase } from "./types";

interface Product {
  ID_Produk: number;
  Nama_Produk: string;
  ID_Kategori: number;
  Harga: string;
  Stok: number;
  ID_Supplier: number;
  Deleted_At: null | string;
  Nama_Kategori: string;
  Nama_Supplier: string;
}

interface Employee {
  ID_Karyawan: number;
  Nama_Karyawan: string;
  Role: string;
  Nomor_Kontak: string;
  Email: string;
  Password: string;
  Deleted_At: null | string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T[];
}

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (purchase: Omit<Purchase, "ID_Pembelian">) => void;
  title: string;
  submitText: string;
  initialData?: Purchase;
}

export function PurchaseDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitText,
  initialData,
}: PurchaseDialogProps) {
  const [formData, setFormData] = useState<{
    Tanggal_Pembelian: string;
    Jumlah: string;
    Total_Biaya: string;
    Is_Paid: number;
    ID_Supplier: string;
    Nama_Supplier: string;
    ID_Karyawan: string;
    Nama_Karyawan: string;
    ID_Produk: string;
    Nama_Produk: string;
  }>({
    Tanggal_Pembelian: new Date().toISOString().split("T")[0],
    Jumlah: "",
    Total_Biaya: "",
    Is_Paid: 0,
    ID_Supplier: "",
    Nama_Supplier: "",
    ID_Karyawan: "",
    Nama_Karyawan: "",
    ID_Produk: "",
    Nama_Produk: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [productsRes, employeesRes] = await Promise.all([
          fetch("/api/produk?limit=100&offset=0"),
          fetch("/api/karyawan?limit=100&offset=0"),
        ]);

        if (!productsRes.ok || !employeesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData: ApiResponse<Product> = await productsRes.json();
        const employeesData: ApiResponse<Employee> = await employeesRes.json();

        if (productsData.status === "success") {
          setProducts(productsData.data);
        }
        if (employeesData.status === "success") {
          setEmployees(employeesData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Tanggal_Pembelian: new Date(initialData.Tanggal_Pembelian)
          .toISOString()
          .split("T")[0],
        Jumlah: initialData.Jumlah.toString(),
        Total_Biaya: initialData.Total_Biaya,
        Is_Paid: Number(initialData.Is_Paid) ?? 0,
        ID_Supplier: initialData.ID_Supplier.toString(),
        Nama_Supplier: initialData.Nama_Supplier,
        ID_Karyawan: initialData.ID_Karyawan.toString(),
        Nama_Karyawan: initialData.Nama_Karyawan,
        ID_Produk: initialData.ID_Produk.toString(),
        Nama_Produk: initialData.Nama_Produk,
      });
    } else {
      setFormData({
        Tanggal_Pembelian: new Date().toISOString().split("T")[0],
        Jumlah: "",
        Total_Biaya: "",
        Is_Paid: 0,
        ID_Supplier: "",
        Nama_Supplier: "",
        ID_Karyawan: "",
        Nama_Karyawan: "",
        ID_Produk: "",
        Nama_Produk: "",
      });
    }
  }, [initialData, open]);

  useEffect(() => {
    const selectedProduct = products.find(
      (p) => p.ID_Produk.toString() === formData.ID_Produk
    );

    const jumlah = parseInt(formData.Jumlah);
    const harga = selectedProduct ? parseInt(selectedProduct.Harga) : 0;

    if (!isNaN(jumlah) && selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        Total_Biaya: (jumlah * harga).toString(),
      }));
    }
  }, [formData.Jumlah, formData.ID_Produk, products]);

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(
      (p) => p.ID_Produk.toString() === productId
    );
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        ID_Produk: productId,
        Nama_Produk: selectedProduct.Nama_Produk,
        ID_Supplier: selectedProduct.ID_Supplier.toString(),
        Nama_Supplier: selectedProduct.Nama_Supplier,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Tanggal_Pembelian ||
      !formData.Jumlah ||
      !formData.ID_Produk ||
      !formData.ID_Karyawan
    ) {
      return;
    }

    onSubmit({
      Tanggal_Pembelian: new Date(formData.Tanggal_Pembelian).toISOString(),
      Jumlah: Number.parseInt(formData.Jumlah),
      Total_Biaya: formData.Total_Biaya,
      Is_Paid: Number(formData.Is_Paid),
      ID_Supplier: Number.parseInt(formData.ID_Supplier),
      Nama_Supplier: formData.Nama_Supplier,
      ID_Karyawan: Number.parseInt(formData.ID_Karyawan),
      Nama_Karyawan: formData.Nama_Karyawan,
      ID_Produk: Number.parseInt(formData.ID_Produk),
      Nama_Produk: formData.Nama_Produk,
    });

    setFormData({
      Tanggal_Pembelian: new Date().toISOString().split("T")[0],
      Jumlah: "",
      Total_Biaya: "",
      Is_Paid: 0,
      ID_Supplier: "",
      Nama_Supplier: "",
      ID_Karyawan: "",
      Nama_Karyawan: "",
      ID_Produk: "",
      Nama_Produk: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle
            className="text-[#1e6091]"
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            {title}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit informasi pembelian"
              : "Tambahkan pembelian baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Tanggal_Pembelian">Tanggal Pembelian</Label>
                <Input
                  id="Tanggal_Pembelian"
                  type="date"
                  value={formData.Tanggal_Pembelian}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Tanggal_Pembelian: e.target.value,
                    })
                  }
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ID_Produk">Produk</Label>
                <Select
                  value={formData.ID_Produk}
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                    <SelectValue placeholder="Pilih produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.ID_Produk}
                        value={product.ID_Produk.toString()}
                      >
                        {product.Nama_Produk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Jumlah">Jumlah</Label>
                <Input
                  id="Jumlah"
                  type="number"
                  value={formData.Jumlah}
                  onChange={(e) =>
                    setFormData({ ...formData, Jumlah: e.target.value })
                  }
                  placeholder="0"
                  className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ID_Karyawan">Karyawan</Label>
                <Select
                  value={formData.ID_Karyawan}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      ID_Karyawan: value,
                      Nama_Karyawan:
                        employees.find(
                          (e) => e.ID_Karyawan.toString() === value
                        )?.Nama_Karyawan || "",
                    })
                  }
                >
                  <SelectTrigger className="border-[#c9d6df] focus:ring-[#1e6091]">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee.ID_Karyawan}
                        value={employee.ID_Karyawan.toString()}
                      >
                        {employee.Nama_Karyawan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Total_Biaya">Total Biaya (Rp)</Label>
                <Input
                  id="Total_Biaya"
                  type="number"
                  value={formData.Total_Biaya}
                  readOnly
                  className="border-[#c9d6df] bg-gray-50 focus-visible:ring-[#1e6091]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Nama_Supplier">Supplier</Label>
                <Input
                  id="Nama_Supplier"
                  value={formData.Nama_Supplier}
                  className="border-[#c9d6df] bg-gray-50 focus-visible:ring-[#1e6091]"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#1e6091] hover:bg-[#154c74]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
