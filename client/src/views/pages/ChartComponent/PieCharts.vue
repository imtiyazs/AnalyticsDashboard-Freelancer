<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ["datasetPie"],
  data() {
    return {
      theLabels: [],
      theData: []
    };
  },
  mounted() {
    for (var key in this.datasetPie) {
      if (this.datasetPie.hasOwnProperty(key)) {
        var val = this.datasetPie[key];
        if (val !== "" || val !== null || val !== undefined) {
          this.theLabels.push(key);
          this.theData.push(val);
        }
      }
    }

    this.renderMyChart();
  },
  methods: {
    renderMyChart() {
      /** Generate dynamic colors according to data size */
      let coloR = [],
        pieChartOptions = {
          legend: {
            fullWidth: false,
            position: "bottom",
            display: false
          },
          responsive: true,
          maintainAspectRatio: true,
          pieceLabel: {
            mode: "percentage",
            precision: 1
          }
        };

      if(this.theLabels.length < 50) {
        pieChartOptions.legend.display = true
      }

      let dynamicColors = function() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
      };

      for (let i in this.theData) {
        coloR.push(dynamicColors());
      }

      this.renderChart(
        {
          labels: this.theLabels,
          datasets: [
            {
              backgroundColor: coloR,
              borderColor: "rgba(200, 200, 200, 0.75)",
              hoverBorderColor: "rgba(200, 200, 200, 1)",
              data: this.theData
            }
          ]
        },
        pieChartOptions
      );
    }
  }
};
</script>
