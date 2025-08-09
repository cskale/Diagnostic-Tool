import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

const options = [
  { value: "yes", label: "Yes", Icon: CheckCircle, color: "#16a34a" },
  { value: "no", label: "No", Icon: AlertTriangle, color: "#dc2626" },
];

const hover = { scale: 1.03, rotate: 1 };
const tap = { scale: 0.97, rotate: -1, opacity: 0.8 };

const DealershipAssessmentApp: React.FC = () => {
  const [choice, setChoice] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Prototype placeholder</h1>

      <div className="space-y-2">
        {options.map(({ value, label, Icon, color }) => {
          const selected = choice === value;
          return (
            <motion.button
              key={value}
              whileHover={hover}
              whileTap={tap}
              onClick={() => setChoice(value)}
              className="flex items-center gap-2 px-3 py-2 border rounded-md"
            >
              <motion.span
                initial={false}
                animate={
                  selected
                    ? { scale: 1.1, color }
                    : { scale: 1, color: "#9ca3af" }
                }
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="inline-flex"
              >
                <Icon className="w-5 h-5" />
              </motion.span>
              {label}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={hover}
        whileTap={tap}
        onClick={() => alert(choice)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Submit
      </motion.button>
    </div>
  );
};

export default DealershipAssessmentApp;

