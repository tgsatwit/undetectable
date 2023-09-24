const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');

const app = express();
app.use(express.json()); // For parsing application/json

const airtableApiKey = 'patJo97uT72OYwKcw.06157f6cd5822b848c86aa349b3c02390f0d20b702ecd2720e1bc70831e05ee7';
const airtableBaseId = 'FBL: Blog Generator';
const airtableTableName = 'Blogs';

const undetectableApiKey = '1695390264322x180995456079005020';

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

app.post('/submit', async (req, res) => {
  try {
    // Fetch the record from Airtable
    const recordId = req.body.recordId;
    const record = await base(airtableTableName).find(recordId);
    const documentContent = record.get('Document'); // Assuming the field name in Airtable is 'Document'

    // Submit the document to undetectable.ai
    const response = await axios.post('https://api.undetectable.ai/v1/submit', {
      document: documentContent
    }, {
      headers: {
        'Authorization': `Bearer ${undetectableApiKey}`
      }
    });

    // Retrieve the result from undetectable.ai
    const jobId = response.data.job_id;
    let result = null;
    while (!result) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
      const resultResponse = await axios.get(`https://api.undetectable.ai/v1/result/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${undetectableApiKey}`
        }
      });
      if (resultResponse.data.status === 'completed') {
        result = resultResponse.data;
      }
    }

    // Optionally, update the Airtable record with the result
    await base(airtableTableName).update(recordId, {
      'Result': JSON.stringify(result) // Assuming you have a 'Result' field in your Airtable base
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});