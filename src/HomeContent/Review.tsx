import { Star } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-gray-800 stroke-gray-800" : "stroke-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function Review() {
  const reviews = [
    {
      id: "r1",
      name: "Nadia Chowdhury",
      title: "Echoes of Tomorrow",
      quote:
        "The story hit harder than I expected. Honest, emotional, and surprisingly close to real life.",
      rating: 5,
      avatar: "/avatars/nadia.jpg",
    },
    {
      id: "r2",
      name: "Tawhid Hasan",
      title: "Fragments of Midnight",
      quote:
        "Didn't think I'd relate to a character this much. It's like reading my own thoughts in print.",
      rating: 4,
      avatar: "/avatars/tawhid.jpg",
    },
    {
      id: "r3",
      name: "Sumaiya Rahim",
      title: "Beneath the Blue Sky",
      quote:
        "Warm, reflective, and deeply human. Every page feels like a quiet conversation with an old friend.",
      rating: 5,
      avatar: "/avatars/sumaiya.jpg",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-[80%]">
        <div className="mb-8">
            <h2 className="text-4xl text-center font-bold text-gray-900">What Readers Say</h2>
            <p className="mt-2 text-xl text-center text-gray-600">Real people. Real stories.</p>
        </div>

        <div className="grid gap-20 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className=" rounded-2xl drop-shadow-2xl p-6 shadow-xl border-[0.1px] border-gray-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                  <img src={r.avatar} alt={r.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className=" font-semibold text-gray-900">{r.name}</div>
                  <div className="text-sm text-gray-500">on {r.title}</div>
                </div>
                <div className="ml-auto">
                  <Stars rating={r.rating} />
                </div>
              </div>

              <p className="mt-4 text-gray-700">“{r.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
