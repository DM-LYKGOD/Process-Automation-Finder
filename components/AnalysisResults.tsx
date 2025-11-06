import React, { useState } from 'react';
import { OutputData, User, Process } from '../types';
import FileDownloadIcon from './icons/FileDownloadIcon';
import SparklesIcon from './icons/SparklesIcon';

interface AnalysisResultsProps {
    user: User;
    processes: Process[];
    results: OutputData;
    onReset: () => void;
}

const RecommendationCard = ({ title, reason }: { title: string, reason: string }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 transition-all hover:shadow-md">
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{reason}</p>
    </div>
);

const AgenticRecommendationCard = ({ title, reason, steps }: { title: string, reason: string, steps: string[] }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 transition-all hover:shadow-md">
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600 mt-1 italic">"{reason}"</p>
        <div className="mt-3 pt-3 border-t border-slate-200">
            <h5 className="text-xs font-semibold text-slate-500 mb-2">Suggested Agent Steps:</h5>
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                {steps.map((step, index) => (
                    <li key={index} className="pl-2">{step}</li>
                ))}
            </ol>
        </div>
    </div>
);


const AnalysisResults: React.FC<AnalysisResultsProps> = ({ user, processes, results, onReset }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (format: 'excel' | 'pdf') => {
        setIsDownloading(true);
        try {
            // Dynamically import the download service only when needed
            const { exportToExcel, exportToPDF } = await import('../services/downloadService');
            
            if (format === 'excel') {
                exportToExcel(user, processes, results);
            } else {
                exportToPDF(user, processes, results);
            }
        } catch (error) {
            console.error(`Failed to download ${format}`, error);
            alert(`Sorry, there was an error creating the ${format} file.`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-center text-slate-900">Analysis Complete</h2>
                <p className="text-center text-slate-600 mt-1">The AI has analyzed your processes. Here are the findings.</p>
            </div>

            {/* Download Buttons */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-medium text-slate-700">Download Full Report</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleDownload('pdf')}
                        disabled={isDownloading}
                        className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        <FileDownloadIcon className="w-4 h-4" />
                        PDF
                    </button>
                    <button
                        onClick={() => handleDownload('excel')}
                        disabled={isDownloading}
                        className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        <FileDownloadIcon className="w-4 h-4" />
                        Excel
                    </button>
                </div>
            </div>

            {/* General Automation Recommendations */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    General Automation Recommendations
                </h3>
                {results.automation_recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.automation_recommendations.map(rec => (
                            <RecommendationCard key={rec.process_id} title={rec.process_name} reason={rec.reason} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-4">No specific recommendations for general automation were found.</p>
                )}
            </div>

            {/* Agentic AI Recommendations */}
            <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-purple-500" />
                    Agentic AI Suitability
                </h3>
                <p className="text-sm text-slate-500 -mt-2">Processes suitable for advanced AI agents that can handle complex, multi-step tasks and decision-making.</p>
                 {results.agentic_recommendations.length > 0 ? (
                     <div className="space-y-4">
                         {results.agentic_recommendations.map(rec => (
                             <AgenticRecommendationCard key={rec.process_id} title={rec.process_name} reason={rec.reason} steps={rec.suggested_steps} />
                         ))}
                     </div>
                 ) : (
                     <p className="text-slate-500 text-center py-4">No processes were identified as strong candidates for Agentic AI.</p>
                 )}
            </div>

            <button 
                onClick={onReset}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors"
            >
                Start New Analysis
            </button>
        </div>
    );
};

export default AnalysisResults;