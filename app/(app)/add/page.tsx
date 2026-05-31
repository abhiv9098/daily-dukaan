import { TransactionForm } from "@/components/transactions/transaction-form";

export default function AddPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Add Entry
        </h1>
        <p className="text-muted-foreground">
          Record a new income or expense for your shop.
        </p>
      </div>
      <TransactionForm />
    </div>
  );
}
