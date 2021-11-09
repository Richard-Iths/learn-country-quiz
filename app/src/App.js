import React from "react";
import * as R from "ramda";
import { Link, Route, useLocation } from "wouter";
import { customAlphabet } from "nanoid";
import "./App.css";
import * as utils from "./utils";
import countries from "./countries";
import winning from "../assets/winning.png";
import dog from "../assets/dog.png";
import tie from "../assets/tie.jpg";
import "./featureFlags";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, getDatabase, set, update } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { InitAnalytics, LogAnalyzer, InitLogRocket, LogRocketIdentify } from "./analytics";




const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 5);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6szEWebdtzaEw0Y_R4gny8ON4f3rq9ww",
  authDomain: "tp-git-gud.firebaseapp.com",
  databaseURL:
    "https://tp-git-gud-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tp-git-gud",
  storageBucket: "tp-git-gud.appspot.com",
  messagingSenderId: "933537830173",
  appId: "1:933537830173:web:bc4d6ede149943ad3bbdf4",
  measurementId: "G-74ZQRLY5RP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;

let logrocket = null;

const db = getDatabase(app);

function App() {
  const { improvedHeader } = JSON.parse(localStorage.getItem("features"));
  const [featureProfile, setFeatureProfile] = React.useState(null);
  React.useEffect(() => {
    if (!localStorage.getItem("profile")) {
      const random = Math.floor(Math.random() * 10);
      if (random > 3) {
        localStorage.setItem("profile", JSON.stringify({ profile: "rest" }));
      } else {
        localStorage.setItem("profile", JSON.stringify({ profile: "pilot" }));
      }
    }
    setFeatureProfile(JSON.parse(localStorage.getItem("profile")));
  }, []);




  return (
    <CookieBanner>
      <div className="app">
        <div className="header">
          {improvedHeader.value ? "IMPROVED FLAG GAME" : "THE FLAG GAME"}
        </div>
        <div className="middle">
          <Route path="/">
            <StartPage />
          </Route>
          <Route path="/setup">
            <SetupPage />
          </Route>
          <Route path="/advance-setup">
            <AdvanceSetupPage />
          </Route>
          <Route path="/game/:gameId/:playerId">
            {(params) => {
              return (
                <GamePage gameId={params.gameId} playerId={params.playerId} />
              );
            }}
          </Route>
        </div>
        <div
          className={`footer ${featureProfile ? "footer-color-" + featureProfile.profile : ""
            }`}
        ></div>
      </div>
    </CookieBanner>
  );
}

const StartPage = () => {
  const [snapshot, loading, error] = useObject(ref(db, "nextGame"));
  const [location, setLocation] = useLocation();
  const { improvedFrontPageFlags } = JSON.parse(
    localStorage.getItem("features")
  );
  React.useEffect(() => {
    if(!loading){
    InitLogRocket()
     snapshot.val() && LogRocketIdentify("playing game", {gameId:snapshot.val()})
    }
  }, [snapshot])

  if (loading) return <div className="fw6 fs5">Loading...</div>;
  const nextGame = snapshot.val();



  const play = async () => {

    if (analytics) {
      LogAnalyzer(analytics, "clicked Play");
    }
    if (R.isNil(nextGame)) {
      const updates = {};
      const gameId = nanoid();
      updates["/nextGame"] = gameId;
      await update(ref(db), updates);
      setLocation(`/game/${gameId}/1`);
    } else {
      const game = utils.createGame();
      const updates = {};
      updates["/nextGame"] = null;
      updates[`/games/${nextGame}`] = game;
      await update(ref(db), updates);
      setLocation(`/game/${nextGame}/2`);

      await utils.sleep(3000);
      const updates2 = {};
      updates2[`/games/${nextGame}/status`] = "playing";
      await update(ref(db), updates2);
    }
  };
  return (
    <div className="page">
      <div className="st-flags">
        {improvedFrontPageFlags.value ? (
          R.compose(R.keys)(countries)
            .sort(() => 0.5 - Math.random())
            .splice(0, 60)
            .map((flag) => (
              <div className="f32" key={flag}>
                <div className={`flag ${flag.toLowerCase()}`}></div>
              </div>
            ))
        ) : (
          <>
            <div className="f32">
              <div className={`flag aze`}></div>
            </div>
            <div className="f32">
              <div className={`flag bih`}></div>
            </div>
            <div className="f32">
              <div className={`flag brb`}></div>
            </div>
            <div className="f32">
              <div className={`flag swe`}></div>
            </div>
            <div className="f32">
              <div className={`flag bgd`}></div>
            </div>
            <div className="f32">
              <div className={`flag bel`}></div>
            </div>
            <div className="f32">
              <div className={`flag bfa`}></div>
            </div>
            <div className="f32">
              <div className={`flag bgr`}></div>
            </div>
            <div className="f32">
              <div className={`flag bhr`}></div>
            </div>
            <div className="f32">
              <div className={`flag bdi`}></div>
            </div>
            <div className="f32">
              <div className={`flag ben`}></div>
            </div>
            <div className="f32">
              <div className={`flag bmu`}></div>
            </div>
            <div className="f32">
              <div className={`flag brn`}></div>
            </div>
            <div className="f32">
              <div className={`flag bol`}></div>
            </div>
            <div className="f32">
              <div className={`flag bra`}></div>
            </div>
            <div className="f32">
              <div className={`flag bhs`}></div>
            </div>
            <div className="f32">
              <div className={`flag btn`}></div>
            </div>
            <div className="f32">
              <div className={`flag fra`}></div>
            </div>
            <div className="f32">
              <div className={`flag bwa`}></div>
            </div>
          </>
        )}
      </div>
      <div className="button btn-square" onClick={play}>
        Play
      </div>
    </div>
  );
};

const GamePage = ({ gameId, playerId }) => {
  const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`));
  const [location, setLocation] = useLocation();

  if (loading) return <div className="fw6 fs5">Loading...</div>;
  const game = snapshot.val();

  const cancel = async () => {
    const updates = {};
    updates["/nextGame"] = null;
    await update(ref(db), updates);
    setLocation(`/`);
  };

  if (game && game.status === "playing")
    return <QuestionPage gameId={gameId} playerId={playerId} />;
  if (game && game.status === "finished")
    return <ResultsPage gameId={gameId} playerId={playerId} />;

  return (
    <div className="page">
      <div className="fw6 fs9 tac">
        {!game && "Waiting for opponent..."}
        {game && game.status === "starting" && "Starting game... Get READY!"}
      </div>
      {!game && (
        <div className="link" style={{ marginTop: "10rem" }} onClick={cancel}>
          Cancel
        </div>
      )}
      countries
    </div>
  );
};

const QuestionPage = ({ gameId, playerId }) => {
  const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`));
  //feature flag
  const { improvedScoring } = JSON.parse(localStorage.getItem("features"));
  if (loading) return <div className="fw6 fs5">Loading...</div>;
  const game = snapshot.val();

  const youKey = `player${playerId}`;
  const opponentKey = `player${parseInt(playerId) === 1 ? 2 : 1}`;

  const question = game.questions[`${game.currentQuestion}`];

  if (!question) return "Loading...";

  const answer = async (countryCode) => {
    if (question.fastest) return;

    const updates = {};
    updates[`/games/${gameId}/questions/${game.currentQuestion}/fastest`] = {
      player: playerId,
      answer: countryCode,
    };
    if (countryCode == question.correct) {
      updates[`/games/${gameId}/score/${youKey}`] = game.score[youKey] + 1;
    } else {
      if (improvedScoring) {
        updates[`/games/${gameId}/score/${youKey}`] = game.score[youKey] - 1;
      }
    }
    await update(ref(db), updates);

    if (game.currentQuestion < Object.values(game.questions).length) {
      await utils.sleep(3000);
      const updates2 = {};
      updates2[`/games/${gameId}/currentQuestion`] =
        parseInt(game.currentQuestion) + 1;
      await update(ref(db), updates2);
    } else {
      await utils.sleep(3000);
      const updates2 = {};
      updates2[`/games/${gameId}/status`] = "finished";
      await update(ref(db), updates2);
    }
  };

  return (
    <div className="page">
      <div className="f32">
        <div className={`flag ${question.correct}`}></div>
      </div>
      <div className="alternatives">
        {Object.entries(question.alternatives).map(([k, countryCode]) => {
          let correct = null;
          let youOrOpponent = false;
          if (question.fastest && question.fastest.answer == countryCode) {
            correct = question.fastest.answer === question.correct;
            if (question.fastest.player === playerId) {
              youOrOpponent = `YOU ${correct ? " +1" : ""}`;
            } else {
              youOrOpponent = `OPPONENT ${correct ? " +1" : ""}`;
            }
          }
          return (
            <div
              className={`button alt ${correct && "alt-green"} ${correct === false && "alt-red"
                }`}
              key={countryCode}
              title={countryCode}
              onClick={() => answer(countryCode)}
            >
              {countries[countryCode.toUpperCase()]}
              { }
              {youOrOpponent && (
                <div className="alt-label">{youOrOpponent}</div>
              )}
            </div>
          );
        })}
      </div>
      {question.fastest && (
        <div className="fs7 fw5 m9">Get ready for the next question...</div>
      )}
      {question.fastest && (
        <QuickResults
          you={game.score[youKey]}
          opponent={game.score[opponentKey]}
        />
      )}
    </div>
  );
};

const QuickResults = ({ you, opponent }) => {
  return (
    <div className="quick-results">
      YOU {you} - {opponent} OPPONENT
    </div>
  );
};

const ResultsPage = ({ gameId, playerId }) => {
  const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`));

  if (loading) return <div className="fw6 fs5">Loading...</div>;
  const game = snapshot.val();

  const youKey = `player${playerId}`;
  const opponentKey = `player${parseInt(playerId) === 1 ? 2 : 1}`;

  const youWon = game.score[youKey] > game.score[opponentKey];
  const youtie = game.score[youKey] == game.score[opponentKey];
  const { improvedResultsTie } = JSON.parse(localStorage.getItem("features"));

  return (
    <div className="page">
      {youWon && (
        <Won you={game.score[youKey]} opponent={game.score[opponentKey]} />
      )}
      {!youWon && !improvedResultsTie.value && (
        <Lost you={game.score[youKey]} opponent={game.score[opponentKey]} />
      )}
      {youtie && improvedResultsTie.value && (
        <Tie you={game.score[youKey]} opponent={game.score[opponentKey]} />
      )}
      <Link href="/" className="re-home link">
        Home
      </Link>
    </div>
  );
};

const Won = ({ you, opponent }) => {
  return (
    <div className="results">
      <img src={winning} style={{ width: "80%" }} />
      <div className="re-text">Congratulations!!</div>
      <QuickResults you={you} opponent={opponent} />
    </div>
  );
};

const Lost = ({ you, opponent }) => {
  return (
    <div className="results">
      <img src={dog} style={{ width: "80%" }} />
      <div className="re-text">Better luck next time...</div>
      <QuickResults you={you} opponent={opponent} />
    </div>
  );
};

const Tie = ({ you, opponent }) => {
  return (
    <div className="results">
      <img src={tie} style={{ width: "100%" }} />
      <div className="re-text">Git gud...</div>
      <QuickResults you={you} opponent={opponent} />
    </div>
  );
};

const CookieExplanation = ({ onClickHandler }) => {
  return (
    <div onClick={onClickHandler} className="cookie-explanation">
      <div className="cookie-wrapper">
        <div className="necessary"></div>
        <div className="statistic">
          <ul>
            <li>
              <div>
                <h3>Google analytics</h3>
                <p>
                  Google Analytics is a web analytics service that provides
                  statistics and basic analytical tools for search engine
                  optimization (SEO) and marketing purposes....Google Analytics
                  is used to track website performance and collect visitor
                  insights.
                </p>
                <p>
                  <ul>
                    <li>
                      <p>_ga 2 years Used to distinguish users.</p>
                    </li>
                    <li>
                      <p>
                        ga {"<container-id>"} 2 years Used to persist session
                        state.
                      </p>
                    </li>
                  </ul>
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>LogRocket</h3>
                <p>
                  Google Analytics is a web analytics service that provides
                  statistics and basic analytical tools for search engine
                  optimization (SEO) and marketing purposes....Google Analytics
                  is used to track website performance and collect visitor
                  insights.
                </p>
                <p>
                  <ul>
                    <li>
                      <p>_ga 2 years Used to distinguish users.</p>
                    </li>
                    <li>
                      <p>
                        ga {"<container-id>"} 2 years Used to persist session
                        state.
                      </p>
                    </li>
                  </ul>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const CookieBanner = ({ children }) => {
  const [showCookieChoice, setShowCookieChoice] = React.useState(false);

  const toggleShowCookieChoice = () => {
    setShowCookieChoice(!showCookieChoice);
  };

  const [agreement, setAgreement] = React.useState(
    JSON.parse(localStorage.getItem("agreement"))
  );

  const cookieChoice = (e) => {
    const target = e.target;
    setAgreement({ ...agreement, [target.id]: !agreement[target.id] });
  };

  const bannerOkay = () => {
    setAgreement({ ...agreement, consent: true });
  };

  React.useEffect(() => {
    localStorage.setItem("agreement", JSON.stringify(agreement));
    if(agreement.statistic && agreement.consent){
      analytics = InitAnalytics(app);
    }  
  }, [agreement]);



  return (
    <>
      {children}
      {!agreement.consent && (
        <div className="CookieBanner">
          <div className="CookieWrapper">
            <p>
              {" "}
              We are stealing your data, would you like us to continue?
              <span
                onClick={toggleShowCookieChoice}
                className="cookie-banner-link"
              >
                Read more...
              </span>
            </p>

            <div className="CookieCheckbox">
              <div className="CookieCheckbox_Cookie">
                <h6>NECESSARY</h6>
                <span className="CookieLocked">
                  {agreement.necessary && "✔"}
                </span>
              </div>
              <div className="CookieCheckbox_Cookie">
                <h6>STATISTIC</h6>
                <span
                  id="statistic"
                  className="CookieChoice"
                  onClick={cookieChoice}
                >
                  {agreement.statistic && "✔"}
                </span>
              </div>
            </div>
            <div className="CookieCTA">
              <button className="CookieButton" onClick={bannerOkay}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
      {showCookieChoice && (
        <CookieExplanation onClickHandler={toggleShowCookieChoice} />
      )}
    </>
  );
};

const SetupPage = () => {
  const [storage, setStorage] = React.useState(
    JSON.parse(localStorage.getItem("features"))
  );
  const changeLsValue = (e) => {
    const input = e.target;
    const [key] = input.id.split("-");
    setStorage({
      ...storage,
      [key]: {
        value: !storage[key].value,
        description: storage[key].description,
      },
    });
  };

  React.useEffect(() => {
    localStorage.setItem("features", JSON.stringify(storage));
  }, [storage]);
  return (
    <section className="setup">
      {Object.entries(storage).map((item) => {
        const [key, value] = item;
        return (
          <div className="setup__storage-key" key={key}>
            <h3>{value.description}</h3>
            <div className="cta-wrapper">
              <span
                id={`${key}-true`}
                onClick={changeLsValue}
                className={`setup__storage-key--${value.value && "toggleOn"}`}
              >
                ON
              </span>
              <span
                id={`${key}-false`}
                onClick={changeLsValue}
                className={`setup__storage-key--${!value.value && "toggleOn"}`}
              >
                OFF
              </span>
            </div>
          </div>
        );
      })}
      <Link href="/">Go to app</Link>
    </section>
  );
};

const AdvanceSetupPage = () => {
  const [snapshot, loading, error] = useObject(ref(db, "feature_flags"));
  const [featureFlagsHeaders, setFeatureFlagsHeaders] = React.useState([]);
  const [featureFlagsBodies, setFeatureFlagsBodies] = React.useState([]);
  React.useEffect(() => {
    if (!loading) {
      const snapshotValues = Object.entries(snapshot.val());
      setFeatureFlagsHeaders(Object.values(snapshot.val().labels));
      setFeatureFlagsBodies(
        snapshotValues.filter((snap) => snap[0] !== "labels" && snap[0] !== "backgrounds")
      );
    }
  }, [snapshot]);
  const toggleFeature = async (e) => {
    const target = e.target;
    const snap = snapshot.val();
    const [key, value] = target.id.split("-");
    const data = {
      ...snap,
      [key]: {
        ...snap[key],
        [value]: !snap[key][value],
      },
    };
    const updates = {};
    updates[`/feature_flags/`] = {
      ...data,
    };
    await update(ref(db), updates);
  };

  const changeFeatureBackground = async (e) => {
    const target = e.target;
    const [key, value] = target.id.split("-")
    const snap = snapshot.val()
    const data = {
      ...snap, [key]: {
        ...snap[key],
        background: value
      }
    }
    const updates = {};
    updates[`/feature_flags/`] = {
      ...data,
    };
    await update(ref(db), updates);
  }


  return (
    <section className="advance-feature-flags">
      <table className="advance-feature-flags__table">
        <thead>
          <tr>
            <th></th>
            {featureFlagsHeaders &&
              featureFlagsHeaders.map((item) => (
                <th key={item}>{item.replace("_", " ")}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {featureFlagsBodies &&
            featureFlagsBodies.map((item) => {
              const [key, values] = item;

              return (
                <tr key={key}>
                  <td>{key}</td>
                  {Object.entries(values).map((item, index) => {
                    const [k, value] = item;
                    return value ? (
                      <td
                        onClick={(e) => {
                          if (k !== "background") {
                            toggleFeature(e);
                          }
                        }}
                        key={index}
                        id={`${key}-${k}`}
                        className={`${k !== "background" && "table-on"} ${k !== "background"
                          ? "table-clickable"
                          : ""
                          }`}
                      >
                        {k === "background" ? (<div className="feature__background-wrapper">
                          {snapshot.val().backgrounds.map(item => {
                            return (<div key={`${key}-${k}-${item}`} onClick={changeFeatureBackground} id={`${key}-${item}`} className={`feature__background feature--background-${item}
                            ${value === item ? "feature--current-active" : "feature--current-inactive"}`}></div>)
                          })
                          }</div>) : "On"}
                      </td>
                    ) : (
                      <td
                        key={index}
                        id={`${key}-${k}`}
                        onClick={(e) => {
                          if (
                            key === "alpha" ||
                            (key === "beta" && toggleFeature)
                          ) {
                            toggleFeature(e);
                          }
                        }}
                        className={`table-off ${key === "alpha" || key === "beta"
                          ? "table-clickable"
                          : ""
                          }`}
                      >
                        Off
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
};

export default App;
