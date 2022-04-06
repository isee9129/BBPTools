const TONES = [['Ｃ', 'Ｃ'], ['Ｃ♯', 'Ｄ♭'], ['Ｄ', 'Ｄ'], ['Ｄ♯', 'Ｅ♭'],
               ['Ｅ', 'Ｅ'], ['Ｆ', 'Ｆ'], ['Ｆ♯', 'Ｇ♭'], ['Ｇ', 'Ｇ'],
               ['Ｇ♯', 'Ａ♭'], ['Ａ', 'Ａ'], ['Ａ♯', 'Ｂ♭'], ['Ｂ', 'Ｂ']];
let labels = [];
let checkboxes = [];

// 入力部分生成
const inputElm = document.getElementById('tones');
for(let oct = 1; oct <= 7; oct++){
  const octElm = document.createElement('div');
  octElm.innerText = oct + ' :';
  for(let key = 0; key < 12; key++){
    const no = (oct - 1) * 12 + key;
    // ラベル
    const labelElm = document.createElement('label');
    labelElm.class = 'onKey' + TONES[key][0];
    labelElm.innerText = '　' + TONES[key][0];
    labels.push(labelElm);
    // チェックボックス
    const inputElm = document.createElement('input');
    inputElm.type = 'checkbox';
    inputElm.id = no;
    inputElm.class = 'onKeyBox' + + TONES[key][0];
    inputElm.checked = false;
    // inputElm.addEventListener('click', update);
    checkboxes.push(inputElm);
    // 追加！
    labelElm.appendChild(inputElm);
    octElm.appendChild(labelElm);
  }
  inputElm.appendChild(octElm);
}

// 調号更新用
let acciButton = [];
const acciids = ["sharp", "flat"];
for(let i of acciids){
  const cb = document.getElementById(i);
  cb.addEventListener('click', update);
  acciButton.push(cb);
}
acciButton[0].checked = true;
let acciElm = document.getElementsByName("acci")[1];

function update(){
  if(acciElm.checked){
    onFlat = 1;
  }else{
    onFlat = 0;
  }
  for(let i = 0; i < 84; i++){
    labels[i].innerText = '　' + TONES[i%12][onFlat];
    labels[i].appendChild(checkboxes[i]); // なんでこれやらなあかんの
  }
}
