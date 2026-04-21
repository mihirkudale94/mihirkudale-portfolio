import { X } from "lucide-react";
import { homeData } from "../../constants/home";
import { chatbotConfig } from "../../constants/chatbot";

export function ChatHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={homeData.image.src}
            alt="Mihir Kudale - Portfolio chat assistant"
            className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h3 id="chatbot-title" className="font-bold text-[15px] text-slate-900 leading-tight">
            {chatbotConfig.botName}
          </h3>
          <p className="text-xs font-semibold text-slate-500">AI-powered</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none"
        aria-label="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
