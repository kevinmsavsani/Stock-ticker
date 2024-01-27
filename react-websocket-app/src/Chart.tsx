import React, { useState, useEffect } from "react";
import { IgrFinancialChart } from "igniteui-react-charts";
import { IgrFinancialChartModule } from "igniteui-react-charts";

IgrFinancialChartModule.register();

const FinancialChartMultipleData = () => {
  const [data, setData] = useState([]);
  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/stock-detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stocks: ["Google", "Microsoft"],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const stocks = await response.json();
        const updatedArray = stocks
          .map((stock: any) => stock.data)
          .map((innerArray: any) =>
            innerArray.map((item: any) => ({
              ...item,
              date: new Date(item.date),
            }))
          );
        const stockData = updatedArray.map((val: any, idx: number) => {
          let newArr = [...val];
          (newArr as any).__dataIntents = {
            close: [`SeriesTitle/${stocks[idx].symbol}`]
          };
          return newArr
        })
        setData(stockData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="flex flex-col h-[500px] p-2" style={{ height: "500px" }}>
      <div className="flex-1 relative h-[500px]" style={{ height: "500px" }}>
        <IgrFinancialChart
          width="100%"
          height="100%"
          chartType="Line"
          thickness={2}
          chartTitle="Google vs Microsoft Changes"
          subtitle="Between 2013 and 2017"
          yAxisMode="PercentChange"
          yAxisTitle="Percent Changed"
          dataSource={data}
        />
      </div>
    </div>
  );
};

export default FinancialChartMultipleData;
