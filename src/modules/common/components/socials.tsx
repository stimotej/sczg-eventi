import { socialItems } from "@/lib/utils/constants";

export default function Socials({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {socialItems.map((si) => (
        <li key={si.id}>
          <a
            href={si.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-black"
          >
            <si.icon className="size-5" />
            <span className="sr-only">{si.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
