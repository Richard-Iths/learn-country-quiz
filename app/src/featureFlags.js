const FeatureFlags = {
  improvedHeader: false,
}

Object.freeze(FeatureFlags)
if(!localStorage.getItem("features")){
  localStorage.setItem("features", JSON.stringify(FeatureFlags))
}