import { LuMail } from "react-icons/lu";
import { Button } from "./button";

export function NewsLetter() {
  return (
    <section className="mt-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
          <LuMail className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Subscribe to our newsletter
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get exclusive real estate investment insights, market analysis, and
          deal opportunities delivered straight to your inbox every week.
        </p>
      </div>
      <div className="max-w-md mx-auto">
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className=" w-full border  p-2 rounded text-black flex-1 h-12 px-4 border-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
          <Button
            text="Subscribe"
            className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          />
        </form>
      </div>
    </section>
  );
}
