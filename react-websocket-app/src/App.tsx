import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';
import FinancialChartMultipleData from './Chart';

interface Stock {
  symbol: string;
  price: number;
  change: number;
}

const socket = io('http://localhost:3001');

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    // Subscribe to 'stock' event from the socket
    socket.on('stock', (data: Stock[]) => {
      setStocks([...data]); // Create a new array
    });
  
    // Fetch initial stock data from the server
    axios.get<Stock[]>('/stocks').then((response: AxiosResponse<Stock[]>) => {
      setStocks(response.data);
    });
  
    // Cleanup the socket subscription when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Prices</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td className="border px-4 py-2">{stock.symbol}</td>
              <td className="border px-4 py-2">{stock.price}</td>
              <td className={`border px-4 py-2 ${stock.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <FinancialChartMultipleData />
    </div>
  );
}

export default App;
