function doGet(): GoogleAppsScript.Content.TextOutput {
  const resData = JSON.stringify({
    is_dajare: true,
    dajare: '布団が吹っ飛んだ',
    score: 5.0,
  });

  ContentService.createTextOutput();
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(resData);

  return output;
}
