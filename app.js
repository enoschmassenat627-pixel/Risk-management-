const $=id=>document.getElementById(id);
function money(n){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n)}
function calculate(){
  const capital=+$("capital").value||0, risk=+$("risk").value||0, payout=(+$("payout").value||0)/100;
  const target=+$("target").value||0, stop=+$("stop").value||0, trades=Math.max(0,+$("trades").value||0), max=Math.max(1,+$("maxTrades").value||1);
  const riskAmount=capital*risk/100;
  let amount=Math.max(1,riskAmount);
  if(payout>0 && target>0) amount=Math.min(amount,target/payout);
  if(stop>0 && trades<max) amount=Math.min(amount,stop/Math.max(1,max-trades));
  $("calcResult").textContent=money(amount);
  $("nextTrade").textContent=money(amount);
  $("stopLoss").textContent="-"+money(stop).replace("$","");
  $("targetOut").textContent=money(target);
  const progress=Math.min(100,trades/max*100);
  $("progressText").textContent=`${trades} / ${max}`;
  $("progressBar").style.width=progress+"%";
  $("calcExplain").textContent=`Risk pa trade: ${money(riskAmount)} · Payout: ${Math.round(payout*100)}% · Limit sesyon an respekte.`;
}
function recordResult(win){
  let w=+localStorage.cgWins||0,l=+localStorage.cgLosses||0;
  win?w++:l++; localStorage.cgWins=w;localStorage.cgLosses=l;renderHistory();
}
function resetHistory(){localStorage.removeItem("cgWins");localStorage.removeItem("cgLosses");renderHistory()}
function renderHistory(){
  const w=+localStorage.cgWins||0,l=+localStorage.cgLosses||0,total=w+l,rate=total?Math.round(w/total*100):0;
  $("wins").textContent=w;$("losses").textContent=l;$("histRate").textContent=rate+"%";$("winRateOut").textContent=rate+"%";
}
function showPanel(type){
  const data={
    connect:["Konekte","Nan vèsyon sa a, done risk yo rete sou aparèy ou. Ou ka ajoute login/backend pita."],
    plans:["Patnè","Ou ka mete plan gratis ak plan Pro isit la."],
    start:["Kòmanse gratis","Antre kapital ou, risk pa trade, payout, target ak stop-loss pou kalkile plan sesyon an."],
  };
  $("modalTitle").textContent=data[type][0];$("modalText").textContent=data[type][1];$("modal").classList.add("show");
}
function closePanel(){$("modal").classList.remove("show")}
$("priceBtn").onclick=()=>showPanel("plans");
["capital","risk","payout","target","stop","trades","maxTrades"].forEach(id=>$(id).addEventListener("input",calculate));
renderHistory();calculate();
