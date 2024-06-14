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
    const response = await axios.get(`https://bookandlink.com/booking/list_properties2.php`, {
      params: {
        checkin,
        checkout,
      },
    });

    const html = response.data;
    console.log(html); // Log HTML to ensure we get the expected content

    const $ = cheerio.load(html);
    const hotels = [];

    $('.hotel-item').each((index, element) => {
      const name = $(element).find('div').first().text().trim();
      const location = $(element).find('div').text().trim();
      const price = $(element).find('div').last().text().trim();

      hotels.push({ name, location, price });
    });

    console.log(hotels); // Log the extracted hotels to ensure they are being correctly parsed
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

