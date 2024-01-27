import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Chance from 'chance';
import cors from 'cors'; // Import cors
import { getStock, transformData } from './methods';

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
app.use(cors()); // Use cors middleware

const PORT = process.env.PORT || 3001;
const chance = new Chance();

const generateStockData = () => {
  const symbols = ['AAPL', 'GOOG', 'TSLA', 'AMZN', 'FB'];
  const stocks: any[] = [];

  symbols.forEach((symbol) => {
    const price = chance.floating({ min: 100, max: 500, fixed: 2 });
    const change = chance.floating({ min: -10, max: 10, fixed: 2 });

    stocks.push({
      symbol,
      price,
      change,
    });
  });

  return stocks;
};

io.on('connection', (socket) => {
  console.log('New client connected');

  setInterval(() => {
    const stocks = generateStockData();
    socket.emit('stock', stocks);
  }, 1000);
});

app.get('/stocks', (req, res) => {
  const stocks = generateStockData();
  res.json(stocks);
});

app.get('/google-stock', async (req, res) => {
  try {
    const stockData = await getStock('Google');
    const transformedData = transformData(stockData);
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching Stock data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/stock-detail', async (req, res) => {
  try {
    const { stocks } = req.body;

    // Ensure stocks is an array
    if (!Array.isArray(stocks)) {
      return res.status(400).json({ error: 'Invalid input. Stocks should be an array.' });
    }

    const stockDetails = await Promise.all(stocks.map(async (stock) => {
      try {
        const stockData = await getStock(stock);
        const transformedData = transformData(stockData);
        return { symbol: stock, data: transformedData };
      } catch (error) {
        console.error(`Error fetching ${stock} stock data:`, error);
        return { symbol: stock, data: null, error: 'Error fetching stock data' };
      }
    }));

    res.json(stockDetails);
  } catch (error) {
    console.error('Error processing stock details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
