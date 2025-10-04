
export default function ContactForm() {
  return (
    <section className="bg-indigo-50 py-10">
      <div className="mx-auto w-full max-w-lg px-4">
        <h2 className="mb-8 text-center text-4xl text-gray-800 font-bold">Contact Us</h2>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
          <div className="grid gap-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                id="name"
                placeholder="Your name"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us what you need…"
                className="w-full resize-y rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
