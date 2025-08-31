import Socials from "@/modules/common/components/socials";
import InfoIcon from "@/modules/common/icons/info";
import PhoneIcon from "@/modules/common/icons/phone";

export default function AnnouncementBar() {
  return (
    <div className="py-3 border-b border-black/20">
      <div className="max-w-6xl mx-auto px-10 flex items-center gap-6 justify-center md:justify-between">
        <Socials className="items-center gap-4 hidden md:flex" />
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <InfoIcon className="size-4 text-neutral-400 shrink-0 mr-3" />
            <div className="text-sm">
              Otvoreni smo svaki dan od 7:30 - 15:30
            </div>
          </div>
          <div className="items-center hidden md:flex">
            <PhoneIcon className="size-4 text-neutral-400 shrink-0 mr-3" />
            <a href="tel:+ 385 1 4593 621" className="underline text-sm">
              + 385 1 4593 621
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
