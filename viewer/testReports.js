// Compatibility / "tested with" reports: users record that they tried an app
// against a particular Solid server, with an optional version. Stored locally
// in localStorage (per record subject). A relative time is shown so readers
// know how fresh the report is.

const KEY = 'catalog.testReports.v1';

// Common Solid servers to pick from; "Other" lets the user type a custom one.
export const SOLID_SERVERS = [
  { value: 'Community Solid Server (CSS)', label: 'Community Solid Server (CSS)' },
  { value: 'Node Solid Server (NSS)',      label: 'Node Solid Server (NSS)' },
  { value: 'Enterprise Solid Server (ESS)',label: 'Enterprise Solid Server (ESS)' },
  { value: 'solidcommunity.net',           label: 'solidcommunity.net' },
  { value: 'solidweb.org',                 label: 'solidweb.org' },
  { value: 'solidweb.me',                  label: 'solidweb.me' },
  { value: 'datapod.igrant.io',            label: 'datapod.igrant.io' },
  { value: 'teamid.live',                  label: 'teamid.live' },
  { value: 'Other',                        label: 'Other (enter below)…' },
];

function load(){
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function save(list){
  localStorage.setItem(KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('catalog-testreports-changed', { detail: { count: list.length } }));
}

export function listTestReports(subject){
  return load().filter(r => r.subject === subject).sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
}

export function addTestReport({ subject, server, serverUrl, version, webId }){
  const list = load();
  const id = 'test-' + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
  const entry = {
    id,
    subject: subject || '',
    server: (server || '').trim(),
    serverUrl: (serverUrl || '').trim(),
    version: (version || '').trim(),
    webId: webId || '',
    createdAt: Date.now(),
  };
  list.push(entry);
  save(list);
  return entry;
}

export function removeTestReport(id){
  save(load().filter(r => r.id !== id));
}

/** Human-readable relative time, e.g. "3 days ago", "just now". */
export function relativeTime(ts){
  const diff = Date.now() - ts;
  if(!isFinite(diff)) return '';
  const sec = Math.round(diff / 1000);
  if(sec < 45) return 'just now';
  const min = Math.round(sec / 60);
  if(min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.round(min / 60);
  if(hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.round(hr / 24);
  if(day < 30) return `${day} day${day === 1 ? '' : 's'} ago`;
  const mon = Math.round(day / 30);
  if(mon < 12) return `${mon} month${mon === 1 ? '' : 's'} ago`;
  const yr = Math.round(mon / 12);
  return `${yr} year${yr === 1 ? '' : 's'} ago`;
}
