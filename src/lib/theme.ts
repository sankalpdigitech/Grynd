export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Video Editing': return 'bg-blue-400 text-black';
    case 'Graphic Design': return 'bg-yellow-400 text-black';
    case 'Web Development': return 'bg-orange-400 text-black';
    case 'Music/Audio': return 'bg-fuchsia-400 text-black';
    case 'Tutoring': return 'bg-green-400 text-black';
    case 'Photography': return 'bg-teal-400 text-black';
    case 'Event Hosting/Performing': return 'bg-red-400 text-black';
    case 'Writing': return 'bg-indigo-300 text-black';
    default: return 'bg-gray-200 text-black';
  }
};

export const brutalistCard = "bg-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none";
export const brutalistInput = "bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none focus:outline-none focus:ring-0 focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all";
export const brutalistButton = "bg-black text-white font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase tracking-wider";
export const brutalistButtonLight = "bg-white text-black font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase tracking-wider";
export const brutalistBadge = "border-2 border-black font-bold uppercase text-xs px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
