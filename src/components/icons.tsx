import type { SVGProps } from "react";

export type IconName =
  | "cross"
  | "heart"
  | "stethoscope"
  | "eye"
  | "baby"
  | "syringe"
  | "microscope"
  | "scan"
  | "brain"
  | "bone"
  | "lungs"
  | "tooth"
  | "activity"
  | "shield"
  | "users"
  | "phone"
  | "mail"
  | "map"
  | "clock"
  | "calendar"
  | "facebook"
  | "whatsapp"
  | "arrow-right"
  | "check"
  | "menu"
  | "close"
  | "hand-heart"
  | "droplet"
  | "ambulance"
  | "globe"
  | "book"
  | "sparkles"
  | "building"
  | "hospital"
  | "tag";

const paths: Record<IconName, string> = {
  cross:
"M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2Zm-3 9v2h2v2h2v-2h2v-2h-2v-2h-2v2H6Z",
  heart:
"M12 21s-7.5-4.6-9.5-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9Z",
  stethoscope:
"M6 3v5a4 4 0 0 0 8 0V3M4 3h4M12 3h4m-4 9v2a4 4 0 0 0 8 0v-1M20 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  eye: "M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  baby: "M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-6 9a6 6 0 0 1 12 0v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-5Z",
  syringe:
"m14 4 6 6-2 2-1-1-6 6-1 4-4 1 1-4 6-6-1-1 2-2Zm-8 8-4 4 3 3 4-4",
  microscope:
"M9 3h3v9H9V3Zm2 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-6 12h15",
  scan: "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10",
  brain:
"M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 3 3h1V4H9Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-3 3h-1V4h0Z",
  bone: "M7 5a2.5 2.5 0 1 1 2 2l7 7a2.5 2.5 0 1 1-1.5 1.5L7 9a2.5 2.5 0 1 1 0-4Zm0 0L9 7",
  lungs: "M12 3v9m0 0c-1-2-3-3-4.5-1.5S6 15 6 17a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-5Zm0 0c1-2 3-3 4.5-1.5S18 15 18 17a3 3 0 0 1-3 3 3 3 0 0 1-3-3v-5Z",
  tooth: "M12 3c3 0 5 1 5 4 0 2-1 3-1.5 5S15 19 14 19c-.8 0-1-1-1.5-3L12 13l-.5 3C11 18 10.8 19 10 19c-1 0-1.5-3-2-7S7 7 7 7c0-3 2-4 5-4Z",
  activity: "M3 12h4l2-6 4 12 2-6h6",
  shield: "M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z",
  users:
"M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0M17 11a3.5 3.5 0 1 0 0-7M18 21a6 6 0 0 0-4-5.6",
  phone:
"M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z",
  mail: "M3 6h18v12H3V6Zm0 0 9 7 9-7",
  map: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
  calendar:
"M4 6h16v14H4V6Zm0 5h16M8 3v4m8-4v4",
  facebook:
"M14 8h2V4h-2a4 4 0 0 0-4 4v2H8v4h2v7h4v-7h2.5l.5-4H14V9c0-.6.4-1 1-1Z",
  whatsapp:
"M3 21l1.6-5A8.5 8.5 0 1 1 8 19.4L3 21Zm5.5-5.5c1 1 2 1.5 3 1.5s1.8-.5 2.4-1.2c.6-.7.6-1.6 0-2.3l-1-1c-.4-.4-1-.5-1.4-.2l-.6.5c-.2.2-.5.2-.7 0a6 6 0 0 1-2-2.4c-.1-.3 0-.6.2-.8l.5-.5c.3-.4.3-1 0-1.4l-1-1c-.7-.7-1.7-.6-2.4.1-.8.8-1 2-.6 3.2a9 9 0 0 0 3.4 3.4c.9.3 1.6.2 2.2-.3Z",
"arrow-right": "M4 12h16m0 0-6-6m6 6-6 6",
  check: "m5 13 4 4L19 7",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
"hand-heart":
"M8 13V6.5a1.5 1.5 0 0 1 3 0V11m0-.5V5.5a1.5 1.5 0 0 1 3 0V11m0-.5V7a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-1a5 5 0 0 1-3.8-1.8L5 15.5A1.8 1.8 0 0 1 8 13Z",
  droplet: "M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10Z",
  ambulance:
"M3 8h11v8H3V8Zm11 3h3l3 3v2h-6v-5ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 11h4v2H9v-2Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 4-6 4-9s-1.5-6.6-4-9c-2.5 2.4-4 6-4 9s1.5 6.6 4 9ZM3.5 9h17M3.5 15h17",
  book: "M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Zm4 15h10",
  sparkles: "M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3L12 3Zm6 10 .9 2.3 2.3.9-2.3.9L18 20l-.9-2.4-2.3-.9 2.3-.9L18 13Z",
  building:
"M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M8 7h2m3 0h2M8 11h2m3 0h2M8 15h2m3 0h2M2 21h20",
  hospital:
"M4 21V7l8-4 8 4v14M4 21h16M9 21v-5h6v5M12 8v4m-2-2h4",
  tag: "M3 12V4h8l9 9-8 8-9-9Zm5-5.5v.01",
};

const fillPaths: IconName[] = [];

export function Icon({
  name,
  className,
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  const filled = fillPaths.includes(name);
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
