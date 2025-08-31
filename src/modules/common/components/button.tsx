import { cn } from "@/lib/utils/cn";

export const buttonClassName = cn(
  "px-8 py-3 text-xl tracking-normal text-center",
  "flex items-center justify-center w-fit text-(--background) bg-(--primary) border-(--foreground)",
  "transition-colors hover:bg-(--foreground)"
);

export default function Button(props: React.ComponentProps<"button">) {
  return <button {...props} className={cn(buttonClassName, props.className)} />;
}
