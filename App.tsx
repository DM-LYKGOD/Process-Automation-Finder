import React, { useState, useCallback } from 'react';
import { User, Process, OutputData } from './types';
import { getAutomationRecommendations } from './services/geminiService';
import { saveDataToSheet } from './services/sheetsService';
import UserInfoForm from './components/UserInfoForm';
import ProcessForm from './components/ProcessForm';
import ProcessList from './components/ProcessList';
import AnalysisResults from './components/AnalysisResults';
import SparklesIcon from './components/icons/SparklesIcon';
import Checklist from './components/Checklist';

type AppStep = 'checklist' | 'userInfo' | 'processEntry' | 'analysis';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>('checklist');
    const [user, setUser] = useState<User | null>(null);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [recommendations, setRecommendations] = useState<OutputData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingProcessId, setEditingProcessId] = useState<string | null>(null);

    const handleUserSubmit = (userData: User) => {
        setUser(userData);
        setStep('processEntry');
    };

    const handleAddProcess = (process: Process) => {
        setProcesses(prev => [...prev, process]);
    };

    const handleRemoveProcess = (id: string) => {
        setProcesses(prev => prev.filter(p => p.id !== id));
    };

    const handleStartEdit = (id: string) => {
        setEditingProcessId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleCancelEdit = () => {
        setEditingProcessId(null);
    };

    const handleUpdateProcess = (updatedProcess: Process) => {
        setProcesses(prev => prev.map(p => (p.id === updatedProcess.id ? updatedProcess : p)));
        setEditingProcessId(null);
    };
    
    const handleAnalyze = useCallback(async () => {
        if (!user || processes.length === 0) {
            setError("Please add at least one process to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const results = await getAutomationRecommendations({ user, processes });
            setRecommendations(results);
            setStep('analysis');
            // Save the data to Google Sheets in the background
            saveDataToSheet(user, processes, results);
            
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [user, processes]);
    
    const handleReset = () => {
        setUser(null);
        setProcesses([]);
        setRecommendations(null);
        setError(null);
        setIsLoading(false);
        setEditingProcessId(null);
        setStep('checklist');
    };

    const processToEdit = processes.find(p => p.id === editingProcessId) || null;

    const renderContent = () => {
        switch (step) {
            case 'checklist':
                return (
                    <div>
                        <Checklist />
                        <button 
                            onClick={() => setStep('userInfo')}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors">
                            Get Started
                        </button>
                    </div>
                );
            case 'userInfo':
                return <UserInfoForm onNext={handleUserSubmit} />;
            case 'processEntry':
                return (
                    <div className="space-y-8">
                        <ProcessForm
                            onAddProcess={handleAddProcess}
                            onUpdateProcess={handleUpdateProcess}
                            onCancelEdit={handleCancelEdit}
                            processToEdit={processToEdit}
                        />
                        <ProcessList
                            processes={processes}
                            onRemoveProcess={handleRemoveProcess}
                            onEditProcess={handleStartEdit}
                        />
                        {processes.length > 0 && (
                          <div className="pt-4 border-t border-slate-200">
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !!editingProcessId}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Analyze Processes
                                    </>
                                )}
                            </button>
                          </div>
                        )}
                        {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">{error}</div>}
                    </div>
                );
            case 'analysis':
                return recommendations && user ? (
                    <AnalysisResults
                        user={user}
                        processes={processes}
                        results={recommendations}
                        onReset={handleReset}
                    />
                 ) : null;
        }
    };
    
    const getHeaderText = () => {
        switch(step) {
            case 'checklist':
            case 'userInfo':
                return "Start Your Analysis";
            case 'processEntry':
                return "Describe Your Business Processes";
            case 'analysis':
                return "Analysis Complete";
            default:
                return "Automation Analyzer";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                        Business Process Automation Analyzer
                    </h1>
                    <p className="mt-2 text-slate-500">{getHeaderText()}</p>
                </header>
                <main className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-lg">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;