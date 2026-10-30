import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-16 w-16'
  };

  const textClasses = {
    sm: {
      name: 'text-base font-serif font-semibold tracking-tight text-[#4A2C22]',
      tagline: 'text-[10px] tracking-wider uppercase text-[#9E4927]'
    },
    md: {
      name: 'text-lg font-serif font-semibold tracking-tight text-[#4A2C22]',
      tagline: 'text-[11px] tracking-wide text-[#9E4927]'
    },
    lg: {
      name: 'text-2xl font-serif font-semibold tracking-tight text-[#4A2C22]',
      tagline: 'text-xs tracking-wider text-[#9E4927]'
    }
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`${sizeClasses[size]} rounded-lg overflow-hidden shrink-0 shadow-xs border border-[#9E4927]/20`}>
        <img
          src="/assets/aistudio/Aban_Welfare_Foundation_e2c55029.png"
          alt="Aban Welfare Foundation Emblem"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={textClasses[size].name}>
            Aban Welfare Foundation
          </span>
          <span className={textClasses[size].tagline}>
            A cause for your akhirah
          </span>
        </div>
      )}
    </div>
  );
};
