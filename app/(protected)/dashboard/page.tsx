import { ChartAreaInteractive } from "@/components/dashboard/chat-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";

import data from "./data.json";

const typeddata = data as {
  header: string;
  id: number;
  type: string;
  status: string;
  target: "User A";
  limit: string;
  reviewer: string;
}[];

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={typeddata} />
    </div>
  );
}
