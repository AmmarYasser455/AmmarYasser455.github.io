import {chooseMove} from './chessEngine';
self.onmessage=({data}:{data:{fen:string;level:number}})=>{
 try{self.postMessage({move:chooseMove(data.fen,data.level)});}catch{self.postMessage({error:'Unable to calculate a move.'});}
};
