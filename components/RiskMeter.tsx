
import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskMeterProps {
  level: RiskLevel;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ level }) => {
  const getStyles = () => {
    switch (level) {
      case RiskLevel.SAFE:
        return { 
          color: 'from-green-500 to-emerald-600', 
          text: 'Verified Safe', 
          textColor: 'text-emerald-700 dark:text-emerald-400', 
          bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
          borderColor: 'border-emerald-100 dark:border-emerald-900/30',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
          glow: 'shadow-emerald-500/20',
          animation: ''
        };
      case RiskLevel.SUSPICIOUS:
        return { 
          color: 'from-amber-400 to-orange-500', 
          text: 'Caution Advised', 
          textColor: 'text-amber-700 dark:text-amber-400', 
          bg: 'bg-amber-50/50 dark:bg-amber-950/20',
          borderColor: 'border-amber-100 dark:border-amber-900/30',
          icon: <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
          glow: 'shadow-amber-500/20',
          animation: 'animate-pulse'
        };
      case RiskLevel.DANGEROUS:
        return { 
          color: 'from-red-500 to-rose-700', 
          text: 'Scam Detected', 
          textColor: 'text-rose-700 dark:text-rose-400', 
          bg: 'bg-rose-50/50 dark:bg-rose-950/20',
          borderColor: 'border-rose-100 dark:border-rose-900/30',
          icon: <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
          glow: 'shadow-rose-500/30 ring-2 ring-rose-500/20',
          animation: 'animate-[bounce_2s_infinite]'
        };
      default:
        return { 
          color: 'from-slate-400 to-slate-500', 
          text: 'Unknown Status', 
          textColor: 'text-slate-700 dark:text-slate-400', 
          bg: 'bg-slate-50 dark:bg-slate-900/30',
          borderColor: 'border-slate-100 dark:border-slate-800',
          icon: <Info className="w-8 h-8 text-slate-500" />,
          glow: 'shadow-slate-500/10',
          animation: ''
        };
    }
  };

  const { color, text, textColor, bg, borderColor, icon, glow, animation } = getStyles();

  const getWidth = () => {
    if (level === RiskLevel.SAFE) return 'w-1/3';
    if (level === RiskLevel.SUSPICIOUS) return 'w-2/3';
    if (level === RiskLevel.DANGEROUS) return 'w-full';
    return 'w-0';
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border transition-all duration-700 ${bg} ${borderColor} ${glow} shadow-2xl backdrop-blur-xl relative overflow-hidden`}>
      {/* Decorative pulse for Dangerous state */}
      {level === RiskLevel.DANGEROUS && (
        <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none"></div>
      )}
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-xl border ${borderColor} ${animation}`}>
              {icon}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-0.5">Threat Level</p>
              <h3 className={`text-3xl font-black ${textColor} leading-tight tracking-tight`}>{text}</h3>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
             <div className="inline-flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Code</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${textColor} bg-white dark:bg-slate-800 shadow-lg border ${borderColor}`}>
                  {level}
                </span>
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden border border-white dark:border-slate-700 shadow-inner">
            {/* Segments markers */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 border-r border-black/5 dark:border-white/5 h-full"></div>
              <div className="w-1/3 border-r border-black/5 dark:border-white/5 h-full"></div>
            </div>
            
            {/* Main Gauge */}
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(0,0,0,0.1)] relative ${getWidth()}`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-full h-full"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-1">
             <span className="text-[9px] font-black text-emerald-600/60 dark:text-emerald-500/40 uppercase tracking-widest">Safe</span>
             <span className="text-[9px] font-black text-amber-600/60 dark:text-amber-500/40 uppercase tracking-widest">Caution</span>
             <span className="text-[9px] font-black text-rose-600/60 dark:text-rose-500/40 uppercase tracking-widest">Danger</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default RiskMeter;
