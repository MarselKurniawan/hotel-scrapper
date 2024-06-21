const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/api/hotels', async (req, res) => {
  const { checkin, checkout } = req.query;

  if (!checkin || !checkout) {
    return res.status(400).json({ error: 'Check-in and check-out dates are required' });
  }

  try {
    console.log(`Fetching data for checkin: ${checkin}, checkout: ${checkout}`);

    const response = await axios.get('https://bookandlink.com/booking/list_properties2.php', {
      params: { checkin, checkout },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });

    console.log(`Response status: ${response.status}`);
    if (response.status !== 200) {
      return res.status(response.status).json({ error: 'Failed to fetch data from server' });
    }

    const html = response.data;
    console.log(html); // Log HTML untuk memastikan kita mendapatkan konten yang diharapkan

    if (!html) {
      return res.status(500).json({ error: 'No data received from the server' });
    }

    const $ = cheerio.load(html);
    const hotels = [];

    // Periksa struktur HTML yang tepat untuk menentukan selector yang benar
    $('.hotel-item').each((index, element) => {
      const name = $(element).find('.hotel-name').text().trim(); // Ganti dengan selector yang benar
      const location = $(element).find('.hotel-location').text().trim(); // Ganti dengan selector yang benar
      const price = $(element).find('.hotel-price').text().trim(); // Ganti dengan selector yang benar

      if (name && location && price) {
        hotels.push({ name, location, price });
      } else {
        console.warn(`Element missing data: name="${name}", location="${location}", price="${price}"`);
      }
    });

    console.log(hotels); // Log hotels untuk memastikan mereka diparsing dengan benar
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      return res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // No response received
      console.error('Error request:', error.request);
      return res.status(500).json({ error: 'No response received from the server' });
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
