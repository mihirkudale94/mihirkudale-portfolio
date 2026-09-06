import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function ChatToggleButton({ onOpen }) {
  return (
    <div className="fixed bottom-6 right-20 z-[99]">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        type="button"
        onClick={onOpen}
        className="flex items-center p-1.5 rounded-full bg-bg-primary text-text-primary border border-glass-border shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-accent-primary-light transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-accent-primary-light/20"
        aria-label="Open chat assistant"
        aria-haspopup="dialog"
      >
        <div className="relative">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-accent-primary text-white">
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-bg-primary" />
        </div>
      </motion.button>
    </div>
  );
}
