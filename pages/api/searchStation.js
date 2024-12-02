// pages/api/searchStation.js

export default async function handler(req, res) {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    const url = `https://irctc1.p.rapidapi.com/api/v1/searchStation?query=${query}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '156c557d42mshfa30fed813c2a93p10c28bjsn831a5ed25cdc',
        'x-rapidapi-host': 'irctc1.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
  
      // Check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
  