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
import { ref, getDatabase, set, update, serverTimestamp } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import {
  InitAnalytics,
  LogAnalyzer,
  InitLogRocket,
  LogRocketIdentify,
} from "./analytics";




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

const db = getDatabase(app);



function App() {
  const { improvedHeader } = JSON.parse(localStorage.getItem("features"));
  const [featureProfile, setFeatureProfile] = React.useState(null);
  const [snapshot, loading, error] = useObject(ref(db, "feature_flags"));

  React.useEffect(() => {
    if (!loading) {
      const { profile } = JSON.parse(localStorage.getItem("profile"));
      const snap = snapshot.val();
      setFeatureProfile(snap[profile]);
    }
  }, [snapshot]);

  /* Demo-a-2 */

  React.useEffect(() => {
    if (!localStorage.getItem("profile")) {
      const random = Math.floor(Math.random() * 10);
      if (random > 3) {
        localStorage.setItem("profile", JSON.stringify({ profile: "rest" }));
      } else {
        localStorage.setItem("profile", JSON.stringify({ profile: "pilots" }));
      }
    }
  }, []);

  return (
    <CookieBanner>
      <div className="app">
        <div className="header">
          {improvedHeader.value ? "IMPROVED FLAG GAME" : "THE FLAG GAME"}
        </div>
        <div className="middle">
          <Route path="/">
            <StartPage {...featureProfile} />
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
                <GamePage
                  featureProfile={featureProfile}
                  gameId={params.gameId}
                  playerId={params.playerId}
                />
              );
            }}
          </Route>
        </div>
        <div
          className={`footer ${featureProfile ? "feature--background-" + featureProfile.background : ""
            }`}
        ></div>
        <FinalCountdown />
      </div>
    </CookieBanner>
  );
}

const StartPage = ({ latest_game }) => {
  const [snapshot, loading, error] = useObject(ref(db, "nextGame"));
  const [location, setLocation] = useLocation();
  const { improvedFrontPageFlags } = JSON.parse(
    localStorage.getItem("features")
  );
  React.useEffect(() => {
    if (!loading) {
      InitLogRocket();
      snapshot.val() &&
        LogRocketIdentify("playing game", { gameId: snapshot.val() });
    }
  }, [snapshot]);

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
      // SetCountDown(snapshot_countdown.val())
      await utils.sleep(3000);
      const updates2 = {};
      updates2[`/games/${nextGame}/status`] = "playing";
      await update(ref(db), updates2);
    }
  };

  /*
  
  demo-a
  
  */
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
      {latest_game && <LatestScore />}
    </div>
  );
};

const LatestScore = () => {
  const [snapshot, loading, error] = useObject(ref(db, `games`));
  const [latestGames, setLatestGames] = React.useState([]);

  React.useEffect(() => {
    if (!loading) {
      const finishedGames = Object.values(snapshot.val())
        .filter((game) => game.status === "finished")
        .slice(0, 3);
      setLatestGames([...finishedGames]);
    }
  }, [snapshot]);

  return (
    <div className="scoreboard__wrapper">
      {" "}
      <h2>Latest games: 🍆</h2>
      {latestGames.map((game, index) => (
        <div className="scoreboard" key={index}>
          <h3>
            Player 1: <span>{game.score.player1}</span>
          </h3>{" "}
          <h3>
            Player 2: <span>{game.score.player2}</span>
          </h3>
        </div>
      ))}
    </div>
  );
};

const GamePage = ({ gameId, playerId, featureProfile }) => {
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
    return (
      <QuestionPage {...featureProfile} gameId={gameId} playerId={playerId} />
    );
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

const QuestionPage = ({ gameId, playerId, grid, countdown }) => {
  const [myPerformance, setMyPerformance] = React.useState({});
  React.useEffect(() => {
    if (!myPerformance.t1) {
      setMyPerformance({ t1: performance.now() });
    }
    if (myPerformance.t1 && myPerformance.t2) {
      const res = (myPerformance.t2 - myPerformance.t1) / 1000;
      grid
        ? LogAnalyzer(analytics, "answer-time-grid", { res })
        : LogAnalyzer(analytics, "answer-time-stacked", { res });
    }

  }, [myPerformance]);
  const [snapshot_countdown, loading_countdown, error_countdown] = useObject(ref(db, "count_down"));
  const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`));

  //feature flag
  const [isCountDown, setIsCountDown] = React.useState(null)
  const [CountDownTime, setCountDownTime] = React.useState(null)

  countdown && React.useEffect(async () => {
    const initCountdown = async () => {
      if (!isCountDown) {
        setIsCountDown(true)
        await utils.SetCountDown({ seconds: 3 }, setCountDownTime, setIsCountDown)
      }
    }
    await initCountdown()
  }, [snapshot])


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

        // Demo-b
        updates[`/games/${gameId}/score/${youKey}`] = game.score[youKey] - 1;
      }
    }
    await update(ref(db), updates);

    if (game.currentQuestion < Object.values(game.questions).length) {
      await utils.sleep(3000);
      setMyPerformance({ t1: performance.now() });
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
      <div className={`alternatives ${grid && "grid-alternatives"}`}>
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
                } ${grid && "grid-alt"}`}
              key={countryCode}
              title={countryCode}
              onClick={() => {
                setMyPerformance({ ...myPerformance, t2: performance.now() });
                answer(countryCode);
              }}
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
        <div className="fs7 fw5 m9">Get ready for the next question...<FinalCountdown time={CountDownTime} /></div>
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
  const [snapshot, loading, error] = useObject(ref(db, `cookie_processors`));
  const [snapshotSP, loadingSP, errorSP] = useObject(ref(db, `sub_processors`));
  const [cookieProcessor, setCookieProcessor] = React.useState(null);
  const [subProcessor, setSubProcessor] = React.useState(null);
  React.useEffect(() => {
    if (!loading) {
      const snap = snapshot.val();
      setCookieProcessor({ ...snap });
    }
  }, [snapshot]);

  React.useEffect(() => {
    if (!loadingSP) {
      const snap = snapshotSP.val();
      setSubProcessor([...snap]);
    }
  }, [snapshotSP]);
  return (
    <div onClick={onClickHandler} className="cookie-explanation">
      <div className="cookie-processor__wrapper">
        {cookieProcessor &&
          Object.entries(cookieProcessor).map((processor, index) => {
            const [key, value] = processor;
            return (
              <article className="cookie-processor" key={index}>
                <div className="cookie-processor__header">
                  <h3>{key}</h3>
                </div>
                {value.map(({ processor }, index) => (
                  <div className="cookie-processor__content" key={index}>
                    <div className="cookie-processor__content-wrapper">
                      <h4>{processor.title}</h4>
                      <p>{processor.description}</p>
                    </div>

                    <div className="cookie-processor__content">
                      {processor.cookies &&
                        processor.cookies.map((cookie, index) => (
                          <div
                            className="cookie-processor__content-wrapper"
                            key={index}
                          >
                            <h5>{cookie.cookie_name}</h5>
                            <p>{cookie.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </article>
            );
          })}
        <div className="cookie-sub-processors">
          <h2>Sub Processors</h2>
          {subProcessor &&
            subProcessor.map((processor, index) => {
              return (
                index !== 0 && (
                  <div className="cookie-sub-processors__wrapper" key={index}>
                    <h4>{processor.title}</h4>
                    <p>{processor.description}</p>
                  </div>
                )
              );
            })}
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

  // Demo-d
  React.useEffect(() => {
    localStorage.setItem("agreement", JSON.stringify(agreement));
    if (agreement.statistic && agreement.consent) {
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

/*

Demo-a-3

*/


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

// demo-e

const AdvanceSetupPage = () => {
  const [snapshot, loading, error] = useObject(ref(db, "feature_flags"));
  const [featureFlagsHeaders, setFeatureFlagsHeaders] = React.useState([]);
  const [featureFlagsBodies, setFeatureFlagsBodies] = React.useState([]);
  React.useEffect(() => {
    if (!loading) {
      const snapshotValues = Object.entries(snapshot.val());
      setFeatureFlagsHeaders(Object.values(snapshot.val().labels));
      setFeatureFlagsBodies(
        snapshotValues.filter(
          (snap) => snap[0] !== "labels" && snap[0] !== "backgrounds"
        )
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
    const [key, value] = target.id.split("-");
    const snap = snapshot.val();
    const data = {
      ...snap,
      [key]: {
        ...snap[key],
        background: value,
      },
    };
    const updates = {};
    updates[`/feature_flags/`] = {
      ...data,
    };
    await update(ref(db), updates);
  };

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
                        className={`${k !== "background" && "table-on"} ${k !== "background" ? "table-clickable" : ""
                          }`}
                      >
                        {k === "background" ? (
                          <div className="feature__background-wrapper">
                            {snapshot.val().backgrounds.map((item) => {
                              return (
                                <div
                                  key={`${key}-${k}-${item}`}
                                  onClick={changeFeatureBackground}
                                  id={`${key}-${item}`}
                                  className={`feature__background feature--background-${item}
                            ${value === item
                                      ? "feature--current-active"
                                      : "feature--current-inactive"
                                    }`}
                                ></div>
                              );
                            })}
                          </div>
                        ) : (
                          "On"
                        )}
                      </td>
                    ) : (
                      <td
                        key={index}
                        id={`${key}-${k}`}
                        onClick={(e) => {
                          toggleFeature(e);
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


const FinalCountdown = ({ time }) => {

  return (<h1>{time}</h1>)
}

const Settings = ({ settings }) => {

  return <></>
}




export default App;
