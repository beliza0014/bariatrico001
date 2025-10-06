import React from 'react';
import { Star, Users, Zap, Shield } from 'lucide-react';
import { GLOBAL_CONSTANTS } from '@/config/globalConstants';
interface SocialBadgesProps {
  variant?: 'compact' | 'full' | 'minimal';
  showPix?: boolean;
  showGuarantee?: boolean;
  className?: string;
}
export const SocialBadges: React.FC<SocialBadgesProps> = ({
  variant = 'full',
  showPix = true,
  showGuarantee = true,
  className = ''
}) => {
  if (variant === 'minimal') {
    return <div className={`flex items-center justify-center gap-1 text-xs text-gray-600 ${className}`}>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />)}
        </div>
        <span>4,9/5 • {GLOBAL_CONSTANTS.SOCIAL_COUNT} pessoas</span>
      </div>;
  }
  if (variant === 'compact') {
    return;
  }
  return;
};