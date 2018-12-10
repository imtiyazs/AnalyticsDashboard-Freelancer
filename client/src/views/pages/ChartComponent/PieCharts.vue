<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props:['datasetPie'],
  data(){
    return{
      theLabels : [],
      theData : []
    }
  },
  mounted () {
    //let jsonObject = { "45.0": 1, "44.0": 1, "36.0": 3, "41.0": 1, "43.0": 1, "39.0": 1, "32.0": 4, "40.0": 3, "46.0": 1, "23.0": 1, "35.0": 2, "30.0": 2, "34.0": 3, "38.0": 2, "37.0": 1, "25.0": 3 }
    let jsonObject = this.datasetPie
    for (var key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        var val = jsonObject[key];
        //console.log("Key :: ",key);
        this.theLabels.push(key)
        //console.log("Value :: ",val);
        this.theData.push(val)
      }
    }
    //console.log(this.theLabels)
    //console.log(this.theData)
    this.renderMyChart()
  },
  methods:{
    renderMyChart() {
      this.renderChart({
      labels: this.theLabels,
      datasets: [
        {
          backgroundColor: [
            '#41B883', '#E46651', '#00D8FF', '#DD1B16',
            '#BF462D', '#BF7F2D', '#BF2D7A', '#2D4ABF',
            '#2DBFBD', '#7373B5', '#325C46', '#AA1E62',
            '#583445','#ADD2A4', '#41B883', '#E46651',
            '#00D8FF', '#DD1B16', '#BF462D', '#BF7F2D',
            '#BF2D7A', '#2D4ABF', '#2DBFBD', '#7373B5',
            '#325C46', '#AA1E62', '#583445','#ADD2A4'

          ],
          data: this.theData
        }
      ]
    }, {responsive: true, maintainAspectRatio: true})
    }
  }
}
</script>
