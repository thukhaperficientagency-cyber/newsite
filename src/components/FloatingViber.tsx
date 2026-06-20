import { Settings } from "../types";

interface FloatingViberProps {
  settings: Settings;
}

export default function FloatingViber({
  settings
}: FloatingViberProps) {
  if (!settings.phone) return null;

  const phoneNumber = settings.phone.replace(/[^\d+]/g, "");
  const encodedPhone = encodeURIComponent(
    phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`
  );
  const viberUrl = `viber://chat?number=${encodedPhone}`;

  return (
    <a
      href={viberUrl}
      aria-label={`Chat with ${settings.brandName} on Viber`}
      title="Chat with us on Viber"
      className="fixed right-5 bottom-5 md:right-7 md:bottom-7 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#7360f2] hover:bg-[#6652e8] text-white shadow-[0_12px_35px_rgba(115,96,242,0.45)] flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <svg
        viewBox="0 0 32 32"
        width="31"
        height="31"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M25.6 5.9C23.2 3.8 19.7 2.8 16 2.8c-3.7 0-7.2 1-9.6 3.1C4 8 2.8 11 2.8 14.4c0 4.9 2.5 8.8 6.8 10.8v3.7c0 .4.5.7.8.4l4.3-3c.4 0 .9.1 1.3.1 3.7 0 7.2-1 9.6-3.1 2.4-2.1 3.6-5.1 3.6-8.5 0-3.8-1.2-6.8-3.6-8.9Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12.2 9.7c.4-.2.8-.1 1 .3l1.4 2.4c.2.4.2.8-.1 1.1l-.8.8c.7 1.7 2 3 3.7 3.7l.8-.8c.3-.3.7-.3 1.1-.1l2.4 1.4c.4.2.5.7.3 1-1 1.8-2.8 2.4-4.6 1.8-4.4-1.5-7.9-5-9.4-9.4-.6-1.8.1-3.6 1.8-4.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.2 8.4c2.8.5 4.9 2.7 5.4 5.4M18.1 11.4c1.3.3 2.3 1.3 2.6 2.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20" />
    </a>
  );
}
