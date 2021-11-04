const FeatureFlags = {
  improvedHeader: {
    value: false,
    description: "Improved Header",
  },
  improvedScoring: {
    value: false,
    description: "Minus score when guessed wrong",
  },
  improvedFrontPageFlags: {
    value: false,
    description: "More flags and random on app start page",
  },
  improvedResultsTie: {
    value: false,
    description: "Tie Screen",
  },
};

Object.freeze(FeatureFlags);
if (localStorage.getItem("features")) {
  const currentLs = JSON.parse(localStorage.getItem("features"));
  localStorage.setItem(
    "features",
    JSON.stringify(Object.assign({}, { ...FeatureFlags, ...currentLs }))
  );
} else {
  localStorage.setItem("features", JSON.stringify(FeatureFlags));
}
