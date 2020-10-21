new Vue({
  el: "#app",
  data: {
    weight: "",
    height: "",
    totalBMI: [],
    repoBMI: []
  },
  computed: {
    calBMI() {
      let inputWeight = Number(weight.value);
      let inputHeight = Number(height.value) / 100;
      let BMI = Number(inputWeight / (inputHeight * inputHeight))
      return BMI.toFixed(2);
    }
  },
  methods: {
    getrepoInfo() {
      const url = "https://fathomless-brushlands-42339.herokuapp.com/todo3";
      axios.get(url).then((res) => {
        this.repoBMI = res.data;
        this.repoBMI.reverse();
      })

    },
    resultBMI() {
      const vm = this;
      let standardBMI;
      let bmi = vm.BMI
      if (bmi < 18.5) {

      }
    }
  }
})