const FeatureFlags = {
  improvedHeader: false,
  improvedScoring: false,
  improvedFrontPageFlags: false,
  improvedResultsTie: false,
};

Object.freeze(FeatureFlags);
if (!localStorage.getItem("features")) {
  localStorage.setItem("features", JSON.stringify(FeatureFlags));
}
