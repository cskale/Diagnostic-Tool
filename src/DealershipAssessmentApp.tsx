
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DealershipAssessmentApp: React.FC = () => {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  useEffect(() => {
    if (exportComplete) {
      const timeout = setTimeout(() => setExportComplete(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [exportComplete]);

  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.text("Prototype export", 10, 10);
    doc.save("assessment.pdf");
    setExportComplete(true);
  };

  const handleXLSXExport = () => {
    const ws = XLSX.utils.json_to_sheet([{ example: "data" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "assessment.xlsx");
    setExportComplete(true);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-4">
        <Button onClick={handlePDFExport}>Export PDF</Button>
        <Button onClick={handleXLSXExport}>Export XLSX</Button>
      </div>

      <AnimatePresence>
        {exportComplete && (
          <motion.div
            key="overlay"
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DealershipAssessmentApp;
