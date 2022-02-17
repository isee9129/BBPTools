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
             {name:"m7b5(3音)",  tones:[3, 6, 10    ]},
             {name:"m7b5",       tones:[0, 3,  6, 10]},
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
let okTone = [true,true,true,true,true,true,true,true,true,true,true,true];
let onFlat = 0; // 表記を♯にするか♭にするか 1なら♭

// onlist: どの音を含みたいか boolean型の12個の配列
// 返り値: [ok:完全一致するコードリスト, near:部分一致するコードリスト]
function search(onlist){
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
      let fitcount = 0; // 一致した音の数
      let nearcount = 0; // OK音だった数
      let ngcount = 0; // NG音だった数
      for(let idx = 0; idx < chtone.length; idx++){
        const tone = (chtone[idx] + root) % 12;
        chtonename.push(TONES[tone][onFlat]);
        if(onlist[tone]){
          fitcount++;
        }else if (okTone[tone]) {
          nearcount++;
        }else{
          ngcount++;
        }
      }
      if(ngcount === 0 && (nearcount === 0 || fitcount === tonecount)){
        if(nearcount !== 0 || fitcount !== tonecount){
          nearlist.push({name:chname, tones:chtonename});
        }else{
          oklist.push({name:chname, tones:chtonename})
        }
      }
    }
  }
  return {ok:oklist, near:nearlist};
}

function chord2Html(chord, isok){
  let chordHtml = '';
  if(isok){
    chordHtml = `<strong>${chord.name}</strong>：`;
  }else{
    chordHtml = `${chord.name}：`;
  }
  for(let idx = 0; idx < chord.tones.length; idx++){
    if(idx !== 0){
      chordHtml += '・';
    }
    chordHtml += chord.tones[idx];
  }
  return chordHtml;
}

function update(){
  let inputTone = [];
  for(let cb of checkboxes){
    inputTone.push(cb.checked);
  }
  const result = search(inputTone);

  let resultHtml = '';
  for(let idx = 0; idx < result.ok.length; idx++){
    resultHtml += '<li>' + chord2Html(result.ok[idx], true) + '</li>';
  }
  const resultElm = document.getElementById('result');
  resultElm.innerHTML = resultHtml;

  let nearHtml = '';
  for(let idx = 0; idx < result.near.length; idx++){
    nearHtml += '<li>' + chord2Html(result.near[idx], false) + '</li>';
  }
  const nearElm = document.getElementById('nearresult');
  nearElm.innerHTML = nearHtml;
}

let checkboxes = [];
const ids = ["onKeyC","onKeyDb","onKeyD","onKeyEb","onKeyE","onKeyF","onKeyGb","onKeyG","onKeyAb","onKeyA","onKeyBb","onKeyB"];
for(let i of ids){
  const cb = document.getElementById(i);
  checkboxes.push(cb);
}

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
  update()
});
