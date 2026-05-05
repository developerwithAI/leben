const ID_TO_SLUG: Record<string, string> = {
  'DE-BW': 'baden-wuerttemberg', 'DE-BY': 'bayern',     'DE-BE': 'berlin',
  'DE-BB': 'brandenburg',        'DE-HB': 'bremen',      'DE-HH': 'hamburg',
  'DE-HE': 'hessen',             'DE-MV': 'mecklenburg-vorpommern',
  'DE-NI': 'niedersachsen',      'DE-NW': 'nordrhein-westfalen',
  'DE-RP': 'rheinland-pfalz',    'DE-SL': 'saarland',    'DE-ST': 'sachsen-anhalt',
  'DE-SN': 'sachsen',            'DE-SH': 'schleswig-holstein', 'DE-TH': 'thueringen',
};

export function buildStatesHtml(
  isDark: boolean,
  wappenUris: Record<string, string>,
  geoJson: unknown,
): string {
  const bg     = isDark ? '#1c1c1e' : '#f0f2f5';
  const fill   = isDark ? '#60a5fa' : '#3b82f6';
  const border = isDark ? '#93c5fd' : '#1d4ed8';
  const shadow = isDark ? '#1c1c1e' : '#f0f2f5';

  return `<!DOCTYPE html><html><head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#map{width:100%;height:100%;overflow:hidden;background:${bg}}
    .leaflet-container{background:${bg}!important}
    .leaflet-control-attribution,.leaflet-control-zoom{display:none}
    .wp{background:transparent!important;border:none!important;box-shadow:none!important;pointer-events:none;opacity:0;transition:opacity 0.15s ease}
    .wp img{width:18px;height:24px;object-fit:contain;filter:drop-shadow(0 1px 3px ${shadow}) drop-shadow(0 1px 3px ${shadow})}
    .wp.ready{opacity:1}
  </style></head><body><div id="map"></div>
  <script>
    var idToSlug=${JSON.stringify(ID_TO_SLUG)};
    var wappenUris=${JSON.stringify(wappenUris)};
    var geo=${JSON.stringify(geoJson)};
    var map=L.map('map',{center:[51.3,10.45],zoom:5,zoomControl:false,attributionControl:false});
    map.getContainer().style.background='${bg}';
    var sel=null, layer=null;
    var def={fillColor:'${fill}',fillOpacity:0.15,color:'${border}',weight:1.5};
    var hov={fillColor:'${fill}',fillOpacity:0.42,color:'${border}',weight:2};
    var act={fillColor:'${fill}',fillOpacity:0.68,color:'${border}',weight:2.5};
    var markers=[];
    layer=L.geoJSON(geo,{
      style:def,
      onEachFeature:function(f,l){
        var id=f.properties.id, slug=idToSlug[id];
        var uri=wappenUris[slug]||'';
        if(uri){
          var m=L.marker(l.getBounds().getCenter(),{
            icon:L.divIcon({className:'wp',html:'<img src="'+uri+'">',iconSize:[18,24],iconAnchor:[9,12]}),
            interactive:false,zIndexOffset:1000
          }).addTo(map);
          markers.push(m);
        }
        l.on({
          mouseover:function(e){if(e.target!==sel)e.target.setStyle(hov);},
          mouseout:function(e){if(e.target!==sel)layer.resetStyle(e.target);},
          click:function(e){
            if(sel&&sel!==e.target)layer.resetStyle(sel);
            sel=e.target; e.target.setStyle(act);
            if(slug)window.ReactNativeWebView.postMessage(JSON.stringify({type:'landClick',slug:slug}));
          }
        });
      }
    }).addTo(map);
    map.fitBounds(layer.getBounds(),{padding:[12,12]});
    // Show all wappen simultaneously once every image is loaded
    (function(){
      var imgs=[];
      markers.forEach(function(m){
        var el=m.getElement();
        if(el){var img=el.querySelector('img');if(img)imgs.push(img);}
      });
      if(!imgs.length)return;
      var loaded=0;
      function onAllLoaded(){
        markers.forEach(function(m){
          var el=m.getElement();
          if(el)el.classList.add('ready');
        });
      }
      imgs.forEach(function(img){
        if(img.complete){if(++loaded===imgs.length)onAllLoaded();}
        else{
          img.onload=function(){if(++loaded===imgs.length)onAllLoaded();};
          img.onerror=function(){if(++loaded===imgs.length)onAllLoaded();};
        }
      });
    })();
  </script></body></html>`;
}
