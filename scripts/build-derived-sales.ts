import { derivedSalesFacts } from "@/lib/data/repository";

console.log(
  JSON.stringify(
    {
      derivedSalesFacts: derivedSalesFacts.length,
      sample: derivedSalesFacts.slice(0, 3)
    },
    null,
    2
  )
);
