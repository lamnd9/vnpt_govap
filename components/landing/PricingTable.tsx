type PricingPlan = { planName: string; price: string; description: string };

type PricingTableProps = {
  pricing: PricingPlan[];
  layout?: "cards" | "table";
  title?: string;
};

export function PricingTable({ pricing, layout = "cards", title = "Bảng giá" }: PricingTableProps) {
  if (pricing.length === 0) return null;

  if (layout === "table") {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold uppercase text-blue-800 sm:text-3xl">
            {title}
          </h2>
          <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="px-4 py-3 text-sm font-bold uppercase sm:text-base">Gói dịch vụ</th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase sm:text-base">
                    Thời hạn đăng ký
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase sm:text-base">
                    Tổng gói cước (VND)
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((plan, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-blue-50/60" : "bg-white"}
                  >
                    <td className="px-4 py-3 text-sm font-bold text-blue-800 sm:text-base">
                      {plan.planName}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-semibold text-slate-700 sm:text-base">
                      {plan.description}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-red-600 sm:text-base">
                      {plan.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
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
