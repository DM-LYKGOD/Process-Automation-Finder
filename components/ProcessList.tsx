import React from 'react';
import { Process } from '../types';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';

interface ProcessListProps {
    processes: Process[];
    onRemoveProcess: (id: string) => void;
    onEditProcess: (id: string) => void;
}

const ProcessList: React.FC<ProcessListProps> = ({ processes, onRemoveProcess, onEditProcess }) => {
    if (processes.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-white border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500">No processes added yet.</p>
                <p className="text-slate-400 text-sm">Use the form above to add your first business process.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {processes.map((process) => (
                <div key={process.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-slate-50 hover:shadow-sm">
                    <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{process.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 my-3 text-xs text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded">Occurrences: <strong className="text-slate-800">{process.occurrences}</strong></span>
                            <span className="bg-slate-100 px-2 py-1 rounded">People: <strong className="text-slate-800">{process.people_involved}</strong></span>
                            <span className="bg-slate-100 px-2 py-1 rounded">Hours: <strong className="text-slate-800">{process.hours_required}</strong></span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{process.details || 'No additional details provided.'}</p>
                        {process.steps && process.steps.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                                <h5 className="text-xs font-semibold text-slate-500 mb-2">Process Steps:</h5>
                                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                                    {process.steps.map((step, index) => (
                                        <li key={index} className="pl-2">{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center self-start sm:self-center">
                         <button 
                            onClick={() => onEditProcess(process.id)}
                            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
                            aria-label={`Edit ${process.name}`}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => onRemoveProcess(process.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                            aria-label={`Remove ${process.name}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProcessList;
