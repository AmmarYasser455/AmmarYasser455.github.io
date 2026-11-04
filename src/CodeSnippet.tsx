import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { CodeLine, Project } from './data/projects';
import './code-snippet.css';

// Minimal highlighter: strings, comments, flags, keywords, numbers and call names.
const TOKENS = /("[^"]*"|'[^']*')|(#.*$)|(--[\w-]+)|\b(import|from|as)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g;
const CLASSES = ['str', 'com', 'flag', 'kw', 'num', 'fn'];
function highlight(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKENS)) {
    const at = match.index ?? 0;
    if (at > last) nodes.push(text.slice(last, at));
    const group = match.slice(1).findIndex(Boolean);
    nodes.push(<span key={at} className={'tk-' + CLASSES[group]}>{match[0]}</span>);
    last = at + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
function renderLine(line: CodeLine): ReactNode {
  if (line.kind === 'comment') return <span className="tk-com">{line.text}</span>;
  if (line.kind === 'out') return line.text;
  if (line.kind === 'cmd') { const [head, ...rest] = line.text.split(' '); return <><span className="tk-cmd">{head}</span>{rest.length ? ' ' : ''}{highlight(rest.join(' '))}</>; }
  return highlight(line.text);
}
const prefix = (line: CodeLine, lang: string, i: number) => line.kind === 'out' ? '→' : line.kind === 'cmd' ? '$' : lang === 'python' ? String(i + 1) : ' ';

// Typed lines take ~26ms per character; output lines fade in after the command finishes.
function timeline(lines: CodeLine[]) {
  let t = .25;
  return lines.map(line => {
    const delay = t;
    const duration = line.kind === 'out' ? .25 : Math.max(.2, line.text.length * .026);
    t += duration + (line.kind === 'out' ? .08 : .12);
    return { delay, duration, end: t };
  });
}

export default function CodeSnippet({ project, number, typing = true, copyable = false, compact = false }: { project: Project; number?: number; typing?: boolean; copyable?: boolean; compact?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lines, lang, file } = project.snippet;
  const times = timeline(lines);
  const copyText = lines.filter(l => l.kind !== 'out' && l.kind !== 'comment').map(l => l.text).join('\n');
  const hasPrompt = lines.some(l => l.kind === 'cmd');
  useEffect(() => {
    if (!typing) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: .35 });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, [typing]);
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(timer); }, [copied]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(copyText); setCopied(true); } catch { setCopied(false); }
  };
  return <div ref={host} className={'snippet' + (typing ? ' typing' : '') + (visible ? ' in-view' : '') + (compact ? ' compact' : '')} style={{ '--caret-delay': times[times.length - 1].end + 's' } as CSSProperties}>
    <div className="snippet-bar">
      <span className="snippet-repo">~/{project.id.length > 18 ? project.id.slice(0, 16) + '…' : project.id}</span>
      <span className="snippet-file">{file}</span>
      {copyable && copyText && <button type="button" className={'snippet-copy' + (copied ? ' copied' : '')} onClick={copy} aria-label={copied ? 'Code copied' : 'Copy code'}><span>Copy</span><span aria-hidden="true">Copied ✓</span></button>}
    </div>
    <pre aria-label={`${project.title} usage example`}><code>{lines.map((line, i) => <span key={i} className={'ln ln-' + (line.kind ?? 'code')} style={{ '--n': line.text.length, '--d': times[i].delay + 's', '--t': times[i].duration + 's' } as CSSProperties}>
      <span className="ln-prefix" aria-hidden="true">{prefix(line, lang, i)}</span><span className="ln-text">{renderLine(line)}</span>
    </span>)}{(hasPrompt || lang === 'python') && <span className="ln ln-caret" aria-hidden="true"><span className="ln-prefix">{hasPrompt ? '$' : ' '}</span><span className="snippet-caret"/></span>}</code></pre>
    {number !== undefined && <span className="snippet-num" aria-hidden="true">{String(number).padStart(2, '0')}</span>}
  </div>;
}
