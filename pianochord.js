const CHORDNAME = [{name:"",           tones:[0, 4,  7    ]},
             {name:"m",          tones:[0, 3,  7    ]},
             {name:"7(3音)",     tones:[0, 4, 10    ]},
             {name:"7",          tones:[0, 4,  7, 10]},
             {name:"M7(3音)",    tones:[0, 4, 11    ]},
             {name:"M7",         tones:[0, 4,  7, 11]},
             {name:"m7(3音)",    tones:[0, 3, 10    ]},
             {name:"m7",         tones:[0, 3,  7, 10]},
             {name:"dim7(3音)",  tones:[3, 6,  9    ]},
             {name:"dim7",       tones:[0, 3,  6,  9]},
             {name:"m7♭5(3音)",  tones:[3, 6, 10    ]},
             {name:"m7♭5",       tones:[0, 3,  6, 10]},
             {name:"aug",        tones:[0, 4,  8    ]},
             {name:"sus4",       tones:[0, 5,  7    ]},
             {name:"7sus4(3音)", tones:[0, 5, 10    ]},
             {name:"7sus4",      tones:[0, 5,  7, 10]},
             {name:"6(3音)",     tones:[4, 7,  9    ]},
             {name:"6",          tones:[0, 4,  7,  9]},
             {name:"add9(3音)",  tones:[2, 4,  7    ]},
             {name:"add9",       tones:[0, 2,  4,  7]}
            ];
const TONES = [['C', 'C'], ['C♯', 'D♭'], ['D', 'D'], ['D♯', 'E♭'], ['E', 'E'], ['F', 'F'],
         ['F♯', 'G♭'], ['G', 'G'], ['G♯', 'A♭'], ['A', 'A'], ['A♯', 'B♭'], ['B', 'B']];
let onFlat = 0; // 表記を♯にするか♭にするか 1なら♭

// 構成音からいい感じのコードを見つけ出す
// onlist: どの音を含みたいか boolean型の12個の配列
// 返り値: [ok:完全一致するコードリスト, near:部分一致するコードリスト]
function search(onlist, okTone){
  let tonecount = 0; // 構成音の数
  for(let no = 0; no < onlist.length; no++){
    if(onlist[no]){
      tonecount++;
    }
  }
  let oklist = []; // 完全一致したコードリスト
  let nearlist = []; // 部分一致 + 残りがOK音なコードリスト
  for(let root = 0; root < TONES.length; root++){
    for(let chord = 0; chord < CHORDNAME.length; chord++){
      const chname = TONES[root][onFlat] + CHORDNAME[chord].name;
      const chtone = CHORDNAME[chord].tones;
      const chtonename = [];
      const isfittone = [];
      let fitcount = 0; // 一致した音の数
      let nearcount = 0; // OK音だった数
      let ngcount = 0; // NG音だった数
      for(let idx = 0; idx < chtone.length; idx++){
        const tone = (chtone[idx] + root) % 12;
        chtonename.push(TONES[tone][onFlat]);
        let fit = false;
        if(onlist[tone]){
          fitcount++;
          fit = true
        }else if (okTone[tone]) {
          nearcount++;
        }else{
          ngcount++;
        }
        isfittone.push(fit)
      }
      if(ngcount === 0 && (nearcount === 0 || fitcount === tonecount)){
        if(nearcount !== 0 || fitcount !== tonecount){
          nearlist.push({name:chname, tones:chtonename, isfit:isfittone});
        }else{
          oklist.push({name:chname, tones:chtonename, isfit:isfittone})
        }
      }
    }
  }
  return {ok:oklist, near:nearlist};
}

// コードリストをHTMLの形に
// chord: {name:'コード名', tones:[構成音], isfit:[一致してる音？]}
// isok: 完全一致してる？
// 返り値: いい感じにHTML化したもの
function chord2Html(chord, isok){
  let chordHtml = '';
  if(isok){
    chordHtml = `<td class="chname">${chord.name}</td>`;
  }else{
    chordHtml = `<td class="chname">${chord.name}</td>`;
  }
  for(let idx = 0; idx < 4; idx++){
    if(idx >= chord.tones.length){
      chordHtml += '<td></td>';
    }else{
      if(chord.isfit[idx]){
        chordHtml += `<td class="fittone">${chord.tones[idx]}</td>`;
      }else{
        chordHtml += `<td class="othertone">${chord.tones[idx]}</td>`;
      }
    }
  }
  return chordHtml;
}

// 画面更新
// 調号更新 → コード検索 → 結果に出力
function update(){
  updateAcci();
  let inputTone = [];
  for(let cb of onKeybox){
    inputTone.push(cb.checked);
  }
  let inputOkTone = [];
  for(let cb of okKeybox){
    inputOkTone.push(cb.checked);
  }

  const result = search(inputTone, inputOkTone);

  const header = '<tr><th>コード名</th><th colspan="4">構成音</th></tr>'

  let resultHtml = '<table><caption>一致するコード</caption>' + header;
  for(let idx = 0; idx < result.ok.length; idx++){
    resultHtml += '<tr>' + chord2Html(result.ok[idx], true) + '</tr>';
  }
  const resultElm = document.getElementById('result');
  resultElm.innerHTML = resultHtml;

  let nearHtml = '<table><caption>近いコード</caption>' + header;
  for(let idx = 0; idx < result.near.length; idx++){
    nearHtml += '<tr>' + chord2Html(result.near[idx], false) + '</tr>';
  }
  const nearElm = document.getElementById('nearresult');
  nearElm.innerHTML = nearHtml;
}

// 調号更新
function updateAcci(){
  if(acciElm.checked){
    onFlat = 1;
  }else{
    onFlat = 0;
  }
  for(let i = 0; i < 12; i++){
    onKeylabel[i].textContent = TONES[i][onFlat]
    okKeylabel[i].textContent = TONES[i][onFlat]
  }
}

// 調の設定
function setOkKey(){
  let cholist = [false,false,false,false,false,false,false,false,false,false,false,false]
  let num = keySelector.value;
  if(num === 'all'){
    cholist = [true,true,true,true,true,true,true,true,true,true,true,true]
  }else if(num !== 'mu'){
    num = parseInt(num);

    Cmaj = [0,2,4,5,7,9,11]
    for(let i of Cmaj){
      cholist[(i+num)%12] = true
    }
  }
  for(let i = 0; i < 12; i++){
    okKeybox[i].checked = cholist[i];
  }
  update();
}

// 構成音エリア
let onKeybox = [];
let onKeylabel = [];
const onids = ["onKeyC","onKeyDb","onKeyD","onKeyEb","onKeyE","onKeyF","onKeyGb","onKeyG","onKeyAb","onKeyA","onKeyBb","onKeyB"];
for(let i of onids){
  const cb = document.getElementById(i);
  cb.checked = false;
  cb.addEventListener('click', update);
  onKeybox.push(cb);

  const cbl = document.getElementById(i+'label');
  onKeylabel.push(cbl);
}

// 含んでもいい音エリア
let okKeybox = [];
let okKeylabel = [];
const okids = ["okKeyC","okKeyDb","okKeyD","okKeyEb","okKeyE","okKeyF","okKeyGb","okKeyG","okKeyAb","okKeyA","okKeyBb","okKeyB"];
for(let i of okids){
  const cb = document.getElementById(i);
  cb.checked = false;
  cb.addEventListener('click', update);
  okKeybox.push(cb);

  const cbl = document.getElementById(i+'label');
  okKeylabel.push(cbl);
}
const keySelector = document.getElementById('okKeySelect');
keySelector.options[0].selected = true;
const skb = document.getElementById('setKeyButton');
skb.addEventListener('click', setOkKey);

// 調号エリア
let acciButton = [];
const acciids = ["sharp", "flat"];
for(let i of acciids){
  const cb = document.getElementById(i);
  cb.addEventListener('click', update);
  acciButton.push(cb);
}
acciButton[0].checked = true;
let acciElm = document.getElementsByName("acci")[1];

// const sb = document.getElementById('searchButton');
// sb.addEventListener('click', setOkKey);

update();
