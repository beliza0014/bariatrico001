import React from 'react';

interface WhatsAppChatCardProps {
  name: string;
  message: string;
  mediaSrc: string;
  time: string;
  mediaAlt?: string;
}

export const WhatsAppChatCard: React.FC<WhatsAppChatCardProps> = ({
  name,
  message,
  mediaSrc,
  time,
  mediaAlt = "Transformação antes e depois"
}) => {
  return (
    <div className="relative bg-[#0F1419] rounded-none overflow-hidden max-w-[320px] mx-auto shadow-sm">
      {/* WhatsApp Wallpaper Background - More realistic */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(/lovable-uploads/fd2c4dc1-ae44-4cae-b252-568a4e74bde4.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Chat Area - Ultra realistic WhatsApp style */}
      <div className="relative z-10 p-4">
        {/* Message Bubble */}
        <div className="flex items-start">
          {/* Message bubble - incoming style with precise WhatsApp styling */}
          <div className="relative max-w-[85%]">
            {/* Bubble tail - positioned lower and more subtle */}
            <div className="absolute -left-1.5 top-2 w-0 h-0 border-r-[6px] border-r-[#202C33] border-t-[6px] border-t-transparent"></div>
            
            {/* Message content - exact WhatsApp structure */}
            <div className="bg-[#202C33] rounded-lg rounded-tl-none overflow-hidden shadow-md">
              {/* Sender name - positioned at top left corner */}
              <div className="px-3 pt-2 pb-1">
                <div className="text-[#00A884] text-[13px] font-semibold leading-tight text-left">
                  {name}
                </div>
              </div>
              
              {/* Media content - WhatsApp photo style */}
              <div className="relative px-3">
                <img 
                  src={mediaSrc}
                  alt={mediaAlt}
                  className="w-full h-auto max-h-[180px] object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              
              {/* Message text - as natural paragraph below photo */}
              <div className="px-3 pb-2 pt-2">
                <p className="text-[#E9EDEF] text-[14px] leading-[1.4] font-normal text-left break-words">
                  {message}
                </p>
                
                {/* Message info - time and checkmarks */}
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-[#8696A0] text-[11px] font-normal">{time}</span>
                  <div className="flex items-center ml-1">
                    <svg className="w-3 h-3 text-[#53BDEB]" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                    <svg className="w-3 h-3 text-[#53BDEB] -ml-1.5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};