import Link from 'next/link';

export default function PaymentsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-surface-900">Payments Disabled</h1>
      <div className="card-elevated p-6 space-y-3">
        <p className="text-surface-800/70">
          Payments are turned off for this college project version to keep the product simple and demo-ready.
        </p>
        <p className="text-sm text-surface-800/60">
          You can still present full flow with gigs, proposals, messages, analytics, and settings.
        </p>
        <Link href="/dashboard" className="btn-primary inline-flex">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
