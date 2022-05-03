const CHORDNAME = [{name:"",           tones:[0, 4,  7    ]},
             {name:"m",          tones:[0, 3,  7    ]},
             {name:"7 (3音)",     tones:[0, 4, 10    ]},
             {name:"7",          tones:[0, 4,  7, 10]},
             {name:"M7 (3音)",    tones:[0, 4, 11    ]},
             {name:"M7",         tones:[0, 4,  7, 11]},
             {name:"m7 (3音)",    tones:[0, 3, 10    ]},
             {name:"m7",         tones:[0, 3,  7, 10]},
             {name:"dim7 (3音)",  tones:[3, 6,  9    ]},
             {name:"dim7",       tones:[0, 3,  6,  9]},
             {name:"m7♭5 (3音)",  tones:[3, 6, 10    ]},
             {name:"m7♭5",       tones:[0, 3,  6, 10]},
             {name:"aug",        tones:[0, 4,  8    ]},
             {name:"sus4",       tones:[0, 5,  7    ]},
             {name:"7sus4 (3音)", tones:[0, 5, 10    ]},
             {name:"7sus4",      tones:[0, 5,  7, 10]},
             {name:"6 (3音)",     tones:[4, 7,  9    ]},
             {name:"6",          tones:[0, 4,  7,  9]},
             {name:"add9 (3音)",  tones:[2, 4,  7    ]},
             {name:"add9",       tones:[0, 2,  4,  7]}
            ];
const TONES = [['Ｃ', 'Ｃ'], ['Ｃ♯', 'Ｄ♭'], ['Ｄ', 'Ｄ'], ['Ｄ♯', 'Ｅ♭'],
               ['Ｅ', 'Ｅ'], ['Ｆ', 'Ｆ'], ['Ｆ♯', 'Ｇ♭'], ['Ｇ', 'Ｇ'],
               ['Ｇ♯', 'Ａ♭'], ['Ａ', 'Ａ'], ['Ａ♯', 'Ｂ♭'], ['Ｂ', 'Ｂ']];
const TONECLASS = ['ng', 'good', 'best']
let onlabels = [];
let oncheckboxes = [];
let oklabels = [];
let okcheckboxes = [];
let onFlat = 0; // 表記を♯にするか♭にするか 1なら♭

// 入力部分生成
const oninputElm = document.getElementById('tones');
for(let oct = 1; oct <= 1; oct++){
  const octElm = document.createElement('div');
  octElm.className = 'inputRow';
  for(let key = 0; key < 12; key ++){
    const no = (oct - 1) * 12 + key;
    // ラベル
    const labelElm = document.createElement('label');
    labelElm.className = 'onKey';
    labelElm.className += ' inTone';
    if(key == 1 || key == 3 || key == 6 || key == 8 || key == 10 ){
      labelElm.className += ' blackTone';
    }else{
      labelElm.className += ' whiteTone';
    }
    labelElm.innerText = TONES[key][0];
    labelElm.htmlFor = no;
    onlabels.push(labelElm);
    // チェックボックス
    const checkElm = document.createElement('input');
    checkElm.type = 'checkbox';
    checkElm.id = no;
    checkElm.className = 'onKeyBox' + key;
    checkElm.checked = false;
    checkElm.addEventListener('click', update);
    oncheckboxes.push(checkElm);
    // 追加！
    octElm.appendChild(checkElm);
    octElm.appendChild(labelElm);
  }
  oninputElm.appendChild(octElm);
}
const resetButton = document.getElementById('resetToneButton');
resetButton.addEventListener('click', resetTone);

// 含んでもいい音
const okinputElm = document.getElementById('oktones');
for(let oct = 1; oct <= 1; oct++){
  const octElm = document.createElement('div');
  octElm.className = 'inputRow';
  for(let key = 0; key < 12; key ++){
    const no = (oct - 1) * 12 + key;
    // ラベル
    const labelElm = document.createElement('label');
    labelElm.className = 'onKey';
    labelElm.className += ' inTone';
    if(key == 1 || key == 3 || key == 6 || key == 8 || key == 10 ){
      labelElm.className += ' blackTone';
    }else{
      labelElm.className += ' whiteTone';
    }
    labelElm.innerText = TONES[key][0];
    labelElm.htmlFor = 'ok'+no;
    oklabels.push(labelElm);
    // チェックボックス
    const checkElm = document.createElement('input');
    checkElm.type = 'checkbox';
    checkElm.id = 'ok'+no;
    checkElm.className = 'onKeyBox' + key;
    checkElm.checked = false;
    checkElm.addEventListener('click', update);
    okcheckboxes.push(checkElm);
    // 追加！
    octElm.appendChild(checkElm);
    octElm.appendChild(labelElm);
  }
  okinputElm.appendChild(octElm);
}
// 調から選ぶとこ
const keySelector = document.getElementById('okKeySelector');
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

// 結果出力準備
const bestElm = document.getElementById('perfect');
const greatElm = document.getElementById('great');


// 画面更新
// 調号更新 → コード検索 → 結果に出力
function update(){
  // 調号更新
  if(acciElm.checked){
    onFlat = 1;
  }else{
    onFlat = 0;
  }
  for(let i = 0; i < 12; i++){
    onlabels[i].innerText = TONES[i][onFlat];
    oklabels[i].innerText = TONES[i][onFlat];
  }
  // ピアコ検索
  // ONな音を取得
  let onTone = [];
  for(let cb of oncheckboxes){
    onTone.push(cb.checked);
  }
  let okTone = [];
  for(let cb of okcheckboxes){
    okTone.push(cb.checked);
  }
  // いい感じのコードを検索
  const result = searchChord(onTone, okTone);
  // console.log(result);
  // 結果の表示
  drawResult(result['best'], bestElm, '一致するコード');
  drawResult(result['good'], greatElm, '近いコード');

  // const header = '<tr><th>コード名</th><th colspan="4">構成音</th></tr>'
  //
  // let resultHtml = '<table><caption>一致するコード</caption>' + header;
  // for(let idx = 0; idx < result.ok.length; idx++){
  //   resultHtml += '<tr>' + chord2Html(result.ok[idx], true) + '</tr>';
  // }
  // const resultElm = document.getElementById('result');
  // resultElm.innerHTML = resultHtml;
  //
  // let nearHtml = '<table><caption>近いコード</caption>' + header;
  // for(let idx = 0; idx < result.near.length; idx++){
  //   nearHtml += '<tr>' + chord2Html(result.near[idx], false) + '</tr>';
  // }
  // const nearElm = document.getElementById('nearresult');
  // nearElm.innerHTML = nearHtml;
}


// 構成音からいい感じのコードを見つけ出す
// in: onlist: どの音を含みたいか boolean型の12個の配列
//     okTone: 含んでもいいやつ
// out: [ok:[完全一致するコード], near:[部分一致するコード]]
//      各コードは {name:[ルート,コード名], tones:[構成音], fittone:[一致してる音]}
function searchChord(onlist, okTone){
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
      const chroot = TONES[root][onFlat];
      const chname = CHORDNAME[chord].name;
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
        if(chtone.length === 3){
          chtonename.push('');
          isfittone.push(false);
        }
        if(nearcount !== 0 || fitcount !== tonecount){
          nearlist.push({'name':[chroot,chname], 'tones':chtonename, 'isfit':isfittone});
        }else{
          oklist.push({'name':[chroot,chname], 'tones':chtonename, 'isfit':isfittone})
        }
      }
    }
  }
  return {'best':oklist, 'good':nearlist};
}

// コードリストをHTMLの形に
// in: chord: {name:'コード名', tones:[構成音], isfit:[一致してる音]}
//     elem: 結果の表を入れるハコ
//     capt: 表タイトル
function drawResult(chord, elem, capt){
  const table = document.createElement('table');
  const caption = document.createElement('caption');
  caption.innerText = capt;
  table.appendChild(caption);
  // ヘッダー
  const header = document.createElement('tr');

  const header_name = document.createElement('th');
  header_name.setAttribute('colspan', '2');
  header_name.innerText = 'コード名';
  header_name.className = 'chordname';
  header.appendChild(header_name);
  // const header_no = document.createElement('th');
  // header_no.innerText = '番号';
  // header.appendChild(header_no);
  const header_tone = document.createElement('th');
  header_tone.setAttribute('colspan', '4');
  header_tone.innerText = '構成音';
  header_tone.className = 'chordtones';
  header.appendChild(header_tone);

  table.appendChild(header);

  // データ部分
  for(let i = 0; i < chord.length; i++){
    const c = chord[i]
    const row = document.createElement('tr');

    const row_root = document.createElement('td');
    row_root.className = 'chordroot';
    row_root.innerText = c['name'][0];
    row.appendChild(row_root);
    const row_name = document.createElement('td');
    row_name.className = 'chordname';
    row_name.innerText = c['name'][1];
    row.appendChild(row_name);
    // const row_no = document.createElement('td');
    // row_no.className = 'chordno';
    // row_no.innerText = c['no'];
    // row.appendChild(row_no);

    for(let j = 0; j < c['tones'].length; j++){
      let tdTone = document.createElement('td');
      if(c['isfit'][j]){
        tdTone.className = 'best';
      }else{
        tdTone.className = 'ng';
      }
      tdTone.innerText = c['tones'][j];
      row.appendChild(tdTone);
    }
    table.appendChild(row);
  }

  elem.innerText = '';
  elem.appendChild(table);
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
    okcheckboxes[i].checked = cholist[i];
  }
  update();
}

// リセットボタン
function resetTone(){
  for(let i = 0; i < oncheckboxes.length; i++){
    oncheckboxes[i].checked = false;
  }
  update();
}

// const sb = document.getElementById('searchButton');
// sb.addEventListener('click', setOkKey);

update();
