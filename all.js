const inputHeight = document.querySelector('.height');
const inputWeight = document.querySelector('.weigth');
const btnSubmit = document.querySelector('#submit');
const btnReset = document.querySelector('#reset');
const listRecord = document.querySelector('.list');
const average = document.querySelector('.bmirecord')
const url = "https://fathomless-brushlands-42339.herokuapp.com/todo3";


let pHeight = "";
let pWeight = "";
let pBMI = "";
let pRecord = {};
let reposInfo = [];


let BMIData = {
  "overThin": {
    class: "blue",
    statusText: "過輕"
  },
  "normal": {
    class: "orange",
    statusText: "正常"
  },
  "overWeight": {
    class: "gray",
    statusText: "準肥仔"
  },
  "aLitterFat": {
    class: "green",
    statusText: "小肥仔"
  },
  "Fat": {
    class: "yellow",
    statusText: "肥仔"
  },
  "veryFat": {
    class: "red",
    statusText: "大肥仔"
  }
};


//刪除帶入id對應的資料
function deleteData(id) {
  axios.delete(`${url}/${id}`, {
    data: {
      id: id
    }
  }).then(res => {
    console.log(res);
    getInfo();
  })
};


/* 抓資料並渲染畫面  */
function getInfo() {
  axios.get(url).then(function (res) {
    reposInfo = res.data;

    // 將抓取的資料反排
    reposInfo.reverse();
    // 渲染畫面
    render();
  })
};


// 渲染畫面
function render() {
  let str = "";
  let totalBMI = 0;
  let averageBMI = 0;
  reposInfo.forEach(function (item) {
    str += `<li class="${BMIData[item.Status].class}"><i class="far fa-trash-alt"  data-id='${item.id}'></i><h3>${BMIData[item.Status].statusText}</h3>
    <div class ="record">
    <p>BMI：${item.BMI}</p>
     <p>身高：${item.Height}</p>
     <p>體重：${item.weight}</p>
     </div>
    </li>
     `
    //計算每個人BMI的總和
    totalBMI += Number(item.BMI);

  });
  listRecord.innerHTML = str;

  //計算BMI的平均值
  averageBMI = reposInfo.length === 0 ? '0' : (totalBMI / reposInfo.length).toFixed(2);
  average.innerHTML = `
  <div>總共測量 
  ${reposInfo.length} 次
  平均BMI為 ${averageBMI}
  </div>`;
};


// 將資料計算並且上傳
function postInfo() {
  axios.post(url, {
    Height: pHeight,
    weight: pWeight,
    BMI: pBMI,
    Status: pRecord.status
  }).then(function (res) {
    reposInfo.push(pRecord)
    getInfo();

    console.log(res)
  }).catch(function (error) {
    console.log(error)
  })
}


/*處理資料 */
function calBMI() {
  pHeight = Number(inputHeight.value);
  pWeight = Number(inputWeight.value);
  pBMI = (pWeight / ((pHeight / 100) ** 2)).toFixed(2);
  pRecord = {
    height: '',
    weight: '',
    BMI: '',
    status: ''
  }
  //先判斷輸入的值是否正確
  if (pHeight === "" || pHeight === 0) {
    alert('請填入身高');
    inputHeight.value = '';
    inputWeight.value = '';
    return;
  } else if (pWeight === " " || pWeight === 0) {
    alert('請填入體重');
    inputHeight.value = '';
    inputWeight.value = '';
    return;
    //如果正確就帶入正確的值
  } else {
    pRecord.height = Number(pHeight);
    pRecord.weight = Number(pWeight);
    pRecord.BMI = pBMI;
  }
  //判斷BMI
  if (pBMI < 18.5) {
    pRecord.status = 'overThin';
  }
  else if (18.5 <= pBMI && pBMI < 24) { pRecord.status = 'normal'; }
  else if (24 <= pBMI && pBMI < 27) { pRecord.status = 'overWeight'; }
  else if (27 <= pBMI && pBMI < 30) { pRecord.status = 'aLitterFat'; }
  else if (30 <= pBMI && pBMI < 35) { pRecord.status = 'Fat'; }
  else if (pBMI >= 35) {
    pRecord.status = 'veryFat';
  }
  else {
    return;
  }

  //將輸入的資料傳到遠端
  postInfo();

  //清除inputBox內容
  inputHeight.value = "";
  inputWeight.value = "";
}



//渲染畫面
getInfo();

//監聽計算事件
btnSubmit.addEventListener('click', calBMI);

//刪除單筆資料
listRecord.addEventListener('click',
  function (e) {
    if (e.target.nodeName === "I") {
      let getId = e.target.dataset.id;
      swal({
        title: "您確定要刪除？",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((value) => {
        if (value === true) {
          deleteData(getId)
        }
      });
    }
  });


//刪除全部資料的方法
function deleteAll() {
  swal({
    title: "您確定要清除全部資料？",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then((value) => {
    if (value === true) {
      reposInfo.forEach(i => {
        deleteData(i.id)
      })
    }
  })
  getInfo();
}


// 監聽刪除全部資料
btnReset.addEventListener('click', deleteAll);

