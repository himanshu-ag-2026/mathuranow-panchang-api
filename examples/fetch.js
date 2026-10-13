// Works in a browser and in Node 18+ (global fetch). Data licence: CC BY-NC 4.0, credit required.
const BASE = 'https://mathuranow.in/api/v1/';

async function getToday(widget, lang) {
  const res = await fetch(BASE + widget + '/today.' + lang + '.json');
  if (!res.ok) { throw new Error('HTTP ' + res.status); }
  return res.json();
}

(async () => {
  const p = await getToday('panchang', 'en');
  if (p.status !== 'published') {
    console.log('Panchang for', p.date, 'is not published yet (pending).');
  } else {
    console.log(p.data.fields.tithi, '|', p.data.fields.sunrise, '-', p.data.fields.sunset);
    console.log('Credit:', p.attribution_html);
  }

  const r = await getToday('rashifal', 'hi');
  if (r.status === 'published') {
    for (const sign of r.data.signs) { console.log(sign.name + ': ' + sign.text); }
    console.log(r.note); // show this disclosure with the Rashifal
    console.log('Credit:', r.attribution_html);
  }
})().catch((e) => console.error('Could not load the data:', e.message));
