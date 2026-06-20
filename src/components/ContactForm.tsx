import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { ServicePillar, Settings } from "../types";

interface ContactFormProps {
  services: ServicePillar[];
  settings: Settings;
}

// Web3Forms access keys are public and intended for client-side forms.
const accessKey = "d3220e88-1292-4ce5-bcab-0182f415436c";

export default function ContactForm({
  services,
  settings
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", accessKey);
    formData.append("subject", "New website enquiry — Perficient 360 Agency");
    formData.append("from_name", "Perficient 360 Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const result = await response.json() as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Your message could not be sent.");
      }

      form.reset();
      setStatus("success");
      setMessage("Thank you. We received your enquiry and will reply soon.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-800 bg-[#090b10] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500";

  return (
    <section
      id="contact"
      className="deferred-section border-t border-gray-900 bg-[#0a0c10] py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-widest uppercase">
              Start a Project
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
              Tell us what you want to build
            </h2>
            <p className="mt-5 max-w-lg text-sm md:text-base leading-7 text-gray-400">
              Share your goals, required service, and expected timeline. Our team will respond using the email address you provide.
            </p>
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="mt-7 inline-flex items-center gap-3 text-sm text-indigo-300 hover:text-white"
              >
                <Mail size={18} aria-hidden="true" />
                {settings.email}
              </a>
            )}
          </div>

          <form
            onSubmit={submitForm}
            className="rounded-3xl border border-gray-800 bg-[#0d1017] p-5 md:p-8"
          >
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-xs text-gray-400">
                Full name *
                <input
                  className={`${inputClass} mt-2`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="text-xs text-gray-400">
                Email address *
                <input
                  className={`${inputClass} mt-2`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="text-xs text-gray-400">
                Phone / Viber
                <input
                  className={`${inputClass} mt-2`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </label>
              <label className="text-xs text-gray-400">
                Interested service
                <select className={`${inputClass} mt-2`} name="service" defaultValue="">
                  <option value="">Select a service</option>
                  {services
                    .filter((service) => service.status === "published")
                    .sort((a, b) => (a.order || 99) - (b.order || 99))
                    .map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="text-xs text-gray-400">
                Estimated budget
                <select className={`${inputClass} mt-2`} name="budget" defaultValue="">
                  <option value="">Select a range</option>
                  <option value="Under 1,000,000 MMK">Under 1,000,000 MMK</option>
                  <option value="1,000,000–3,000,000 MMK">1,000,000–3,000,000 MMK</option>
                  <option value="3,000,000–10,000,000 MMK">3,000,000–10,000,000 MMK</option>
                  <option value="Above 10,000,000 MMK">Above 10,000,000 MMK</option>
                </select>
              </label>
              <label className="text-xs text-gray-400">
                Preferred timeline
                <input
                  className={`${inputClass} mt-2`}
                  name="timeline"
                  type="text"
                  placeholder="e.g. Within one month"
                />
              </label>
            </div>

            <label className="mt-5 block text-xs text-gray-400">
              Project details *
              <textarea
                className={`${inputClass} mt-2 min-h-36 resize-y`}
                name="message"
                required
                placeholder="Tell us about your business, goals, and requirements."
              />
            </label>

            {message && (
              <div
                role="status"
                className={`mt-5 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {status === "success" && <CheckCircle2 size={18} aria-hidden="true" />}
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? (
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              ) : (
                <Send size={18} aria-hidden="true" />
              )}
              {status === "sending" ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
