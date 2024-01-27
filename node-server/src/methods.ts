export async function getStock(name: string) {
  const url = `https://static.infragistics.com/xplatform/data/stocks/stock${name}.json`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const stockData = convertData(jsonData);
  return stockData;
}

function convertData(jsonData: any) {
  let stockItems = [];

  for (let json of jsonData) {
    let parts = json.date.split('-');
    let item = {
      date: new Date(parts[0], parts[1], parts[2]),
      open: json.open,
      high: json.high,
      low: json.low,
      close: json.close,
      volume: json.volume,
    };

    stockItems.push(item);
  }

  return stockItems;
}

export function transformData(rawData: any) {
  // Your transformation logic here, if needed
  // For now, just returning the raw data
  return rawData;
}