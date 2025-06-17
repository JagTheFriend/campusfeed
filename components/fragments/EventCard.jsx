import Image from "next/image";
import { useState } from "react";

const EventCard = ({ event }) => {
  const [imageSrc, setImageSrc] = useState(event.eventPoster);
  const eventDate = event.eventDate.split("-");

  return (
    <div className="flex w-full max-w-[300px] flex-col">
      <Image
        src={imageSrc}
        alt="event"
        width={250}
        height={250}
        className="aspect-square w-full rounded-2xl border-[3px] border-[#D3DEE3] object-contain sm:border-[4px] md:border-[5px]"
        onError={(e) => {
          e.target.onerror = null;
          setImageSrc("/fallbackImage.svg");
        }}
      />
      <div className="mt-3 flex w-full gap-2">
        <div className="flex min-w-[50px] flex-col items-center rounded-md text-center">
          <p className="w-full rounded-t-md bg-[#8690B1] px-3 py-1 text-[10px] text-[#FCFDFD] sm:text-xs">
            {eventDate[0]}
          </p>
          <p className="w-full bg-[#E7EDF0] px-3 text-base font-medium sm:text-lg">
            {eventDate[1]}
          </p>
          <p className="-mt-1 w-full rounded-b-md bg-[#E7EDF0] px-3 pb-1 text-[10px] sm:text-xs">
            {eventDate[2]}
          </p>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="line-clamp-1 text-sm font-medium max-sm:w-[85%] sm:text-base">
            {event.eventName}
          </p>
          <p className="text-xs font-medium text-gray-700 sm:text-sm">
            {event.eventLocation}
          </p>
          <p className="text-xs text-black/60 sm:text-sm">
            Rs.{event.eventPrize}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
