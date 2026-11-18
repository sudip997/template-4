"use client";

import { ArrowRight, Check, CircleAlert, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success";

/** A deliberately forgiving check: one "@", no spaces, a dot in the domain.
 *  Your email provider does the real validation. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Placeholder for the template: replace the body with a call to your email
 * provider (a Server Action or a Route Handler that talks to Mailchimp,
 * Resend, ConvertKit and so on). It resolves after a short delay so the
 * loading and success states are visible. Throw to show the error message.
 */
async function subscribeToNewsletter(email: string): Promise<void> {
  void email;
  await new Promise((resolve) => setTimeout(resolve, 700));
}

/**
 * Newsletter card for the Footer. A native form with its own validation, so
 * the messages are consistent across browsers: an empty or malformed address
 * shows an inline error tied to the input, focus returns to the field, and
 * success swaps the form for a confirmation with a way to start over. A hidden
 * live region announces progress to screen readers.
 */
export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const reduceMotion = useReducedMotion();
  const id = useId();
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;
  const headingId = `${id}-heading`;

  const inputRef = useRef<HTMLInputElement>(null);
  const refocusInput = useRef(false);

  const submitting = status === "submitting";

  // After "Use a different email", the form is rendered again; put focus back
  // in the field once it exists.
  useEffect(() => {
    if (status === "idle" && refocusInput.current) {
      refocusInput.current = false;
      inputRef.current?.focus();
    }
  }, [status]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const value = email.trim();

    if (!value) {
      setError("Enter your email address.");
      inputRef.current?.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("That email doesn't look right. Check it and try again.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setStatus("submitting");

    try {
      await subscribeToNewsletter(value);
      setStatus("success");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Try again in a moment.");
    }
  };

  const startOver = () => {
    setEmail("");
    refocusInput.current = true;
    setStatus("idle");
  };

  const liveMessage =
    status === "submitting"
      ? "Subscribing…"
      : status === "success"
        ? "You're subscribed. Check your inbox to confirm your email address."
        : "";

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-card bg-linear-to-br from-brand-violet/[0.07] via-transparent to-brand-blue/[0.04] p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 100% 0%, rgb(167 139 250 / 0.16), transparent 72%), radial-gradient(ellipse 60% 50% at 0% 100%, rgb(96 165 250 / 0.1), transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/50 to-transparent"
      />

      <div className="flex items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-violet">
          <Mail className="size-[18px]" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3
            id={headingId}
            className="font-heading text-base leading-snug font-semibold tracking-[-0.02em] text-foreground"
          >
            Marketing notes, once a month
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
            Playbooks, benchmarks and product updates from the Vantora team.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {status === "success" ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3 rounded-xl border border-brand-violet/25 bg-brand-violet/[0.07] p-4"
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-background">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                You&apos;re on the list
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                Check your inbox to confirm{" "}
                <span className="break-all text-foreground">{email.trim()}</span>
                .{" "}
                <button
                  type="button"
                  onClick={startOver}
                  className="rounded-sm text-foreground underline decoration-white/25 underline-offset-4 outline-none transition-colors hover:decoration-brand-violet focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
                >
                  Use a different email
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                ref={inputRef}
                id={inputId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={handleChange}
                readOnly={submitting}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="h-10 min-w-0 sm:flex-1 rounded-lg border border-white/10 bg-background/70 px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:border-white/20 focus-visible:border-brand-violet/60 focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive/70 aria-invalid:focus-visible:ring-destructive/30 motion-reduce:transition-none"
              />
              <button
                type="submit"
                aria-disabled={submitting}
                className={cn(
                  linkButtonVariants({ variant: "primary", size: "md" }),
                  "sm:min-w-[8.5rem] aria-disabled:pointer-events-none aria-disabled:opacity-70",
                )}
              >
                {submitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background motion-reduce:animate-none"
                    />
                    Subscribing…
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>

            {error ? (
              <p
                id={errorId}
                role="alert"
                className="mt-2.5 flex items-start gap-1.5 text-[13px] leading-snug text-destructive"
              >
                <CircleAlert
                  className="mt-px size-3.5 shrink-0"
                  aria-hidden="true"
                />
                {error}
              </p>
            ) : null}

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              One email a month. Unsubscribe anytime. Read our{" "}
              <Link
                href="/privacy"
                className="rounded-sm text-foreground/90 underline decoration-white/25 underline-offset-4 outline-none transition-colors hover:text-foreground hover:decoration-brand-violet focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
              >
                privacy policy
              </Link>
              .
            </p>
          </form>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </p>
    </div>
  );
}
