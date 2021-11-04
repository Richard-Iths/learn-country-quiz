import { getAnalytics, logEvent } from "firebase/analytics";

(()=>{
  
  if(!localStorage.getItem("agreement")){
     localStorage.setItem("agreement",JSON.stringify(true))
  
    
  }
})()

export const InitAnalytics = (app) => {
  return getAnalytics(app)

}
export const LogAnalyzer = (analytics, event) => {
  const {agreement} = JSON.parse(localStorage.getItem("agreement"))
  if(agreement){
    logEvent(analytics,event)
  }
}