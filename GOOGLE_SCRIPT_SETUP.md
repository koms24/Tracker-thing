# Google Apps Script Setup Guide

## Step 1: Update Your Google Apps Script

Replace your current script with this updated version that handles both manual edits and web app submissions:

```javascript
// Handle web app requests
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.sheetName || "2025");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Sheet not found: " + (data.sheetName || "2025")
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Find the next empty row
    var lastRow = sheet.getLastRow();
    var nextRow = lastRow + 1;
    
    // Format value as "number, category" to trigger onEdit logic
    var cellValue = data.value; // Should be in format "cost, category"
    
    // Get the cell
    var cell = sheet.getRange(nextRow, 1); // Column A
    
    // Set the value to trigger onEdit logic
    cell.setValue(cellValue);
    
    // Manually apply the formatting logic (since setValue won't trigger onEdit for script edits)
    var parts = cellValue.split(",");
    if (parts.length === 2) {
      var number = parts[0].trim();
      var category = parts[1].trim().toLowerCase();
      
      var color = "#FFFFFF"; // Default white background
      
      // Assign colors based on category
      if (category === "business") color = "#ff00ff"; // Pink
      else if (category === "food") color = "#ff9900"; // Orange
      else if (category === "base") color = "#FF0000"; // Red
      
      // Update the cell to display only the number
      cell.setValue(number);
      cell.setBackground(color);
      
      // Add preset notes with additional data
      var timestamp = new Date().toLocaleString();
      var note = `WHAT: ${data.notes?.WHAT || number}\nWHEN: ${timestamp}\nWHY: ${data.notes?.WHY || ''}\nWHERE: ${data.notes?.WHERE || ''}\nRECEIPT: ${data.notes?.RECEIPT || ''}`;
      cell.setNote(note);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Data added successfully",
      row: nextRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Original onEdit handler for manual edits
function onEdit(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "2025" || "2026" || "2027") return; 

  var cell = e.range;
  var value = cell.getValue();

  if (!value.includes(",")) return;

  var data = value.split(",");
  var number = data[0].trim(); 
  var category = data[1].trim().toLowerCase();

  var color = "#FFFFFF"; // Default white background

  // Assign colors based on category
  if (category === "business") color = "#ff00ff"; // Pink
  else if (category === "food") color = "#ff9900"; // Orange
  else if (category === "base") color = "#FF0000"; // Red

  // Update the cell to display only the number
  cell.setValue(number);
  cell.setBackground(color);

  // Add preset notes
  var timestamp = new Date().toLocaleString();
  var note = `WHAT: ${number}\nWHEN: ${timestamp}\nWHY:\nWHERE:\nRECEIPT:`;
  cell.setNote(note);
}
```

## Step 2: Deploy as Web App

1. In Google Apps Script, click **"Deploy"** > **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type" and choose **"Web app"**
3. Configure:
   - **Description**: "Expense Tracker API" (optional)
   - **Execute as**: "Me" (your account)
   - **Who has access**: "Anyone" (required for public API access)
4. Click **"Deploy"**
5. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Step 3: Configure Your Expo App

1. Create a `.env` file in your project root:
   ```
   EXPO_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

2. Install expo-constants (already in your dependencies):
   ```bash
   npm install
   ```

3. The app will automatically use the URL from your `.env` file.

## Step 4: Test

1. Run your Expo app: `npx expo start`
2. Fill out the form and submit
3. Check your Google Sheet - a new row should be added with:
   - The cost amount (number only)
   - Background color based on category
   - A note with WHAT, WHEN, WHY, WHERE, RECEIPT fields

## Troubleshooting

- **403 Forbidden Error**: Make sure "Who has access" is set to "Anyone" in the deployment settings
- **Sheet not found**: Ensure your sheet is named exactly "2025" (case-sensitive)
- **Data not appearing**: Check the Google Apps Script execution logs (View > Logs)



