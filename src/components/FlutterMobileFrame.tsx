import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface FlutterMobileFrameProps {
  children: React.ReactNode;
  isFrameActive: boolean;
}

export const FlutterMobileFrame: React.FC<FlutterMobileFrameProps> = ({
  children,
  isFrameActive,
}) => {
  if (!isFrameActive) {
    return <div className="w-full min-h-screen bg-[#f3fbf6] flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#1b2520] py-4 sm:py-8 px-2 sm:px-4 flex items-center justify-center">
      {/* Device Body Chassis */}
      <div className="relative w-full max-w-[420px] h-[880px] bg-black rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col border-[4px] border-[#37453f]">
        {/* Screen Bezel Interior */}
        <div className="relative w-full h-full bg-[#f3fbf6] rounded-[42px] overflow-hidden flex flex-col shadow-inner">
          {/* iOS / Flutter Status Bar */}
          <div className="relative z-30 h-11 px-7 pt-2 flex items-center justify-between text-[#151d1a] text-xs font-semibold select-none bg-white/70 backdrop-blur-xs">
            {/* Time */}
            <span>09:41</span>

            {/* Dynamic Island / Pill notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2.5 gap-1.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1b2520]/80" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 fill-current" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 w-full overflow-y-auto flex flex-col">
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="relative z-30 h-5 bg-white/70 backdrop-blur-xs flex items-center justify-center select-none pb-1">
            <div className="w-32 h-1 bg-[#151d1a]/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
