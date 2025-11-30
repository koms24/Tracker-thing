import { UserFormData } from '../app/FormData';
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets.config';

export interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
}

/**
 * Submits expense data to Google Sheets via Apps Script
 * The script expects data in format: "number, category"
 * It will then add notes with WHAT, WHEN, WHY, WHERE, RECEIPT
 */
export async function submitToGoogleSheets(data: UserFormData): Promise<GoogleSheetsResponse> {
  try {
    // Format data as "number, category" to trigger the onEdit function
    const cellValue = `${data.cost}, ${data.category}`;
    
    // Check if URL is configured
    if (GOOGLE_SHEETS_CONFIG.WEB_APP_URL === process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL) {
      throw new Error('Please configure your Google Script Web App URL in config/googleSheets.config.ts or set EXPO_PUBLIC_GOOGLE_SCRIPT_URL environment variable');
    }

    // Prepare the data to be sent to Google Sheets
    const payload = {
      sheetName: GOOGLE_SHEETS_CONFIG.SHEET_NAME,
      value: cellValue,
      notes: {
        WHAT: data.what,
        WHY: data.why,
        WHERE: data.where,
        RECEIPT: data.receipt || '',
      },
    };

    const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Data submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit data',
    };
  }
}

