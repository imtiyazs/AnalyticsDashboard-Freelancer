<script>
// Get data from props & render as Bar Charts

import { Bar } from "vue-chartjs";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";

export default {
  extends: Bar,
  props: ["datasetBar", "columnName"],
  data() {
    return {
      theLabels: [],
      theData: []
    };
  },
  mounted() {
    if (this.columnName === undefined) {
      //this.theLabels[] = 'Value'
    }

    let jsonObject = this.datasetBar;
    for (var key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        var val = jsonObject[key];
        if(val !== "" || val !== null || val !== undefined) {
          this.theLabels.push(key);
          this.theData.push(val);
        }
      }
    }
    this.renderMyChart();
  },
  methods: {
    renderMyChart() {
      this.renderChart(
        {
          labels: this.theLabels,
          datasets: [
            {
              label: this.columnName !== undefined ? this.columnName : "Values",
              backgroundColor: "#f87979",
              data: this.theData
            }
          ]
        },
        {
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString:
                    this.columnName !== undefined ? this.columnName : "Values"
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Frequency"
                }
              }
            ]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: true,
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: "index",
            position: "nearest",
            callbacks: {
              labelColor: function(tooltipItem, chart) {
                return {
                  backgroundColor:
                    chart.data.datasets[tooltipItem.datasetIndex]
                      .backgroundColor
                };
              }
            }
          }
        }
      );
    }
  }
};
</script>
