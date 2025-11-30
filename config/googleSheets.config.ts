// Google Sheets API Configuration
// Replace this URL with your Google Apps Script Web App URL
// See GOOGLE_SCRIPT_SETUP.md for instructions on how to get this URL

export const GOOGLE_SHEETS_CONFIG = {
  // Get this URL from your Google Apps Script deployment
  // Format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
  WEB_APP_URL: process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL || 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL',
  
  // Sheet name that matches your Google Apps Script
  SHEET_NAME: '2025',
};


