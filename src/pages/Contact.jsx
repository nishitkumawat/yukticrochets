export default function Contact() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-brown">Contact Us</h1>
      <p className="mt-2 text-brown/70">We would love to hear from you.</p>
      <div className="mt-8 grid gap-6">
        <a href="https://wa.me/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-luxe p-5 hover:-translate-y-1 transition">
          <div className="font-medium text-brown">WhatsApp</div>
          <div className="text-brown/70">Chat with Yukti Crochets</div>
        </a>
        <a href="mailto:" className="bg-white rounded-xl shadow-luxe p-5 hover:-translate-y-1 transition">
          <div className="font-medium text-brown">Email</div>
          <div className="text-brown/70">Write to Yukti Crochets</div>
        </a>
      </div>
    </section>
  )
}
