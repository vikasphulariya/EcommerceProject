/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

function Carousal({ children: slides, autoChangeTime = 3000, autoSlide }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = () => {
    setCurrent((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const next = () => {
    setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    if (!autoSlide || isPaused) {
      return;
    }
    const interval = setInterval(() => {
      next();
    }, autoChangeTime);

    return () => clearInterval(interval);
  }, [autoSlide, autoChangeTime, isPaused, current]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      className="overflow-hidden  relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="carousel flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {React.Children.map(slides, (slide, index) => (
          <div
            className="w-full flex justify-center flex-shrink-0 rounded-md overflow-hidden"
            key={index}
          >
            {slide}
          </div>
        ))}
      </div>
      <div
        style={{ fontSize: "clamp(1.3rem,6vw,3.3rem" }}
        className="absolute top-1/2 transform text-blue-950  -translate-y-1/2 left-0   w-full flex justify-between p-1 sm:p-2 md:p-3"
      >
        <button onClick={prev} className=" bg-transparent " type="button">
          <IoIosArrowDropleftCircle />
        </button>
        <button onClick={next} className=" bg-transparent" type="button">
          <IoIosArrowDroprightCircle />
        </button>
      </div>
      <div className="absolute w-full flex justify-center bottom-1 sm:bottom-2 md:bottom-3  left-0 gap-1 right-0">
        {slides.map((item, index) => (
          <button
            onClick={() => setCurrent(index)}
            key={index}
            style={{
              width: "clamp(0.25rem, 3vw,1rem)",
              height: "clamp(0.25rem, 3vw,1rem)",
            }}
            className={` ${
              index === current ? "opacity-1" : "opacity-30"
            } bg-blue-700 rounded-full `}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Carousal;

