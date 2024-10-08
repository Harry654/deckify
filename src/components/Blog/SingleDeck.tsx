import Image from "next/image";
import { MouseEventHandler } from "react";

const SingleDeck = ({
  image,
  slug,
  title,
  date,
  handleClicked,
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
  handleClicked: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="flex items-center lg:block xl:flex">
      <div className="mr-5 lg:mb-3 xl:mb-0">
        <div className="relative h-[60px] w-[70px] overflow-hidden rounded-md sm:h-[75px] sm:w-[85px]">
          <Image src={image} alt={title} fill />
        </div>
      </div>
      <div className="w-full">
        <h5>
          <button
            onClick={handleClicked}
            className="mb-[6px] block text-base font-medium leading-snug text-black hover:text-primary dark:text-white dark:hover:text-primary"
          >
            {title}
          </button>
        </h5>
        <p className="text-xs font-medium text-body-color">{date}</p>
      </div>
    </div>
  );
};

export default SingleDeck;
