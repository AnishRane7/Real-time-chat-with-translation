const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');  // Ensure this line is present
app.set('views', './views');

// Replace with your translation API key
const TRANSLATION_API_KEY = 'YOUR_API_KEY';

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-message', async (req, res) => {
  const { message } = req.body;
  try {
    console.log('Received message:', message); // Log received message
    const translatedMessage = await translateMessage(message);
    res.send(`<div class="message">${translatedMessage}</div>`);
  } catch (error) {
    console.error('Translation error:', error);
    res.send(`<div class="message error">Translation failed</div>`);
  }
});

async function translateMessage(text, targetLanguage = 'en') {
  console.log('Translating message:', text); // Log translation request
  const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, null, {
    params: {
      q: text,
      target: targetLanguage,
      key: TRANSLATION_API_KEY,
    }
  });
  return response.data.data.translations[0].translatedText;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
