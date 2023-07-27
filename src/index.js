import { Chart } from "frappe-charts";

let chartData = [];
let municipalityCode = "SSS";

const fetchData = (code) => {
  fetch(
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: [
          {
            code: "Vuosi",
            selection: {
              filter: "item",
              values: [
                "2000",
                "2001",
                "2002",
                "2003",
                "2004",
                "2005",
                "2006",
                "2007",
                "2008",
                "2009",
                "2010",
                "2011",
                "2012",
                "2013",
                "2014",
                "2015",
                "2016",
                "2017",
                "2018",
                "2019",
                "2020",
                "2021"
              ]
            }
          },
          {
            code: "Alue",
            selection: {
              filter: "item",
              values: [code]
            }
          },
          {
            code: "Tiedot",
            selection: {
              filter: "item",
              values: ["vaesto"]
            }
          }
        ],
        response: {
          format: "json-stat2"
        }
      })
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chartData = data.value;
      drawChart();
    });
};

const drawChart = () => {
  const chart = new Chart("#chart", {
    title: "Population Chart",
    data: {
      labels: Array.from({ length: 22 }, (_, i) => 2000 + i),
      datasets: [{ values: chartData }]
    },
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};

fetchData(municipalityCode);

document
  .querySelector("#submit-data")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    let inputValue = document.querySelector("#input-area").value;
    const res3 = await fetch(
      "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"
    );
    const data3 = await res3.json();
    let alue = data3.variables[1].valueTexts;
    inputValue = inputValue.toLowerCase();
    inputValue = inputValue.replace(inputValue[0], inputValue[0].toUpperCase());
    let Cindex = alue.indexOf(inputValue);
    municipalityCode = data3.variables[1].values[Cindex];
    fetchData(municipalityCode);
  });

document.querySelector("#add-data").addEventListener("click", () => {
  const deltaValues = chartData
    .slice(1)
    .map((val, idx) => val - chartData[idx]);
  const meanDelta = deltaValues.reduce((a, b) => a + b, 0) / deltaValues.length;
  const nextDataPoint = chartData[chartData.length - 1] + meanDelta;
  chartData.push(nextDataPoint);
  drawChart();
});
