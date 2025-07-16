document.addEventListener('DOMContentLoaded', async () => {
  // 1) Carga config.json
  const res = await fetch('/config.json');
  const cfg = await res.json();

  // 2) Rellena los campos
  document.getElementById('dhcpCheckbox').checked = cfg.dhcp===1;
  ['ip','subnet','gateway','mac'].forEach(k =>
    document.getElementById(k+'Input').value = cfg[k]
  );

  ['outA_proto','outB_proto'].forEach(id=>{
    ['ArtNet','sACN'].forEach(p=>{
      document.getElementById(id).add(new Option(p,p));
    });
    document.getElementById(id).value = cfg[id];
  });
  [25,30,35,40].forEach(fps=>{
    ['outA_fps','outB_fps'].forEach(id=>{
      document.getElementById(id).add(new Option(fps,fps));
      document.getElementById(id).value = cfg[id];
    });
  });
  ['outA_uni','outB_uni'].forEach(id=> {
    const inp = document.getElementById(id);
    inp.value = cfg[id];
    inp.dataset.prev = inp.value;
    inp.addEventListener('input', ()=>{
      const v = parseInt(inp.value);
      if (isNaN(v)||v<0||v>255) inp.value = inp.dataset.prev;
      else inp.dataset.prev = inp.value;
    });
  });

  document.getElementById('nameInput').value      = cfg.name;
  document.getElementById('timeoutSelect').value  = cfg.timeout;
  document.getElementById('onsourceSelect').value = cfg.onsourceloss;

  // 3) Toggle campos de red
  function toggleNet(){
    const dis = document.getElementById('dhcpCheckbox').checked;
    ['ipInput','subnetInput','gatewayInput']
      .forEach(id=> document.getElementById(id).disabled = dis);
  }
  toggleNet();
  document.getElementById('dhcpCheckbox')
          .addEventListener('change', toggleNet);

  // 4) Envío
  document.getElementById('configForm')
    .addEventListener('submit', async e => {
      e.preventDefault();
      await fetch('/save',{ method:'POST', body:new FormData(e.target) });
      // redirige a nueva IP:
      const newIp = cfg.dhcp===1
        ? (await (await fetch('/config.json')).json()).ip
        : document.getElementById('ipInput').value;
      location.href = 'http://'+newIp+'/';
    });
});
