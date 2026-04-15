import { company } from "@/lib/constants";

export default function EmailButton() {
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(company.email)}`;

  return (
    <a
      href={gmailComposeUrl}
      className="email-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Send email"
      title="Send email"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.5-.5a.5.5 0 0 0-.5.5v.38l7 4.67 7-4.67V5.5a.5.5 0 0 0-.5-.5h-13Zm13.5 3.28-6.45 4.3a1 1 0 0 1-1.1 0L5 8.28v10.22a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V8.28Z"
        />
      </svg>
    </a>
  );
}
