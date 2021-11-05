import { getAnalytics, logEvent } from "firebase/analytics";

(()=>{
  
  if(!localStorage.getItem("agreement")){
     localStorage.setItem("agreement",JSON.stringify({consent:false, marketing:true, nessecary:true}))
  
    
  }
})()

export const InitAnalytics = (app) => {
  return getAnalytics(app)

}
export const LogAnalyzer = (analytics, event) => {
  const {marketing, consent} = JSON.parse(localStorage.getItem("agreement"))
  if(marketing && consent){
    console.log("gucci");
    logEvent(analytics,event)
  }
}