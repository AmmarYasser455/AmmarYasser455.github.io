export default function ExperienceContours(){
 return <svg className="experience-contours" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
  {[0,1,2].map(i=><path key={i} transform={`translate(${i*8} ${i*7}) scale(${1-i*.027} ${1-i*.035})`} d="M48 12C142 4 177 19 255 13S420 3 529 12Q582 16 585 59C589 106 578 128 587 190S591 291 583 344Q579 382 531 387C420 397 348 380 267 387S123 394 59 385Q17 379 15 341C8 268 21 237 14 180S5 94 15 52Q20 18 48 12Z"/>)}
 </svg>;
}
