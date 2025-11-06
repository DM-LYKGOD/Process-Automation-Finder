import React from 'react';

const checklistItems = [
    "Enter your name, company, and email.",
    "Add one or more business processes to analyze.",
    "Provide details for each process (name, frequency, effort).",
    "Submit the processes for AI-powered automation analysis.",
    "Review the generated recommendations."
];

const CheckIcon = () => (
    <svg className="w-5 h-5 text-indigo-500" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const Checklist = () => {
    return (
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Steps to Automation Analysis</h2>
            <ul className="space-y-3">
                {checklistItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <CheckIcon />
                        <span className="ml-3 text-slate-600">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Checklist;