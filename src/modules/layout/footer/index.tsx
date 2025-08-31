export default function Footer() {
  return (
    <footer className="flex py-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-10 flex-col md:flex-row items-center md:justify-between gap-2 text-neutral-500 border-t border-neutral-300 text-center md:text-left">
      <div>
        <p>Studentski centar u Zagrebu</p>
        <p className="mt-1">Sva prava zadržana {new Date().getFullYear()}</p>
      </div>
      <p>
        Izradio{" "}
        <a href="https://refresh.hr" className="underline hover:text-black">
          Refresh.hr
        </a>
      </p>
    </footer>
  );
}
