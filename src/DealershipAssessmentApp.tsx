import React, { useState } from "react";
import {
  benchmarkCategories,
  BenchmarkingData,
  generateBenchmarkInsights,
  summarizeBenchmark,
  AssessmentSummary,
} from "./benchmarking";

const initialData: BenchmarkingData = {
  oem: "",
  brandStructure: "",
  dealerSize: "",
  affiliation: ""
};

const DealershipAssessmentApp: React.FC = () => {
  const [data, setData] = useState<BenchmarkingData>(initialData);
  const [insights, setInsights] = useState<string[]>([]);
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [dealerName, setDealerName] = useState("");
  const [location, setLocation] = useState("");

  const handleChange = (field: keyof BenchmarkingData) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setData({ ...data, [field]: e.target.value });
  };

  const handleGenerate = () => {
    setInsights(generateBenchmarkInsights(data));
    setSummary(summarizeBenchmark(data));
  };

  const handleExport = async () => {
    if (!summary) return;
    const assessmentDate = new Date().toISOString().slice(0, 10);
    const resp = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dealerName,
        assessmentType: "Benchmarking",
        assessmentDate,
        oem: data.oem,
        location,
        data,
        insights,
        summary,
      }),
    });
    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dealerName || "Dealer"}_Benchmarking_${assessmentDate}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block font-semibold mb-1">Dealer Name</label>
        <input
          className="border p-2 rounded w-full"
          value={dealerName}
          onChange={(e) => setDealerName(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Location</label>
        <input
          className="border p-2 rounded w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {Object.entries(benchmarkCategories).map(([key, cat]) => (
        <div key={key}>
          <label className="block font-semibold mb-1">{cat.name}</label>
          <select
            className="border p-2 rounded w-full"
            value={data[key as keyof BenchmarkingData]}
            onChange={handleChange(key as keyof BenchmarkingData)}
          >
            <option value="">Select...</option>
            {cat.options.map((opt) => (
              <option key={opt.value} value={opt.value} title={opt.tooltip}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Insights
      </button>
      {summary && (
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      )}
      {insights.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mt-4">AI Insights</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {insights.map((ins, idx) => (
              <li key={idx}>{ins}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DealershipAssessmentApp;
