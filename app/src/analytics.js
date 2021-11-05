import { getAnalytics, logEvent } from "firebase/analytics";

(() => {

  if (!localStorage.getItem("agreement")) {
    localStorage.setItem("agreement", JSON.stringify({ consent: false, statistic: true, necessary: true }))


  }
})()

export const InitAnalytics = (app) => {
  return getAnalytics(app)

}
export const LogAnalyzer = (analytics, event) => {
  const { statistic, consent } = JSON.parse(localStorage.getItem("agreement"))
  if (statistic && consent) {
    console.log("gucci");
    logEvent(analytics, event)
  }
}