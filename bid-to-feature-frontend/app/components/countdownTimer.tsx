import { useEffect, useState } from "react";

type CountdownTimerProps = {
  startDate: Date; // auction start time
  endDate: Date; // auction end time
  onComplete?: () => void; // callback when countdown hits zero
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  startDate,
  endDate,
  onComplete,
}) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();

    // Before start → not active yet
    if (now < startDate.getTime()) {
      return { status: "pending", days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // After end → completed
    if (now >= endDate.getTime()) {
      return { status: "completed", days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Active countdown
    const distance = endDate.getTime() - now;
    return {
      status: "running",
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      if (updated.status === "completed") {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  if (timeLeft.status === "pending") {
    return (
      <div className="text-gray-500 font-semibold">Bidding not started yet</div>
    );
  }

  if (timeLeft.status === "completed") {
    return <div className="text-red-600 font-semibold">Bidding ended</div>;
  }

  return (
    <div className="flex gap-4 text-center text-black font-semibold text-lg">
      <div>
        <span className="block text-2xl">{timeLeft.days}</span>
        <span className="text-sm text-gray-400">Days</span>
      </div>
      <div>
        <span className="block text-2xl">{timeLeft.hours}</span>
        <span className="text-sm text-gray-400">Hours</span>
      </div>
      <div>
        <span className="block text-2xl">{timeLeft.minutes}</span>
        <span className="text-sm text-gray-400">Minutes</span>
      </div>
      <div>
        <span className="block text-2xl">{timeLeft.seconds}</span>
        <span className="text-sm text-gray-400">Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
