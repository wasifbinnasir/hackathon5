import { useEffect, useState } from "react";

// CountdownBox component
export default function CountdownBox({ value }: { value: string }) {
  const endTime = new Date(value).getTime();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const diff = endTime - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="flex items-center gap-1">
        {Object.entries(timeLeft).map(([k, v]) => (
          <div
            key={k}
            className="w-6 h-6 flex justify-center items-center bg-[#F4C23D] text-white text-xs rounded"
          >
            {v}
          </div>
        ))}
      </div>
    </>
  );
}
