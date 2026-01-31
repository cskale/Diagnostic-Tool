import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  CheckCircle, AlertTriangle, ChevronRight, ChevronLeft,
  FileText, Download,
} from "lucide-react";

interface Question {
  id: string;
  text: string;
}

interface Section {
  name: string;
  questions: Question[];
}

const sections: Section[] = [
  {
    name: "New Vehicle Sales Performance",
    questions: [
      { id: "nvs1", text: "Monthly new vehicle sales volume" },
      { id: "nvs2", text: "Lead conversion rate" },
      { id: "nvs3", text: "Average gross profit per unit" },
      { id: "nvs4", text: "Inventory turn rate" },
      { id: "nvs5", text: "Online inquiry response time" },
      { id: "nvs6", text: "Salesperson training frequency" },
      { id: "nvs7", text: "Finance and insurance penetration" },
      { id: "nvs8", text: "Customer satisfaction index" },
      { id: "nvs9", text: "Marketing spend efficiency" },
      { id: "nvs10", text: "Test drive to sale ratio" },
      { id: "nvs11", text: "Average days to deliver" },
      { id: "nvs12", text: "Discounting policy adherence" },
      { id: "nvs13", text: "Sales follow-up process" },
      { id: "nvs14", text: "Manager coaching frequency" },
      { id: "nvs15", text: "Showroom traffic trends" },
    ],
  },
  {
    name: "Used Vehicle Sales Performance",
    questions: [
      { id: "uvs1", text: "Monthly used vehicle sales volume" },
      { id: "uvs2", text: "Reconditioning cycle time" },
      { id: "uvs3", text: "Gross profit per used unit" },
      { id: "uvs4", text: "Age of inventory" },
      { id: "uvs5", text: "Auction purchases ratio" },
      { id: "uvs6", text: "Appraisal to purchase ratio" },
      { id: "uvs7", text: "Wholesale loss percentage" },
      { id: "uvs8", text: "Digital marketing effectiveness" },
      { id: "uvs9", text: "Certified pre-owned mix" },
      { id: "uvs10", text: "Warranty penetration" },
      { id: "uvs11", text: "Sales staff turnover" },
      { id: "uvs12", text: "Price to market alignment" },
      { id: "uvs13", text: "Vehicle sourcing diversity" },
      { id: "uvs14", text: "Customer referral rate" },
      { id: "uvs15", text: "Finance decline follow-up" },
    ],
  },
  {
    name: "Service Performance",
    questions: [
      { id: "svc1", text: "Daily repair order count" },
      { id: "svc2", text: "Technician productivity" },
      { id: "svc3", text: "Effective labor rate" },
      { id: "svc4", text: "Customer pay vs warranty mix" },
      { id: "svc5", text: "Parts fill rate" },
      { id: "svc6", text: "Service appointment lead time" },
      { id: "svc7", text: "Menu penetration" },
      { id: "svc8", text: "Vehicle health check usage" },
      { id: "svc9", text: "Customer retention" },
      { id: "svc10", text: "Comeback ratio" },
      { id: "svc11", text: "Loaner fleet utilization" },
      { id: "svc12", text: "Waiting time satisfaction" },
      { id: "svc13", text: "Service marketing ROI" },
      { id: "svc14", text: "Technician training hours" },
      { id: "svc15", text: "Mobile service adoption" },
    ],
  },
  {
    name: "Parts and Inventory Performance",
    questions: [
      { id: "prt1", text: "Parts inventory turn" },
      { id: "prt2", text: "Obsolescence percentage" },
      { id: "prt3", text: "Fill rate on first visit" },
      { id: "prt4", text: "Special order ratio" },
      { id: "prt5", text: "Stock order effectiveness" },
      { id: "prt6", text: "Gross profit margin" },
      { id: "prt7", text: "Counter sales growth" },
      { id: "prt8", text: "E-commerce penetration" },
      { id: "prt9", text: "Return rate" },
      { id: "prt10", text: "Aging stock value" },
      { id: "prt11", text: "Price matrix utilization" },
      { id: "prt12", text: "Delivery efficiency" },
      { id: "prt13", text: "Vendor rebate tracking" },
      { id: "prt14", text: "Accessory sales performance" },
      { id: "prt15", text: "Physical inventory accuracy" },
    ],
  },
];

const benchmark = 4; // simple benchmark for demonstration

type AnswerMap = Record<string, number>;

const DealershipAssessmentApp: React.FC = () => {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (qid: string, value: number) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const currentSection = sections[sectionIdx];

  const calcScores = () => {
    return sections.map((s) => {
      const sum = s.questions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return {
        name: s.name,
        score: parseFloat((sum / s.questions.length).toFixed(2)),
      };
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dealership Assessment Results", 10, 10);
    const scores = calcScores();
    scores.forEach((s, idx) => {
      doc.text(`${s.name}: ${s.score}`, 10, 20 + idx * 10);
    });
    doc.save("assessment.pdf");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const responses = sections.flatMap((s) =>
      s.questions.map((q) => ({ Section: s.name, Question: q.text, Score: answers[q.id] || 0 }))
    );
    const ws1 = XLSX.utils.json_to_sheet(responses);
    XLSX.utils.book_append_sheet(wb, ws1, "Responses");
    const summary = calcScores();
    const ws2 = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");
    XLSX.writeFile(wb, "assessment.xlsx");
  };

  if (showResults) {
    const scores = calcScores();
    const radarData = scores.map((s) => ({ subject: s.name, A: s.score, fullMark: benchmark }));
    const lineData = scores.map((s, idx) => ({ name: `M${idx + 1}`, Score: s.score, Benchmark: benchmark }));
    const lowSections = scores.filter((s) => s.score < benchmark);
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Results Overview</h2>
          <div className="space-x-2">
            <button onClick={exportPDF} className="bg-blue-500 text-white px-3 py-1 rounded flex items-center text-sm"><FileText className="h-4 w-4 mr-1" />PDF</button>
            <button onClick={exportExcel} className="bg-green-500 text-white px-3 py-1 rounded flex items-center text-sm"><Download className="h-4 w-4 mr-1" />Excel</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Score" stroke="#8884d8" />
                <Line type="monotone" dataKey="Benchmark" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold mb-2">AI Recommendations</h3>
          {lowSections.length === 0 ? (
            <div className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" />Great job! All sections meet the benchmark.</div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {lowSections.map((s) => (
                <li key={s.name} className="flex items-center"><AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />Improve {s.name} - score {s.score}</li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => setShowResults(false)}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >Back to Questionnaire</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button
          disabled={sectionIdx === 0}
          onClick={() => setSectionIdx(sectionIdx - 1)}
          className="px-2 py-1 text-sm flex items-center disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <h2 className="text-lg font-bold">{currentSection.name}</h2>
        <button
          disabled={sectionIdx === sections.length - 1}
          onClick={() => setSectionIdx(sectionIdx + 1)}
          className="px-2 py-1 text-sm flex items-center disabled:opacity-50"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <motion.div
        key={sectionIdx}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {currentSection.questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded shadow">
            <label className="block mb-2 font-medium">
              {q.text}
            </label>
            <div className="flex space-x-2">
              {[1,2,3,4,5].map((num) => (
                <label key={num} className="flex flex-col items-center text-sm">
                  <input
                    type="radio"
                    name={q.id}
                    value={num}
                    checked={answers[q.id] === num}
                    onChange={() => handleChange(q.id, num)}
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
      {sectionIdx === sections.length - 1 && (
        <button
          onClick={() => {
            if (window.confirm("View results?")) setShowResults(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Results
        </button>
      )}
    </div>
  );
};

export default DealershipAssessmentApp;
