import {execFileSync} from 'node:child_process';
import {mkdtemp,cp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,basename} from 'node:path';
const remote='https://github.com/AmmarYasser455/AmmarYasser455.github.io.git';
const target=await mkdtemp(join(tmpdir(),'ammar-pages-'));
const git=(args)=>execFileSync('git',args,{cwd:target,stdio:'inherit'});
git(['clone','--single-branch','--branch','gh-pages',remote,'.']);
git(['config','user.name','Ammar Yasser']);
git(['config','user.email','186931310+AmmarYasser455@users.noreply.github.com']);
git(['rm','-r','--ignore-unmatch','.']);
await cp('dist',target,{recursive:true,filter:source=>basename(source)!=='.git'});
await writeFile(join(target,'.nojekyll'),'');
git(['add','.']);
const changed=execFileSync('git',['status','--porcelain'],{cwd:target,encoding:'utf8'});
if(changed.trim()){git(['commit','-m','Publish portfolio update']);git(['push','origin','gh-pages']);}
console.log('Published build submitted. Check https://ammaryasser455.github.io/');
