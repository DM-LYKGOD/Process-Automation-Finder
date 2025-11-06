import { User, Process, OutputData } from '../types';

interface SheetData {
    user: User;
    processes: Process[];
    recommendations: OutputData;
    timestamp: string;
}

/**
 * Saves analysis data to a Google Sheet via a Google Apps Script Web App.
 * This function is fire-and-forget from the UI perspective.
 * 
 * @param user The user information.
 * @param processes The list of business processes.
 * @param recommendations The AI-generated recommendations.
 */
export const saveDataToSheet = async (
    user: User, 
    processes: Process[], 
    recommendations: OutputData
): Promise<void> => {
    // Hardcoded URL to the user's deployed Google Apps Script web app.
    const appScriptUrl = 'https://script.google.com/macros/s/AKfycbyLCjO8Kadk_pgmKOHN0yIjkt3Ca3ntk56_R8Z0_X8L_0TwxW8FvFl_4byjvgrZU3P8bg/exec';

    const data: SheetData = {
        user,
        processes,
        recommendations,
        timestamp: new Date().toISOString(),
    };

    try {
        // Use `mode: 'no-cors'` to send a "fire-and-forget" request.
        // This is a common technique to bypass CORS preflight issues when posting data
        // to a Google Apps Script from a browser. We won't be able to read the response,
        // but the data will be sent successfully.
        await fetch(appScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data),
        });
        
        console.log("Data submission to Google Sheet initiated.");
    } catch (error) {
        // This will catch network errors (e.g., user is offline).
        console.error("Network error while attempting to send data to Google Sheet:", error);
    }
};