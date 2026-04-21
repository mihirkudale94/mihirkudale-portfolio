import { motion } from "framer-motion";
import { homeData } from "../../constants/home";

export function ChatToggleButton({ onOpen }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      type="button"
      onClick={onOpen}
      className="fixed bottom-6 right-20 z-[99] flex items-center gap-2.5 p-1.5 pe-5 rounded-full bg-white text-slate-900 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:border-slate-300 transition-colors duration-300 focus:outline-none"
      aria-label="Open chat assistant"
      aria-haspopup="dialog"
    >
      <div className="relative">
        <img
          src={homeData.image.src}
          alt="Mihir Kudale - Portfolio chat assistant"
          className="w-11 h-11 rounded-full object-cover"
        />
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
      </div>
      <span className="text-sm font-bold tracking-tight text-slate-700">Ask me anything</span>
    </motion.button>
  );
}
