import { getAnalytics, logEvent } from "firebase/analytics";
import LogRocket from 'logrocket';




(() => {
  
  if (!localStorage.getItem("agreement")) {
    localStorage.setItem("agreement", JSON.stringify({ consent: false, statistic: true, necessary: true, logrocket:true }))
    
    
  }
})()

export const InitAnalytics = (app) => {
  return getAnalytics(app)
  
}
export const LogAnalyzer = (analytics, event) => {
  const { statistic, consent } = JSON.parse(localStorage.getItem("agreement"))
  if (statistic && consent) {
    logEvent(analytics, event)
  }
}

export const InitLogRocket = () => {
  if(localStorage.getItem("agreement")){
    const {statistic} = JSON.parse(localStorage.getItem("agreement"))
    if(statistic){
      LogRocket.init('vgluue/git-gud');
    }
  } 
}
export const LogRocketIdentify = (e, o) => {
  if(localStorage.getItem("agreement")){
    const {statistic} = JSON.parse(localStorage.getItem("agreement"))
    if(statistic){
      LogRocket.identify(e, o);
    }
  } 
}