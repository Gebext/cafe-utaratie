import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WasteReport } from "./types";
import { WasteReportChart } from "../waste-report-chart";

interface WasteReportChartCardProps {
  data: WasteReport[];
}

export function WasteReportChartCard({ data }: WasteReportChartCardProps) {
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Analisis Kehilangan
        </CardTitle>
        <CardDescription>
          Distribusi jenis laporan kehilangan bahan baku
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WasteReportChart data={data} />
      </CardContent>
    </Card>
  );
}
