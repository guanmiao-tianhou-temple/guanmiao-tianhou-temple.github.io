const quiz=document.querySelector('#quiz');
const gallery=document.querySelector('#lamp-gallery');
const resultNote=document.querySelector('#result-note');
const result=document.querySelector('#result');
const options=document.querySelector('#lamps');
const money=new Intl.NumberFormat('zh-TW');
const affected={羊:'值太歲',牛:'正沖／刑太歲',龍:'偏沖',狗:'偏沖／刑破',鼠:'害太歲'};
const lamps=[
  ['太歲燈',500,'犯太歲時可參考。','basic','tai-sui'],
  ['媽祖燈',500,'向媽祖祈求平安順遂。','basic','peace family love travel'],
  ['文昌燈',300,'祈求學業、考試與進修順利。','basic','study'],
  ['光明燈',300,'祈求前途光明、事業順利。','basic','work peace travel fortune'],
  ['平安小斗燈',3680,'祈求平安吉祥、出入平安。','small','peace travel family'],
  ['發財小斗燈',3980,'祈求招財納福、生意順利。','small','fortune work'],
  ['媽祖斗燈',16800,'祈求平安順遂、事業順利。','large','peace travel work love'],
  ['註生娘娘斗燈',16800,'祈求添丁及護佑孩童。','large','child family'],
  ['福德正神斗燈',16800,'祈求生意興隆、安居樂業。','large','fortune work'],
  ['玄天上帝斗燈',16800,'祈求消災平安。','large','peace travel'],
  ['順天聖母斗燈',16800,'祈求母子平安。','large','child family'],
  ['燈花媽祖斗燈',16800,'祈求添丁與家運興旺。','large','child family'],
  ['文財神斗燈',16800,'祈求事業順利與財運。','large','fortune work'],
  ['提標媽祖斗燈',16800,'祈求出入平安。','large','travel peace'],
  ['蔡觀音斗燈',16800,'祈求心安順遂。','large','peace family'],
  ['寶興媽祖斗燈',16800,'祈求平安順遂。','large','peace travel'],
  ['太平媽斗燈',16800,'祈求闔家平安。','large','peace family travel'],
];
const lampArt = {
  '平安小斗燈':'peace-small',
  '發財小斗燈':'fortune-small',
  '媽祖斗燈':'mazu-large',
  '順天聖母斗燈':'shuntian-large',
  '文財神斗燈':'wealth-large',
  '蔡觀音斗燈':'cai-large',
  '福德正神斗燈':'fude-large',
  '註生娘娘斗燈':'zhusheng-large',
  '玄天上帝斗燈':'xuantian-large',
  '燈花媽祖斗燈':'denghua-large',
  '提標媽祖斗燈':'tibiao-large',
  '寶興媽祖斗燈':'baoxing-large',
  '太平媽斗燈':'taiping-large',
};
const placardColors = {'文昌燈':'study','光明燈':'bright'};

function makeLampCard([name,cost,description], eager = false) {
  const card = document.createElement('article');
  card.className = 'lamp-card';
  const namedArt = lampArt[name];
  if (namedArt) {
    const figure = document.createElement('figure');
    figure.className = 'lamp-art';
    const link = document.createElement('a');
    const image = document.createElement('img');
    image.src = '/assets/light-cards/'+namedArt+'.webp';
    image.alt = name+'祈福圖卡';
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    link.href = image.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label','放大'+image.alt);
    link.append(image);
    figure.append(link);
    card.append(figure);
  } else {
    const placard = document.createElement('div');
    placard.className = 'lamp-placard '+(placardColors[name] || '');
    placard.setAttribute('aria-hidden','true');
    const nameplate = document.createElement('strong');
    nameplate.textContent = name;
    placard.append(nameplate);
    card.append(placard);
  }

  const detail = document.createElement('div');
  detail.className = 'lamp-card-detail';
  const title = document.createElement('h3');
  title.textContent = name;
  const amount = document.createElement('p');
  amount.className = 'lamp-card-price';
  amount.textContent = money.format(cost)+' 元';
  const body = document.createElement('p');
  body.textContent = description;
  detail.append(title,amount,body);
  card.append(detail);
  return card;
}

gallery.append(...lamps.map(lamp=>makeLampCard(lamp)));

quiz.addEventListener('submit',event=>{
  event.preventDefault();
  const values=new FormData(quiz);
  const goals=new Set(values.getAll('goal'));
  const zodiac=values.get('zodiac');
  if (affected[zodiac]) goals.add('tai-sui');
  const style=values.get('style');
  const eligible=lamps.filter(lamp=>style==='all'||lamp[3]===style);
  const ranked=eligible.map(lamp=>({lamp,score:lamp[4].split(' ').filter(goal=>goals.has(goal)).length})).sort((a,b)=>b.score-a.score);
  const picks=goals.has('all') ? ranked : ranked.some(item=>item.score)
    ? ranked.filter(item=>item.score).slice(0,4) : ranked.filter(item=>item.lamp[0]!=='太歲燈').slice(0,3);
  resultNote.textContent=affected[zodiac]
    ? zodiac+'年生肖在丁未年為'+affected[zodiac]+'，可參考太歲燈（500 元）。'
    : '以下是為「'+values.get('person')+'」祈福可參考的燈種。';
  options.replaceChildren(...picks.map(({lamp})=>makeLampCard(lamp,true)));
  result.hidden=false;
  result.focus();
});
quiz.addEventListener('reset',()=>{result.hidden=true;options.replaceChildren();resultNote.textContent='';});
