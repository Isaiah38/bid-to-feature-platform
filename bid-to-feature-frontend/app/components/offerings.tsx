import { LuDollarSign, LuMapPin, LuTrendingUp } from "react-icons/lu";
import { asset } from "~/resources/image";

interface Offering {
  title: string;
  description: string;
  image: string;
  location?: string;
  returnRate?: number;
  minimumInvestment?: number;
  status?: String;
}

interface OfferingCardProps {
  offering: Offering;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ offering }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300  overflow-hidden cursor-pointer relative">
      <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-2">
        {/* Profile Image */}
        <div className="w-18 h-18 bg-amber-900 rounded-full overflow-hidden">
          <img
            src={offering.image}
            alt={`${offering.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={asset.image.GemspotBg}
          alt="gemspot bg image"
          className="object-cover w-full h-full transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {offering.title}
        </h3>

        {/* CTA */}
        <div className="mt-4">
          <button className="w-max p-2 px-4 rounded-lg font-semibold text-sm bg-[#7eaa25] text-white hover:bg-[#6b9020] transition">
            Discover
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Offerings() {
  const offerings = [
    {
      title: "DeFi Coffee Hub",
      description:
        "A blockchain-powered café loyalty program turning every sip into tokenized rewards. Community-backed and growing fast.",
      image: asset.image.GemspotBW,
      location: "Miami, FL",
      returnRate: 18,
      minimumInvestment: 500,
      status: "Open",
    },
    {
      title: "NFT Fashion Collective",
      description:
        "Digital-first fashion house blending NFT drops with physical streetwear. Early investors get governance tokens + perks.",
      image: asset.image.GemspotBW,
      location: "Los Angeles, CA",
      returnRate: 15,
      minimumInvestment: 1000,
      status: "Open",
    },
    {
      title: "Creator DAO Launchpad",
      description:
        "A platform helping independent creators tokenize their content and build fan-driven economies.",
      image: asset.image.GemspotBW,
      location: "New York, NY",
      returnRate: 20,
      minimumInvestment: 2000,
      status: "Upcoming",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {offerings.map((offering, index) => (
        <div key={index}>
          <OfferingCard offering={offering} />
        </div>
      ))}
    </div>
  );
}
