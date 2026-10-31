import {Chess} from 'chess.js';
const values={p:100,n:320,b:330,r:500,q:900,k:0};
function score(game:Chess){
 if(game.isCheckmate())return -100000;
 if(game.isDraw())return 0;
 let value=0;
 for(const row of game.board())for(const piece of row){if(!piece)continue;const file=piece.square.charCodeAt(0)-97,rank=Number(piece.square[1])-1;const central=7-(Math.abs(file-3.5)+Math.abs(rank-3.5));const amount=values[piece.type]+central*(piece.type==='n'?8:3);value+=piece.color==='w'?amount:-amount;}
 return game.turn()==='w'?value:-value;
}
function search(game:Chess,depth:number,alpha:number,beta:number,deadline:number):number{
 if(Date.now()>deadline)throw new Error('budget');
 if(depth===0||game.isGameOver())return score(game);
 const moves=game.moves({verbose:true}).sort((a,b)=>(values[b.captured??'k']-values[a.captured??'k']));
 for(const move of moves){game.move(move);let value:number;try{value=-search(game,depth-1,-beta,-alpha,deadline);}finally{game.undo();}if(value>=beta)return beta;alpha=Math.max(alpha,value);}
 return alpha;
}
export function chooseMove(fen:string,level:number){
 const game=new Chess(fen),moves=game.moves({verbose:true});if(!moves.length)return null;
 let best=moves[0];const deadline=Date.now()+(level===1?200:900);
 for(let depth=1;depth<=level;depth++){
  let candidate=best,high=-Infinity;
  try{for(const move of moves){game.move(move);let value:number;try{value=-search(game,depth-1,-Infinity,Infinity,deadline);}finally{game.undo();}if(value>high){high=value;candidate=move;}}best=candidate;}catch{break;}
 }
 return {from:best.from,to:best.to,promotion:best.promotion};
}
