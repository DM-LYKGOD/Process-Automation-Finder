import { User, Process, OutputData } from '../types';

interface SheetData {
    user: User;
    processes: Process[];
    recommendations: OutputData;
    timestamp: string;
}

const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXIDjAjoXYLxlP_NPJF1k2-SAsQn1IiEtjKIeFYUTcZzmz1LkhQCaFRHqN5Ssjxe7Gbw/exec';

/**
 * Saves analysis data to a Google Sheet via a Google Apps Script Web App.
 * This function is fire-and-forget from the UI perspective.
 * 
 * @param user The user information.
 * @param processes The list of business processes.
 * @param recommendations The AI-generated recommendations.
 */
export const saveDataToSheet = (
    user: User, 
    processes: Process[], 
    recommendations: OutputData
): void => {
    if (!GOOGLE_APP_SCRIPT_URL) {
        console.warn("Google Apps Script URL not configured. Skipping data save.");
        return;
    }

    const data: SheetData = {
        user,
        processes,
        recommendations,
        timestamp: new Date().toISOString(),
    };

    try {
        // The fetch API with 'no-cors' can be unreliable for Google Apps Script
        // due to how it handles redirects. A more robust "fire-and-forget" method
        // is to dynamically create and submit a form that targets a hidden iframe.
        
        // Create an iframe to submit the form to, preventing a page reload.
        const iframe = document.createElement('iframe');
        const iframeName = `sheets-submit-iframe-${Date.now()}`;
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Create a form element.
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_APP_SCRIPT_URL;
        form.target = iframe.name; // Target the hidden iframe.

        // Create an input field to hold our JSON data.
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'jsonData'; // This name must match what the Apps Script expects (e.g., e.parameter.jsonData).
        input.value = JSON.stringify(data);
        form.appendChild(input);

        // Append the form to the body and submit it.
        document.body.appendChild(form);
        form.submit();

        // Clean up the form and iframe after a short delay.
        setTimeout(() => {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
        }, 5000); // 5 seconds should be plenty of time.

        console.log("Data submission to Google Sheet initiated via dynamic form.");
    } catch (error) {
        console.error("Error setting up dynamic form for Google Sheet submission:", error);
    }
};