import { useState } from "react";
import { ArrowLeft, Bitcoin, Check, Copy, CreditCard, IndianRupee, Wallet } from "lucide-react";

// ---- Fill in your real payment details before publishing ----
// These are placeholders so the page renders correctly out of the box;
// swap each one for your actual PayPal.me link, Razorpay payment link,
// wallet address, and UPI ID.
const PAYMENT_METHODS = [
  {
    id: "paypal",
    label: "PayPal",
    icon: Wallet,
    value: "paypal.me/parshuramkalunkhe",
    href: "https://paypal.me/parshuramkalunkhe",
    note: "International payments, cards, and bank transfers via PayPal.",
  },
  {
    id: "razorpay",
    label: "Razorpay",
    icon: CreditCard,
    value: "razorpay.me/@REPLACE_ME",
    // BUG FIX: this had a live href pointing at the literal placeholder
    // URL (razorpay.me/@REPLACE_ME), so the "Open Razorpay" button was
    // clickable and sent visitors to a real but broken page. Left as
    // `undefined` — same as the crypto/upi cards below — until a real
    // Razorpay payment link is filled in; the button only renders when
    // `href` is set (see PaymentCard below).
    href: undefined,
    note: "UPI, cards, netbanking, and wallets — best for India-based payments.",
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: Bitcoin,
    value: "REPLACE_WITH_YOUR_WALLET_ADDRESS",
    href: undefined,
    note: "BTC / ETH / USDT (TRC20) — double-check the network before sending.",
  },
  {
    id: "upi",
    label: "UPI",
    icon: IndianRupee,
    value: "parshuramkalunkhe@upi",
    href: undefined,
    note: "Any UPI app — GPay, PhonePe, Paytm, or your bank's app.",
  },
] as const;

function PaymentCard({ method }: { method: (typeof PAYMENT_METHODS)[number] }) {
  const [copied, setCopied] = useState(false);
  const Icon = method.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(method.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — the value
      // is still visible on the card for the visitor to copy manually.
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border border-stone-line bg-rice-raised p-5 shadow-soft transition-transform duration-300 ease-zen hover:-translate-y-1 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss/10 text-moss-deep">
          <Icon size={20} strokeWidth={1.6} />
        </span>
        <h2 className="font-display text-xl text-sumi">{method.label}</h2>
      </div>

      <p className="text-sm text-sumi-soft">{method.note}</p>

      <div className="mt-auto flex items-center gap-2 rounded-sm border border-stone-line-strong bg-rice px-3 py-2.5">
        <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-sumi">{method.value}</code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${method.label} details`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-moss-deep transition-colors duration-200 hover:bg-moss/10"
        >
          {copied ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={1.8} />}
        </button>
      </div>

      {method.href && (
        <a
          href={method.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-sm bg-sumi px-4 py-3 font-mono text-[12px] uppercase tracking-wide text-rice transition-transform duration-300 ease-zen hover:-translate-y-0.5 hover:shadow-soft sm:w-auto sm:py-2.5"
        >
          Open {method.label}
        </a>
      )}
    </div>
  );
}

export default function PayPage() {
  return (
    <main className="flex min-h-screen min-h-dvh flex-col bg-rice">
      <div className="wrap flex items-center py-6">
        <a
          href="./index.html"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-sumi/70 transition-colors duration-200 hover:text-moss-deep"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to portfolio
        </a>
      </div>

      {/* BUG FIX: this block used to be `flex flex-1 flex-col justify-center`,
          vertically centering the whole hero+grid inside the full-viewport
          `<main>`. That's fine only while the content is shorter than the
          viewport — with 4 stacked cards on a narrow phone the content is
          taller than the screen, and centering overflowing content inside
          a `min-h-dvh` container gets visibly jumpy on mobile Safari as
          `dvh` recalculates while the URL bar shows/hides during scroll.
          A plain top-down flow with generous, breakpoint-aware padding is
          both simpler and stable on every device. */}
      <div className="wrap flex-1 py-8 sm:py-10">
        <p className="eyebrow mb-4">Support / Payments</p>
        <h1 className="max-w-xl text-[2.1rem] leading-tight sm:text-5xl">
          Ways to <span className="italic text-moss-deep">pay</span>
        </h1>
        <p className="mt-5 max-w-[54ch] text-base text-sumi-soft sm:text-lg">
          For a completed engagement, a bounty thank-you, or just buying me a coffee — pick
          whichever works best for you.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {PAYMENT_METHODS.map((method) => (
            <PaymentCard key={method.id} method={method} />
          ))}
        </div>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-stone-line py-6 text-[13px] text-sumi/50 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0">© {new Date().getFullYear()} Parshuram Kalunkhe. Vibe Coded - Claude.</p>
        <p className="m-0 font-mono">// stay curious. stay secure.</p>
      </div>
    </main>
  );
}
