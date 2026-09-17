type PricingPlan = { planName: string; price: string; description: string };

export function PricingTable({ pricing }: { pricing: PricingPlan[] }) {
  if (pricing.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Bảng giá</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{plan.planName}</h3>
              <p className="mt-2 text-2xl font-bold text-blue-800">{plan.price}</p>
              <p className="mt-2 flex-1 text-sm text-slate-600">{plan.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
