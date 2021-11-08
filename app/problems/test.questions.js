import { equal, notDeepEqual } from "assert";
import { randomQuestions } from "../src/utils.js";

describe("Test generated questions", () => {
  it("should randomize different set of questions", () => {
    const randomQuestionsOne = randomQuestions();
    const randomQuestionsTwo = randomQuestions();
    notDeepEqual(randomQuestionsOne, randomQuestionsTwo);
  });

  it("should have different alternatives", () => {
    const questions = randomQuestions();
    Object.values(questions).forEach((question) => {
      const uniqueAlternatives = new Set(Object.values(question.alternatives));
      equal(
        uniqueAlternatives.size,
        Object.values(question.alternatives).length
      );
    });
  });
  it("should have different questions", () => {
    const questions = randomQuestions();
    Object.values(questions).forEach((question) => {
      const { correct } = question;
      const uniqueQuestions = Object.values(questions).filter(
        (question) => question.correct === correct
      );
      equal(uniqueQuestions.length, 1);
    });
  });
});
