var CHORDS = 'hoge';
const CHORDNAMES = ['', 'm', '7', 'M7', 'm7', 'dim7', 'm7♭5', 'aug', 'sus4', '7sus4', '6', 'add9']
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
    const checkElm = document.createElement('input');
    checkElm.type = 'checkbox';
    checkElm.id = no;
    checkElm.className = 'onKeyBox' + key;
    checkElm.checked = false;
    checkElm.addEventListener('click', update);
    checkboxes.push(checkElm);
    // 追加！
    octElm.appendChild(checkElm);
    octElm.appendChild(labelElm);
  }
  inputElm.appendChild(octElm);
}
const resetButton = document.getElementById('resetToneButton');
resetButton.addEventListener('click', resetTone);

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
  update()
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
//      各コードは {root:ルート, name:コード名, no:番号
//                , tone:[構成音], dle:[一致度], score:得点}
//      一致度: 0:不一致, 1:オク違い, 2:一致
function searchChord(onTone){
  let res = {'best':[], 'good':[]};
  if(onTone.length == 0) return res;
  for(let root in CHORDS){
    for(let name in CHORDS[root]){
      for(let chordNo in CHORDS[root][name]){
        const tones = CHORDS[root][name][chordNo];
        let score = 0;
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
              score += 10;
              count++;
              break;
            }
          }
        }
        if(count === onTone.length){
          res['best'].push({'root':TONES[root][onFlat], 'name':name, 'no':1 + parseInt(chordNo),
                       'tone':tones, 'dle':dle, 'score':score});
          continue;
        }
        // 構成音一致
        for(let j = 0; j < onTone.length; j++){
          if(used[j]) continue;
          for(let i = 0; i < 6; i++){
            if(dle[i] === 0 && (tones[i] - onTone[j]) % 12 === 0){
              dle[i] = 1;
              score += 1;
              count++;
              break;
            }
          }
        }
        if(count === onTone.length){
          res['good'].push({'root':TONES[root][onFlat], 'name':name, 'no':1 + parseInt(chordNo),
                       'tone':tones, 'dle':dle, 'score':score});
          continue;
        }
      }
    }
  }
  res['best'].sort(function(a, b){
                     if(a['score'] > b['score']) return -1;
                     if(a['score'] < b['score']) return 1;
                     if(a['root'] < b['root']) return -1;
                     if(a['root'] > b['root']) return 1;
                     if(a['name'] < b['name']) return -1;
                     if(a['name'] > b['name']) return 1;
                     if(a['no'] < b['no']) return -1;
                     if(a['no'] > b['no']) return 1;
                     return 0
  });
  res['good'].sort(function(a, b){
                     if(a['score'] > b['score']) return -1;
                     if(a['score'] < b['score']) return 1;
                     if(a['root'] < b['root']) return -1;
                     if(a['root'] > b['root']) return 1;
                     if(a['name'] < b['name']) return -1;
                     if(a['name'] > b['name']) return 1;
                     if(a['no'] < b['no']) return -1;
                     if(a['no'] > b['no']) return 1;
                     return 0
  });
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
  header_name.setAttribute('colspan', '2');
  header_name.className = 'chordname';
  header.appendChild(header_name);
  const header_no = document.createElement('th');
  header_no.innerText = '番号';
  header_no.className = 'chordno';
  header.appendChild(header_no);
  const header_tone = document.createElement('th');
  header_tone.setAttribute('colspan', '6');
  header_tone.innerText = '構成音';
  header_tone.className = 'chordtones';
  header.appendChild(header_tone);

  table.appendChild(header);

  // データ
  for(let i = 0; i < chord.length; i++){
    const c = chord[i]
    const row = document.createElement('tr');

    const row_root = document.createElement('td');
    row_root.className = 'chordroot';
    row_root.innerText = c['root'];
    row.appendChild(row_root);
    const row_name = document.createElement('td');
    row_name.className = 'chordname';
    row_name.innerText = CHORDNAMES[c['name']];
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

// リセットボタン
function resetTone(){
  for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].checked = false;
  }
  update();
}

update()
