import {site} from './data/site';
const paths={
 github:'M12 .8a11.2 11.2 0 0 0-3.54 21.82c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.74 2.33 3.3 1.65.1-.72.39-1.21.71-1.49-2.5-.28-5.13-1.25-5.13-5.54 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.22 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z',
 linkedin:'M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2.3 8h3.4v14H2.3V8Zm6 0h3.3v1.9h.1c.5-.9 1.6-2.2 3.8-2.2 4 0 4.8 2.6 4.8 6V22h-3.5v-7.3c0-1.8 0-4.1-2.5-4.1s-2.9 1.9-2.9 4V22H8.3V8Z',
 x:'M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.5 5.4 22H2.2l8.3-9.5L.8 2h6.5l4.5 6.9L18.9 2ZM17.6 20h1.8L6.2 4H4.3l13.3 16Z'
};
export function SocialRail(){return <nav className="social-rail" aria-label="Social profiles">
 {([['GitHub',site.github,paths.github],['LinkedIn',site.linkedin,paths.linkedin],['X','https://x.com/Ammar12274191',paths.x]] as const).map(([label,url,path])=><a key={label} href={url} aria-label={label} title={label} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path}/></svg></a>)}
 <a href={'mailto:'+site.email} aria-label="Email Ammar" title="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></a>
 </nav>}
