import * as XLSX from 'xlsx';
// FIX: Use a named import for jsPDF to ensure TypeScript can correctly find the module for augmentation.
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { User, Process, OutputData } from '../types';

// Use module augmentation to correctly extend the jsPDF interface for the autoTable plugin.
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (user: User, processes: Process[], recommendations: OutputData) => {
  // 1. User Info Sheet
  const userInfo = [
    { 'Field': 'Name', 'Value': user.name },
    { 'Field': 'Company', 'Value': user.company_name },
    { 'Field': 'Email', 'Value': user.email },
  ];
  const userWs = XLSX.utils.json_to_sheet(userInfo);

  // 2. Processes Sheet
  const processesData = processes.map(p => ({
    'ID': p.id,
    'Process Name': p.name,
    'Occurrences': p.occurrences,
    'People Involved': p.people_involved,
    'Hours per Occurrence': p.hours_required,
    'Details': p.details || 'N/A',
    'Steps': p.steps?.join('\n') || 'N/A',
  }));
  const processesWs = XLSX.utils.json_to_sheet(processesData);

  // 3. Automation Recommendations Sheet
  const automationRecsData = recommendations.automation_recommendations.map(r => ({
    'Process Name': r.process_name,
    'Reason for Automation': r.reason,
    'Process ID': r.process_id,
  }));
  const automationRecsWs = XLSX.utils.json_to_sheet(automationRecsData);

  // 4. Agentic AI Recommendations Sheet
  const agenticRecsData = recommendations.agentic_recommendations.map(r => ({
    'Process Name': r.process_name,
    'Reason for Suitability': r.reason,
    'Suggested Agent Steps': r.suggested_steps.join('\n'),
    'Process ID': r.process_id,
  }));
  const agenticRecsWs = XLSX.utils.json_to_sheet(agenticRecsData);

  // Create workbook and append sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, userWs, 'User Information');
  XLSX.utils.book_append_sheet(wb, processesWs, 'Submitted Processes');
  XLSX.utils.book_append_sheet(wb, automationRecsWs, 'Automation Recommendations');
  XLSX.utils.book_append_sheet(wb, agenticRecsWs, 'Agentic AI Recommendations');

  // Download the file
  XLSX.writeFile(wb, `Automation_Analysis_${user.company_name.replace(/\s/g, '_')}.xlsx`);
};


export const exportToPDF = (user: User, processes: Process[], recommendations: OutputData) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let finalY = 0;

    // Header
    doc.setFontSize(22);
    doc.text('Business Process Automation Analysis', 14, 22);
    doc.setFontSize(12);
    doc.text(`For: ${user.company_name}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

    // Automation Recommendations
    doc.setFontSize(16);
    doc.text('Automation Recommendations', 14, 50);
    doc.autoTable({
        startY: 55,
        head: [['Process Name', 'Reason for Automation']],
        body: recommendations.automation_recommendations.map(r => [r.process_name, r.reason]),
        theme: 'striped',
        headStyles: { fillColor: [76, 51, 152] }, // Indigo color
    });
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Agentic AI Recommendations
    if (finalY > pageHeight - 50) { doc.addPage(); finalY = 22; }
    doc.setFontSize(16);
    doc.text('Agentic AI Suitability', 14, finalY);
    doc.autoTable({
        startY: finalY + 5,
        head: [['Process Name', 'Reason for Suitability', 'Suggested Agent Steps']],
        body: recommendations.agentic_recommendations.map(r => [r.process_name, r.reason, r.suggested_steps.join('\n- ')]),
        theme: 'striped',
        headStyles: { fillColor: [76, 51, 152] },
        columnStyles: { 2: { cellWidth: 80 } },
    });
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Submitted Processes (Appendix)
    if (finalY > pageHeight - 50) { doc.addPage(); finalY = 22; }
    doc.setFontSize(16);
    doc.text('Appendix: Submitted Process Details', 14, finalY);
    doc.autoTable({
        startY: finalY + 5,
        head: [['Process Name', 'Occurrences', 'People', 'Hours']],
        body: processes.map(p => [p.name, p.occurrences, p.people_involved, p.hours_required]),
        theme: 'grid',
    });
    
    // Save the PDF
    doc.save(`Automation_Analysis_${user.company_name.replace(/\s/g, '_')}.pdf`);
};