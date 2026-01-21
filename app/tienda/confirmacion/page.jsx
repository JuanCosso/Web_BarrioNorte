export default function Confirmacion({ searchParams }) {
    const orderId = searchParams?.orderId;
  
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-extrabold text-neutral-900">Orden creada</h1>
        <p className="mt-3 text-neutral-700">
          Tu orden fue generada{orderId ? ` (ID: ${orderId})` : ""}. Cuando conectes
          Mercado Pago/Stripe, esta página va a mostrar “Pago aprobado / pendiente”.
        </p>
      </div>
    );
  }
  