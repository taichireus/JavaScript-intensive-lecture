const express = require('express');
const path = require('node:path');
const axios = require('axios');
require('dotenv').config();

const app = express();

// ejs をビューエンジンとして指定
app.set('view engine', 'ejs');
// public ディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));
// JSON ボディパーサー
app.use(express.json());

// ログミドルウェア
const logMiddleware = (req, res, next) => {
    console.log(req.method, req.path);
    next();
};

// GET '/' （トップ）アクセス時の挙動
app.get('/', (req, res) => {
  res.render('index', { weather: null });
});

// GET '/weather' ルートで天気情報を取得して表示
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).send('City parameter is required');
  }

  try {
    // OpenWeatherMap API から天気情報を取得
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.API_KEY,
        units: 'metric'
      }
    });
    const weatherData = response.data;

    // データベース機能は削除されたため、以下のコードで取得したデータをそのまま表示
    res.render('index', {
      weather: {
        city: weatherData.name,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch weather data');
  }
});

// サーバーの起動
app.listen(3000, () => {
  console.log('Server is running');
});
