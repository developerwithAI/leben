const COUNTRY_DE: Record<number, string> = {
  276: 'Deutschland',   208: 'Dänemark',      616: 'Polen',
  203: 'Tschechien',    40:  'Österreich',     756: 'Schweiz',
  250: 'Frankreich',    442: 'Luxemburg',      56:  'Belgien',
  528: 'Niederlande',   8:   'Albanien',        20:  'Andorra',
  100: 'Bulgarien',     191: 'Kroatien',       196: 'Zypern',
  233: 'Estland',       246: 'Finnland',       300: 'Griechenland',
  348: 'Ungarn',        352: 'Island',         372: 'Irland',
  380: 'Italien',       428: 'Lettland',       438: 'Liechtenstein',
  440: 'Litauen',       807: 'Nordmazedonien', 470: 'Malta',
  498: 'Moldau',        492: 'Monaco',         499: 'Montenegro',
  578: 'Norwegen',      620: 'Portugal',       642: 'Rumänien',
  674: 'San Marino',    688: 'Serbien',        703: 'Slowakei',
  705: 'Slowenien',     724: 'Spanien',        752: 'Schweden',
  804: 'Ukraine',       826: 'Großbritannien', 112: 'Weißrussland',
  643: 'Russland',      792: 'Türkei',         70:  'Bosnien',
  268: 'Georgien',
};

const NEIGHBOR_IDS = [276, 208, 616, 203, 40, 756, 250, 442, 56, 528];

const EUROPE_IDS = [
  276, 208, 616, 203, 40, 756, 250, 442, 56, 528,
  8, 20, 100, 191, 196, 233, 246, 300, 348, 352, 372, 380,
  428, 438, 440, 807, 470, 498, 492, 499, 578, 620, 642,
  674, 688, 703, 705, 724, 752, 804, 826, 792, 70,
  268,
];

const NEIGHBOR_COLORS = [
  '#ef4444','#f97316','#eab308','#22c55e',
  '#14b8a6','#a855f7','#ec4899','#3b82f6','#84cc16',
];

const LABEL_POS: Record<number, [number, number]> = {
  276:[51.2,10.4], 208:[56.0,9.5],  616:[52.0,19.5], 203:[49.8,15.5],
  40:[47.5,14.2],  756:[46.8,8.2],  250:[46.5,2.5],  442:[49.8,6.1],
  56:[50.5,4.5],   528:[52.3,5.3],  724:[40.0,-3.7], 620:[39.5,-8.0],
  826:[54.0,-2.5], 578:[62.0,10.0], 380:[42.5,12.5], 300:[39.5,22.0],
  804:[49.0,32.0], 642:[45.8,24.9], 100:[42.7,25.5],
  191:[45.1,15.2], 703:[48.7,19.5], 705:[46.1,14.9], 348:[47.2,19.4],
  372:[53.2,-8.0], 233:[58.6,25.0], 428:[56.9,24.6], 440:[55.9,23.9],
  246:[64.0,26.0], 752:[62.0,15.0], 688:[44.0,21.0],
  792:[39.0,35.0], 70:[44.2,17.5],  499:[42.8,19.4],
  807:[41.6,21.7], 8:[41.1,20.2],   196:[35.1,33.4], 470:[35.9,14.5],
  492:[43.7,7.4],  674:[43.9,12.5], 438:[47.1,9.5],  20:[42.5,1.6],
  268:[42.0,43.5],
};

const FLAGS: Record<number, string> = {
  276:'🇩🇪',208:'🇩🇰',616:'🇵🇱',203:'🇨🇿',40:'🇦🇹',756:'🇨🇭',
  250:'🇫🇷',442:'🇱🇺',56:'🇧🇪',528:'🇳🇱',8:'🇦🇱',20:'🇦🇩',
  100:'🇧🇬',191:'🇭🇷',196:'🇨🇾',233:'🇪🇪',246:'🇫🇮',300:'🇬🇷',
  348:'🇭🇺',352:'🇮🇸',372:'🇮🇪',380:'🇮🇹',428:'🇱🇻',438:'🇱🇮',
  440:'🇱🇹',807:'🇲🇰',470:'🇲🇹',498:'🇲🇩',492:'🇲🇨',499:'🇲🇪',
  578:'🇳🇴',620:'🇵🇹',642:'🇷🇴',674:'🇸🇲',688:'🇷🇸',703:'🇸🇰',
  705:'🇸🇮',724:'🇪🇸',752:'🇸🇪',804:'🇺🇦',826:'🇬🇧',792:'🇹🇷',
  70:'🇧🇦',268:'🇬🇪',
};

// Fixed flag size for countries with overseas territories (FR/NL etc.)
const FIXED_SIZE: Record<number, number> = {250:18,528:16,826:16,620:16,724:20,380:20,300:18,752:18,578:18,246:16};

// Crimea polygon — world-atlas omits it as disputed territory
const CRIMEA_COORDS = [
  [33.62,46.13],[33.08,46.04],[32.76,45.88],[32.49,45.35],
  [32.60,44.98],[32.74,44.77],[33.12,44.52],[33.40,44.38],
  [33.75,44.43],[34.17,44.47],[34.65,44.54],[35.10,44.52],
  [35.22,44.55],[35.70,44.68],[36.17,44.96],[36.43,45.12],
  [36.63,45.39],[36.50,45.69],[36.20,45.80],[35.87,45.87],
  [35.25,45.97],[34.75,46.10],[34.25,46.18],[33.90,46.20],
  [33.62,46.13],
];

export function buildWorldHtml(mode: 'neighbors' | 'europe', isDark: boolean): string {
  const bg       = isDark ? '#1c1c1e' : '#f0f2f5';
  const deColor  = isDark ? '#60a5fa' : '#2563eb';
  const euColor  = isDark ? '#475569' : '#94a3b8';
  const txtColor = isDark ? '#e2e8f0' : '#1e293b';
  const shadow   = isDark ? '#1c1c1e' : '#f0f2f5';
  const isN      = mode === 'neighbors';
  const ids      = isN ? NEIGHBOR_IDS : EUROPE_IDS;
  const center   = isN ? '[51.0, 8.0]' : '[52, 13]';
  const zoom     = isN ? 5 : 3;
  const lblSize  = isN ? 11 : 8;

  return `<!DOCTYPE html><html><head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#map{width:100%;height:100%;overflow:hidden;background:${bg}}
    .leaflet-container{background:${bg}!important}
    .leaflet-control-attribution,.leaflet-control-zoom{display:none}
    .cl{background:transparent!important;border:none!important;box-shadow:none!important;
        font-size:${lblSize}px;font-weight:800;color:${txtColor};
        text-shadow:0 0 3px ${shadow},0 0 3px ${shadow};
        pointer-events:none;text-align:center;white-space:nowrap}
    .fl{background:transparent!important;border:none!important;box-shadow:none!important;
        pointer-events:none;text-align:center;line-height:1;
        filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4))}
    #spin{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          color:#888;font-family:sans-serif;font-size:13px;z-index:999}
  </style></head><body>
  <div id="map"></div><div id="spin">Lädt Karte…</div>
  <script>
    var IDS=new Set(${JSON.stringify(ids)});
    var NAMES=${JSON.stringify(COUNTRY_DE)};
    var NCOLS=${JSON.stringify(NEIGHBOR_COLORS)};
    var IS_N=${isN};
    var LABEL_POS=${JSON.stringify(LABEL_POS)};
    var FLAGS=${JSON.stringify(FLAGS)};
    var FIXED_SIZE=${JSON.stringify(FIXED_SIZE)};
    var CRIMEA={type:'Feature',geometry:{type:'Polygon',coordinates:[${JSON.stringify(CRIMEA_COORDS)}]}};
    function flagSize(id,bounds){
      if(FIXED_SIZE[id]) return FIXED_SIZE[id];
      var a=(bounds.getNorth()-bounds.getSouth())*(bounds.getEast()-bounds.getWest());
      if(a>200) return 22; if(a>80) return 20; if(a>25) return 17;
      if(a>8)   return 14; if(a>2)  return 12; return 10;
    }
    var map=L.map('map',{center:${center},zoom:${zoom},zoomControl:false,attributionControl:false});
    map.getContainer().style.background='${bg}';

    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(function(r){return r.json();})
    ]).then(function(res){
      document.getElementById('spin').style.display='none';
      var world=res[0];
      var all=topojson.feature(world,world.objects.countries);
      var filtered={type:'FeatureCollection',features:all.features.filter(function(f){return IDS.has(parseInt(f.id));})};
      var colorIdx=0;
      var gl=L.geoJSON(filtered,{
        style:function(f){
          var id=parseInt(f.id);
          if(id===276) return{fillColor:'${deColor}',fillOpacity:0.70,color:'#fff',weight:IS_N?2:1.2};
          if(IS_N) return{fillColor:NCOLS[colorIdx++%NCOLS.length],fillOpacity:0.55,color:'#fff',weight:1.5};
          return{fillColor:'${euColor}',fillOpacity:0.40,color:'#fff',weight:0.8};
        },
        onEachFeature:function(f,l){
          var id=parseInt(f.id);
          var name=NAMES[id]||'';
          if(!name) return;
          var pos=LABEL_POS[id]||l.getBounds().getCenter();
          var flag=FLAGS[id]||'';
          var sz=flagSize(id,l.getBounds());

          if(flag){
            L.marker(pos,{
              icon:L.divIcon({
                className:'fl',
                html:'<span style="font-size:'+sz+'px;line-height:1">'+flag+'</span>',
                iconSize:[sz+4,sz+4],iconAnchor:[(sz+4)/2,(sz+4)/2]
              }),
              interactive:false,zIndexOffset:2000
            }).addTo(map);
          }

          if(IS_N){
            L.marker([pos[0]-(sz/2+5)*0.012,pos[1]],{
              icon:L.divIcon({className:'cl',html:name,iconSize:[90,12],iconAnchor:[45,6]}),
              interactive:false,zIndexOffset:1000
            }).addTo(map);
          }

          l.on('click',function(){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:'countryClick',name:(flag||'')+' '+name}));
          });
        }
      }).addTo(map);

      if(!IS_N && IDS.has(804)){
        L.geoJSON(CRIMEA,{style:{fillColor:'${euColor}',fillOpacity:0.40,color:'#fff',weight:0.8}}).addTo(map);
      }

      map.setView(${isN ? '[51.0, 8.0]' : '[52, 13]'}, ${isN ? 5 : 3});
    }).catch(function(){
      document.getElementById('spin').textContent='Keine Verbindung';
    });
  </script></body></html>`;
}
