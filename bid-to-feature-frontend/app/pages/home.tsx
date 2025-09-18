import Offerings from "~/components/offerings";
import { asset } from "~/resources/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-max">
          <div className="max-w-3xl mx-auto text-center mt-16 sm:mt-20 md:mt-28">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-snug space-y-2">
              <span className="block text-white">Discover Hidden Gems</span>
              <span className="block text-[#BBF451]">Businesses, Creators</span>
              <span className="block text-white">Portfolios</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-8 px-2 sm:px-0">
              From innovative startups to inspiring artists, we spotlight talent
              and give you the chance to connect, bid, and feature your brand
              where it matters most.
            </p>
          </div>
        </div>

        {/* Trending Business */}
        <section className="space-y-8 sm:space-y-12 py-12">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#7eaa25]">
              Trending Business
            </h2>
            <p className="text-sm sm:text-md text-gray-300">
              Discover founders, startups, and projects
            </p>
          </div>
          <Offerings />
        </section>

        {/* Trending Socials */}
        {/* <section className="mt-12 sm:mt-16 space-y-8 sm:space-y-12 py-12">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#7eaa25]">
              Trending Socials
            </h2>
            <p className="text-sm sm:text-md text-gray-300">
              Explore creators, communities, and socials making waves
            </p>
          </div>
          <Offerings />
        </section> */}

        {/* About Section */}
        <section className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-[#7eaa25] font-bold text-2xl sm:text-3xl md:text-4xl">
                  About Us
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Built on Transparency, Growing with Trust
                </p>
              </div>
              <p className="text-sm sm:text-md text-gray-300 leading-7 sm:leading-8">
                Gempspot is a Web3-powered platform spotlighting businesses,
                creators, and projects through community-driven bidding. We
                believe in giving visibility where it matters most with
                fairness, transparency, and on-chain trust.
              </p>
            </div>

            {/* Product Image */}
            <div className="relative">
              <img
                src={asset.image.GemspotBW}
                alt="Featured Project"
                className="w-full h-64 sm:h-80 md:h-[400px] object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
