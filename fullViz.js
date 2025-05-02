var dscc=function(){function e(e){return"object"==typeof e&&null!==e}function t(e){return Array.isArray(e)}function r(e){return"string"==typeof e}function n(e){return"number"==typeof e}function a(e){return"boolean"==typeof e}function i(e){return void 0!==e}function s(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var o={},u={};function c(){return window.google&&google.visualization&&google.visualization.data&&google.visualization.data.DataTable}function l(e){return c()?new google.visualization.data.DataTable(e):e}function f(e){var t=e.fields.map((function(e){return{name:e.name,label:e.label,dataType:e.dataType}}));return{fields:t,rows:e.rows}}return o.subscribeToData=function(e,t){u.callback=e,u.options=t||{},window.addEventListener("message",(function(t){var r=t.data;if(r&&"dscc-data"===r.type){var n=f(r.data);e(n)}})),window.parent.postMessage({type:"dscc-request-data"},"*")},o.getHeight=function(){return window.innerHeight},o.getWidth=function(){return window.innerWidth},o.objectTransform="object",o}();

function getColor(criticité) {
  if (!criticité) return '#ccc'; // gris par défaut
  if (criticité.includes('1')) return '#e74c3c'; // rouge
  if (criticité.includes('2') || criticité.includes('3')) return '#f39c12'; // orange
  return '#2ecc71'; // vert
}

function getCriticitéParJour(data) {
  const jours = {};
  data.forEach(row => {
    const dateStr = row.dimensions[0];
    const criticité = row.dimensions[1];
    const date = new Date(dateStr);
    const day = date.getDate();
    if (!jours[day] || criticité === '1') jours[day] = criticité;
    else if ((criticité === '2' || criticité === '3') && jours[day] !== '1') jours[day] = criticité;
  });
  return jours;
}

function drawCalendar(jours) {
  let container = document.getElementById('container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);
  }

  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(7, 30px)';
  container.style.gridGap = '4px';
  container.style.margin = '10px';

  // S layout corrigé
  const S_layout = [
    1,2,3,4,5,6,7,
    14,13,12,11,10,9,8,
    15,16,17,18,19,20,21,
    28,27,26,25,24,23,22,
    29,30,31
  ];

  S_layout.forEach(jour => {
    const couleur = getColor(jours[jour]);
    const caseJour = document.createElement('div');
    caseJour.style.width = '30px';
    caseJour.style.height = '30px';
    caseJour.style.background = couleur;
    caseJour.style.textAlign = 'center';
    caseJour.style.lineHeight = '30px';
    caseJour.style.borderRadius = '5px';
    caseJour.style.fontSize = '14px';
    caseJour.style.color = '#fff';
    caseJour.textContent = jour;
    container.appendChild(caseJour);
  });
}

function drawViz(dataResponse) {
  const data = dataResponse.tables.DEFAULT;
  const criticitéParJour = getCriticitéParJour(data);
  drawCalendar(criticitéParJour);
}

dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });