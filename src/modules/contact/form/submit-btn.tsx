import Button from "@/modules/common/components/button";
import LoaderIcon from "@/modules/common/icons/loader";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending && <LoaderIcon className="size-5 mr-2 animate-spin" />}
      {children}
    </Button>
  );
}
