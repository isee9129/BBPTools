const LINK = [['./pianochord.html', 'ピアノコード検索'], ['./pianochord-plus.html', 'ピアノコード検索(詳細)'], ['./guitarchord.html', 'ギターコード検索']]

const footer = document.getElementById('footer');
const hrline = document.createElement('hr');
footer.appendChild(hrline);
const links = document.createElement('div');
links.id = 'links'
for(let link of LINK){
  const pElm = document.createElement('p');
  const aElm = document.createElement('a');
  aElm.href = link[0];
  aElm.innerHTML = link[1];
  pElm.appendChild(aElm);
  links.appendChild(pElm);
}
footer.appendChild(links)
