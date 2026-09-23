 import React from 'react';

export default function CompanyLogo({
  className = "h-16"
}) {
  return (
    <div
      className={`
        flex items-center
        select-none
        ${className}
      `}
    >
      {/* Complete Maa Narmada Transport Logo */}
      <div className="relative group flex-shrink-0">

        {/* Glow Effect */}
        {/* <div
          className="
            absolute
            -inset-2
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            via-sky-500
            to-blue-600
            opacity-40
            blur-md
            group-hover:opacity-70
            transition-all
            duration-500
          "
        ></div> */}

        {/* Logo */}
        <div className="relative flex items-center">
          <img
            src="/image.png"
            alt="Maa Narmada Transport"
            className="
              h-full
              w-auto
              max-w-[280px]
              object-contain
              transition-transform
              duration-300
              group-hover:scale-[1.02]
            "
          />
        </div>

      </div>
    </div>
  );
}