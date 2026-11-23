const q = new URLSearchParams(location.search);
if (q.get('c')) { document.documentElement.classList.add('phone'); await import('./phone.js'); }
else await import('./showroom.js');
