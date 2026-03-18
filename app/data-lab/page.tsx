import type { Metadata } from "next";

import { SqlLabClient } from "@/components/data-lab/sql-lab-client";

export const metadata: Metadata = {
  title: "Data Lab",
  description:
    "Query the local Rockstar sales seed and derived fact tables directly when you want the raw rows behind the UI."
};

export default function DataLabPage() {
  return <SqlLabClient />;
}
