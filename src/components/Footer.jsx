export default function Footer() {
  return (
    <footer className="bg-white border-t border-tan/40 text-brown">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif text-xl">Yukti Crochets</div>
        <div className="text-sm">© {new Date().getFullYear()} Yukti Crochets. All rights reserved.</div>
      </div>
    </footer>
  )
}
