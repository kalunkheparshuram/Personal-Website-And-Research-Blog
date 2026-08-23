import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactEmail, contactMeta } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import GrowthRings from "../layout/GrowthRings";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const emptyErrors: FormValues = { name: "", email: "", message: "" };

function validate(values: FormValues): FormValues {
  const errors = { ...emptyErrors };

  if (!values.name.trim()) errors.name = "Please share your name.";
  else if (values.name.trim().length < 2)
    errors.name = "That name looks too short.";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email.trim())
    errors.email = "An email address is needed to reply.";
  else if (!emailPattern.test(values.email.trim()))
    errors.email = "That doesn't look like a valid email.";

  if (!values.message.trim())
    errors.message = "Add a few words about what you need.";
  else if (values.message.trim().length < 10)
    errors.message = "A little more detail helps — at least 10 characters.";

  return errors;
}

export default function Contact() {
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormValues>(emptyErrors);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleChange =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus("sending");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/parshuramkalunkhe@proton.me",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
            _subject: "New portfolio contact message",
            _template: "table",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      // Show success message
      setStatus("sent");

      // Clear form
      setValues({
        name: "",
        email: "",
        message: "",
      });

      // Hide success message after 2 seconds
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }

      successTimerRef.current = setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      // console.error("Contact form error:", error);

      setStatus("error");
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      id="contact"
      className="section relative overflow-hidden bg-indigo-deep py-20 text-rice"
    >
      <GrowthRings
        tone="indigo"
        className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 opacity-30"
      />
      <div className="wrap relative">
        <span className="eyebrow !text-moss-soft">PLOT_06</span>
        <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] text-rice">
          Contact
        </h2>
        <p className="mt-3 text-rice/65">
          Have a role, an engagement, or just a question about the work? Reach
          out -{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-3 font-display text-xl text-moss-soft hover:text-moss transition-colors"
          >
            {contactEmail}
          </a>
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal>
            {/* ---- Map ---- */}
            <div className="relative items-center border-b border-rice/10 pb-10 ">
              <div
                className="relative h-[400px] w-[100%] overflow-hidden rounded-md border border-rice/15 m-[0]"
                style={{
                  filter:
                    "grayscale(0.6) sepia(0.1) hue-rotate(180deg) saturate(1.1) brightness(0.85)",
                }}
              >
                <iframe
                  title="Map showing Mumbai, India"
                  src="https://maps.google.com/maps?q=Mumbai,India&z=11&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {contactMeta.map((m) => (
                <li
                  key={m.label}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="font-mono text-[11px] uppercase tracking-wide text-rice/45">
                    {m.label}
                  </span>
                  <span className="text-rice/80">{m.value}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="rounded-md border border-rice/15 bg-rice/[0.04] p-6 sm:p-8"
            >
              <div className="field mb-5">
                <label htmlFor="name" className="!text-rice/55">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange("name")}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby="name-err"
                  className="!text-rice !border-rice/25 placeholder:!text-rice/30 focus:!border-moss-soft"
                />
                <small
                  id="name-err"
                  className="mt-1 block min-h-[1.2em] font-mono text-xs text-red-300"
                >
                  {errors.name}
                </small>
              </div>

              <div className="field mb-5">
                <label htmlFor="email" className="!text-rice/55">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="email-err"
                  className="!text-rice !border-rice/25 placeholder:!text-rice/30 focus:!border-moss-soft"
                />
                <small
                  id="email-err"
                  className="mt-1 block min-h-[1.2em] font-mono text-xs text-red-300"
                >
                  {errors.email}
                </small>
              </div>

              <div className="field mb-6">
                <label htmlFor="message" className="!text-rice/55">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={handleChange("message")}
                  placeholder="Tell me what you need…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby="message-err"
                  className="!text-rice !border-rice/25 placeholder:!text-rice/30 focus:!border-moss-soft resize-y"
                />
                <small
                  id="message-err"
                  className="mt-1 block min-h-[1.2em] font-mono text-xs text-red-300"
                >
                  {errors.message}
                </small>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn !bg-moss !text-sumi hover:!shadow-lift disabled:opacity-70"
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "error"
                    ? "Try again"
                    : "Send message"}
              </button>

              <p
                role="status"
                aria-live="polite"
                className="mt-4 min-h-[1.4em] text-sm"
              >
                {status === "sent" && (
                  <span className="text-moss-soft">
                    ✓ Message sent — thanks, I'll get back to you soon.
                  </span>
                )}

                {status === "error" && (
                  <span className="text-red-300">
                    Something went wrong. Please try again or email me directly.
                  </span>
                )}
              </p>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
