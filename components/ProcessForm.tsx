import React, { useState, useEffect } from 'react';
import { Process } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface ProcessFormProps {
    onAddProcess: (process: Process) => void;
    onUpdateProcess: (process: Process) => void;
    onCancelEdit: () => void;
    processToEdit: Process | null;
}

interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, placeholder, value, error, onChange }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);

const initialProcessState = {
    name: '',
    occurrences: '',
    people_involved: '',
    hours_required: '',
    details: ''
};

const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess, onUpdateProcess, onCancelEdit, processToEdit }) => {
    const [process, setProcess] = useState(initialProcessState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState('');
    const [steps, setSteps] = useState<string[]>([]);

    useEffect(() => {
        if (processToEdit) {
            setProcess({
                name: processToEdit.name,
                occurrences: String(processToEdit.occurrences),
                people_involved: String(processToEdit.people_involved),
                hours_required: String(processToEdit.hours_required),
                details: processToEdit.details || ''
            });
            setSteps(processToEdit.steps || []);
        } else {
            setProcess(initialProcessState);
            setSteps([]);
            setCurrentStep('');
        }
    }, [processToEdit]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!process.name.trim()) newErrors.name = "Process name is required.";
        if (!process.occurrences) newErrors.occurrences = "Occurrences are required.";
        else if (isNaN(Number(process.occurrences)) || !Number.isInteger(Number(process.occurrences)) || Number(process.occurrences) <= 0) newErrors.occurrences = "Must be a positive integer.";

        if (!process.people_involved) newErrors.people_involved = "People involved is required.";
        else if (isNaN(Number(process.people_involved)) || !Number.isInteger(Number(process.people_involved)) || Number(process.people_involved) <= 0) newErrors.people_involved = "Must be a positive integer.";
        
        if (!process.hours_required) newErrors.hours_required = "Hours required is required.";
        else if (isNaN(Number(process.hours_required)) || Number(process.hours_required) <= 0) newErrors.hours_required = "Must be a positive number.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentStep.trim()) {
            setSteps([...steps, currentStep.trim()]);
            setCurrentStep('');
        }
    };

    const handleRemoveStep = (indexToRemove: number) => {
        setSteps(steps.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (processToEdit) {
                onUpdateProcess({
                    ...processToEdit,
                    name: process.name,
                    occurrences: parseInt(process.occurrences, 10),
                    people_involved: parseInt(process.people_involved, 10),
                    hours_required: parseFloat(process.hours_required),
                    details: process.details || undefined,
                    steps: steps.length > 0 ? steps : undefined,
                });
            } else {
                onAddProcess({
                    id: `process_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    name: process.name,
                    occurrences: parseInt(process.occurrences, 10),
                    people_involved: parseInt(process.people_involved, 10),
                    hours_required: parseFloat(process.hours_required),
                    details: process.details || undefined,
                    steps: steps.length > 0 ? steps : undefined,
                });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProcess({ ...process, [e.target.name]: e.target.value });
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white border border-slate-200 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">{processToEdit ? 'Edit Process' : 'Add a New Process'}</h3>
            <InputField id="name" label="Process Name" type="text" placeholder="e.g., Invoice Processing" value={process.name} error={errors.name} onChange={handleChange} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField id="occurrences" label="# of Occurrences" type="number" placeholder="e.g., 20" value={process.occurrences} error={errors.occurrences} onChange={handleChange} />
                <InputField id="people_involved" label="# of People Involved" type="number" placeholder="e.g., 3" value={process.people_involved} error={errors.people_involved} onChange={handleChange} />
                <InputField id="hours_required" label="Hours per Occurrence" type="number" placeholder="e.g., 4.5" value={process.hours_required} error={errors.hours_required} onChange={handleChange} />
            </div>

            <div className="space-y-1">
                <label htmlFor="details" className="block text-sm font-medium text-slate-700">Additional Details (Optional)</label>
                <textarea
                    id="details"
                    name="details"
                    rows={3}
                    value={process.details}
                    onChange={handleChange}
                    placeholder="Describe the process briefly..."
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
                <label htmlFor="steps" className="block text-sm font-medium text-slate-700">Process Steps (Optional)</label>
                <p className="text-xs text-slate-500 -mt-2">Break down the process into individual steps for a more detailed analysis.</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        id="steps"
                        name="steps"
                        value={currentStep}
                        onChange={(e) => setCurrentStep(e.target.value)}
                        placeholder="e.g., Open invoice email"
                        className="flex-grow block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddStep}
                        className="flex-shrink-0 inline-flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Step
                    </button>
                </div>
                {steps.length > 0 && (
                    <div className="mt-3">
                        <ol className="list-decimal list-inside space-y-2 text-slate-700 bg-slate-50 p-3 rounded-md">
                            {steps.map((step, index) => (
                                <li key={index} className="flex justify-between items-center group">
                                    <span>{step}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStep(index)}
                                        className="p-1 text-slate-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Remove step ${index + 1}`}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
            
            <div className="pt-2">
            {processToEdit ? (
                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors">
                            Update Process
                        </button>
                        <button type="button" onClick={onCancelEdit} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors">
                        <PlusIcon className="w-5 h-5" />
                        Add Process
                    </button>
                )}
            </div>
        </form>
    );
};

export default ProcessForm;