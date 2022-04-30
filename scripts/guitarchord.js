var CHORDS = 'hoge';
const TONES = [['Ｃ', 'Ｃ'], ['Ｃ♯', 'Ｄ♭'], ['Ｄ', 'Ｄ'], ['Ｄ♯', 'Ｅ♭'],
               ['Ｅ', 'Ｅ'], ['Ｆ', 'Ｆ'], ['Ｆ♯', 'Ｇ♭'], ['Ｇ', 'Ｇ'],
               ['Ｇ♯', 'Ａ♭'], ['Ａ', 'Ａ'], ['Ａ♯', 'Ｂ♭'], ['Ｂ', 'Ｂ']];
const TONECLASS = ['ng', 'good', 'best'];
let labels = [];
let checkboxes = [];
let onFlat = 0

// ギタコ構成音取得
const url = 'https://isee9129.github.io/BBPTools/scripts/guitarchord.json';
const request = new XMLHttpRequest();
request.open('GET', url);
request.responseType = 'json';
request.send();
request.onload = function() {
  const guitarchordData = request.response;
  setGuitarChords(guitarchordData);
}

// 入力部分生成
const inputElm = document.getElementById('tones');
for(let oct = 1; oct <= 7; oct++){
  const octElm = document.createElement('div');
  octElm.className = 'inputRow';
  const octlabel = document.createElement('label');
  octlabel.innerText = oct;
  octlabel.className = 'oct'
  octElm.appendChild(octlabel);
  for(let key = 0; key < 12; key++){
    const no = (oct - 1) * 12 + key;
    // ラベル
    const labelElm = document.createElement('label');
    labelElm.className = 'onKey';
    if(no <= 27 || no >= 67){
      labelElm.className += ' outTone';
    }else{
      labelElm.className += ' inTone';
    }
    if(key == 1 || key == 3 || key == 6 || key == 8 || key == 10 ){
      labelElm.className += ' blackTone';
    }else{
      labelElm.className += ' whiteTone';
    }
    labelElm.innerText = TONES[key][0];
    labelElm.htmlFor = no;
    labels.push(labelElm);
    // チェックボックス
    const inputElm = document.createElement('input');
    inputElm.type = 'checkbox';
    inputElm.id = no;
    inputElm.className = 'onKeyBox' + key;
    inputElm.checked = false;
    inputElm.addEventListener('click', update);
    checkboxes.push(inputElm);
    // 追加！
    octElm.appendChild(inputElm);
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

// 結果出力準備
const bestElm = document.getElementById('perfect');
const greatElm = document.getElementById('great');

function setGuitarChords(jsonElm){
  CHORDS = jsonElm;
}

// 画面更新
function update(){
  // 調号部分の更新
  if(acciElm.checked){
    onFlat = 1;
  }else{
    onFlat = 0;
  }
  for(let i = 0; i < 84; i++){
    labels[i].innerText = TONES[i%12][onFlat];
    // labels[i].appendChild(checkboxes[i]); // なんでこれやらなあかんの
  }
  // ギタコ検索
  // ONな音を取得
  let onTone = [];
  for(let i = 0; i < checkboxes.length; i++){
    if(checkboxes[i].checked){
      onTone.push(i - 24);
    }
  }
  // いい感じのコードを検索
  const goodChord = searchChord(onTone);
  // 結果の表示
  drawResult(goodChord['best'], bestElm, '一致するコード');
  drawResult(goodChord['good'], greatElm, '近いコード');
}

// いい感じのコードを検索
// in: 音階の配列
// out: {'best':[完全一致するコード], 'good':[構成音は合ってるコード]}
//      各コードは {name:コード名, no:番号, tone:[構成音], dle:[一致度]}
//      一致度: 0:不一致, 1:オク違い, 2:一致
function searchChord(onTone){
  let res = {'best':[], 'good':[]};
  if(onTone.length == 0) return res;
  for(let root in CHORDS){
    for(let name in CHORDS[root]){
      for(let chordNo in CHORDS[root][name]){
        const tones = CHORDS[root][name][chordNo];
        let count = 0;
        let used = [];
        for(let i = 0; i < onTone.length; i++) used.push(false);
        let dle = [0, 0, 0, 0, 0, 0];
        // 完全一致
        for(let j = 0; j < onTone.length; j++){
          for(let i = 0; i < 6; i++){
            if(dle[i] === 0 && tones[i] == onTone[j]){
              used[j] = true;
              dle[i] = 2;
              count++;
              break;
            }
          }
        }
        if(count === onTone.length){
          res['best'].push({'name':`${TONES[root][onFlat]}${name}`, 'no':1 + parseInt(chordNo),
                       'tone':tones, 'dle':dle});
          continue;
        }
        // 構成音一致
        for(let j = 0; j < onTone.length; j++){
          if(used[j]) continue;
          for(let i = 0; i < 6; i++){
            if(dle[i] === 0 && (tones[i] - onTone[j]) % 12 === 0){
              dle[i] = 1;
              count++;
              break;
            }
          }
        }
        if(count === onTone.length){
          res['good'].push({'name':`${TONES[root][onFlat]}${name}`, 'no':1 + parseInt(chordNo),
                       'tone':tones, 'dle':dle});
          continue;
        }
      }
    }
  }
  return res;
}

// 結果出力
function drawResult(chord, elem, capt){
  const table = document.createElement('table');
  const caption = document.createElement('caption');
  caption.innerText = capt;
  table.appendChild(caption);
  // ヘッダー
  const header = document.createElement('tr');

  const header_name = document.createElement('th');
  header_name.innerText = 'コード名';
  header.appendChild(header_name);
  const header_no = document.createElement('th');
  header_no.innerText = '番号';
  header.appendChild(header_no);
  const header_tone = document.createElement('th');
  header_tone.setAttribute('colspan', '6');
  header_tone.innerText = '構成音';
  header.appendChild(header_tone);

  table.appendChild(header);

  // データ
  for(let i = 0; i < chord.length; i++){
    const c = chord[i]
    const row = document.createElement('tr');

    const row_name = document.createElement('td');
    row_name.className = 'chordname';
    row_name.innerText = c['name'];
    row.appendChild(row_name);
    const row_no = document.createElement('td');
    row_no.className = 'chordno';
    row_no.innerText = c['no'];
    row.appendChild(row_no);

    for(let j = 0; j < c['tone'].length; j++){
      let tdTone = document.createElement('td');
      tdTone.className = TONECLASS[c['dle'][j]];
      if(c['tone'][j] === 'x'){
        tdTone.innerText = 'x';
      }else{
        tdTone.innerText = toneNum2Name(c['tone'][j]);
      }
      row.appendChild(tdTone);
    }
    table.appendChild(row);
  }

  elem.innerText = '';
  elem.appendChild(table);

}

// 音階の数値を国際表記に直す
function toneNum2Name(tonenum){
  return `${TONES[tonenum % 12][onFlat]}${Math.floor(tonenum / 12) + 3}`
}

update()
