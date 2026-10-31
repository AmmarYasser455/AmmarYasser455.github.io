import {useEffect,useRef,useState} from 'react';
import {Chess,type Square,type PieceSymbol} from 'chess.js';
import './chess.css';
const pieces:Record<string,string>={wk:'♚',wq:'♛',wr:'♜',wb:'♝',wn:'♞',wp:'♟',bk:'♚',bq:'♛',br:'♜',bb:'♝',bn:'♞',bp:'♟'};
const names:Record<string,string>={k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'};
export default function ChessPage(){
 const game=useRef(new Chess());const [fen,setFen]=useState(game.current.fen());const [selected,setSelected]=useState<Square|null>(null);const [flipped,setFlipped]=useState(false);const [level,setLevel]=useState(2);const [promotion,setPromotion]=useState<{from:Square;to:Square}|null>(null);const [error,setError]=useState('');
 const g=game.current;const thinking=g.turn()==='b'&&!g.isGameOver();
 const sync=()=>{setFen(g.fen());setSelected(null);setPromotion(null);setError('');};
 useEffect(()=>{
  if(game.current.turn()!=='b'||game.current.isGameOver())return;
  const worker=new Worker(new URL('./chess.worker.ts',import.meta.url),{type:'module'});
  const started=performance.now();
  const thinkingTime=1800+Math.random()*1400;
  let moveTimer:ReturnType<typeof setTimeout>|undefined;
  let cancelled=false;
  worker.onmessage=event=>{
   if(cancelled||game.current.fen()!==fen)return;
   const move=event.data.move;
   if(!move){setError('Computer could not move. Use Undo or New game.');return;}
   moveTimer=setTimeout(()=>{
    if(cancelled||game.current.fen()!==fen)return;
    try{game.current.move(move);setFen(game.current.fen());}
    catch{setError('Move could not be played. Use Undo or New game.');}
   },Math.max(0,thinkingTime-(performance.now()-started)));
  };
  worker.onerror=()=>setError('Computer could not start. Use Undo or New game.');
  worker.postMessage({fen,level});
  return()=>{cancelled=true;clearTimeout(moveTimer);worker.terminate();};
 },[fen,level]);
 function play(from:Square,to:Square,promote:PieceSymbol='q'){try{g.move({from,to,promotion:promote});sync();}catch{setSelected(null);}}
 function click(square:Square){
  if(thinking||g.isGameOver()||promotion)return;
  if(selected){const moves=g.moves({square:selected,verbose:true}).filter(move=>move.to===square);if(moves.length){if(moves.some(move=>move.promotion)){setPromotion({from:selected,to:square});return;}play(selected,square);return;}}
  setSelected(g.get(square)?.color==='w'?square:null);
 }
 const legal=new Set(selected?g.moves({square:selected,verbose:true}).map(m=>m.to):[]);
 const history=g.history({verbose:true}),last=history.at(-1);
 let status=thinking?'Computer is thinking…':'Your turn · White';
 if(g.isCheckmate())status=g.turn()==='w'?'Checkmate · Computer wins':'Checkmate · You win';else if(g.isStalemate())status='Draw · Stalemate';else if(g.isThreefoldRepetition())status='Draw · Repetition';else if(g.isInsufficientMaterial())status='Draw · Insufficient material';else if(g.isDraw())status='Draw';else if(g.isCheck())status+=' · Check';
 const files=flipped?'hgfedcba':'abcdefgh',ranks=flipped?[1,2,3,4,5,6,7,8]:[8,7,6,5,4,3,2,1];
 return <main className="chess-page"><a className="chess-back" href="#home">← Back to Home</a><div className="chess-heading"><div><p className="eyebrow">OFF THE MAP</p><h1>Play with me<span>.</span></h1></div><p>A little strategy between projects.</p></div><div className="chess-layout"><div className="chess-center"><div className="chess-player ammar-player"><span className="chess-portrait"><img src="/images/ammar-chess.jpg" alt="Ammar Yasser"/></span><div><strong>Ammar Yasser</strong><span>Rapid 1681</span></div></div><div className="chess-board" role="group" aria-label="Chess board. Select a white piece, then a highlighted destination.">{ranks.flatMap((rank,row)=>[...files].map((file,col)=>{const square=(file+rank) as Square,piece=g.get(square);return <button key={square} className={'chess-square '+((row+col)%2?'dark':'light')+(square===selected?' selected':'')+(legal.has(square)?' legal':'')+(last&&(last.from===square||last.to===square)?' last-move':'')} onClick={()=>click(square)} aria-label={`${square}${piece?`, ${piece.color==='w'?'white':'black'} ${names[piece.type]}`:', empty'}${legal.has(square)?', legal destination':''}`} aria-pressed={square===selected}>{col===0&&<span className="square-coordinate" aria-hidden="true">{rank}</span>}{row===7&&<span className="file-coordinate" aria-hidden="true">{file}</span>}{piece&&<span className={'chess-piece '+piece.color} aria-hidden="true">{pieces[piece.color+piece.type]}</span>}{!piece&&legal.has(square)&&<i aria-hidden="true"/>}</button>;}))}</div><div className="chess-player">You <span>White</span></div>{promotion&&<div className="promotion" role="dialog" aria-label="Choose promotion piece"><p>Promote your pawn to:</p>{(['q','r','b','n'] as PieceSymbol[]).map(p=><button key={p} onClick={()=>play(promotion.from,promotion.to,p)}>{names[p]}</button>)}</div>}</div><aside className="chess-controls"><p className="chess-status" role="status">{error||status}</p><div className="chess-actions"><button onClick={()=>{g.reset();sync();}}>New game</button><button disabled={!history.length} onClick={()=>{g.undo();if(g.turn()==='b')g.undo();sync();}}>Undo turn</button><button onClick={()=>setFlipped(!flipped)}>Flip board</button></div><label>Difficulty<select value={level} onChange={e=>setLevel(Number(e.target.value))}><option value={1}>Casual</option><option value={2}>Balanced</option><option value={3}>Challenging</option></select></label><h2>Moves</h2><ol className="chess-history">{Array.from({length:Math.ceil(history.length/2)},(_,i)=><li key={i}><span>{history[i*2]?.san}</span><span>{history[i*2+1]?.san??'…'}</span></li>)}</ol><p className="chess-instructions">Select a white piece, then a highlighted square. Castling, en passant, promotion and draws follow standard chess rules.</p></aside></div></main>;
}
