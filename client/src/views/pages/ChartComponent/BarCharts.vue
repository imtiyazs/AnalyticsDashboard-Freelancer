<script>
import { Bar } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

export default {
  extends: Bar,
  props:['datasetBar'],
  data(){
    return{
      theLabels : [],
      theData : []
    }
  },
  mounted () {
    // Overwriting base render method with actual data.
   //let jsonObject = { "45.0": 1, "44.0": 1, "36.0": 3, "41.0": 1, "43.0": 1, "39.0": 1, "32.0": 4, "40.0": 3, "46.0": 1, "23.0": 1, "35.0": 2, "30.0": 2, "34.0": 3, "38.0": 2, "37.0": 1, "25.0": 3 }
   let jsonObject = this.datasetBar
   for (var key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      var val = jsonObject[key];
      //console.log("Key :: ",key);
      this.theLabels.push(key)
      //console.log("Value :: ",val);
      this.theData.push(val)
    } 
    
   }
  console.log(this.theLabels)
  console.log(this.theData)
   this.renderMyChart()
  },
  methods:{
    renderMyChart(){
       this.renderChart(
      {
        labels: this.theLabels,
        datasets: [
          {
            label: 'GitHub Commits',
            backgroundColor: '#f87979',
            data: this.theData
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          enabled: false,
          custom: CustomTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].backgroundColor }
            }
          }
        }
      }
    )
    }
  }
}
</script>
