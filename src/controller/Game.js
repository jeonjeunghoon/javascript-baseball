import User from '../models/User.js';
import Computer from '../models/Computer.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import Counter from '../models/Counter.js';

const MESSAGE = '잘못된 입력입니다.';

class Game {
  constructor() {
    OutputView.printStartingMessage();
    this.createInstance().dataInit();
  }

  createInstance() {
    this.user = new User();
    this.computer = new Computer();
    this.counter = new Counter();

    return this;
  }

  dataInit() {
    this.computer.setAnswer();
    this.handleException(this.computer.checkAnswer());
    this.computerAnswerArray = this.computer.getAnswer();
    this.counter.resetStrikeAndBall();
    this.setRunningGame(true);

    return this;
  }

  handleException(checker) {
    if (!checker) {
      InputView.closeConsole();
      throw new Error(MESSAGE);
    }
  }

  setRunningGame(state) {
    this.isRunningGame = state;
  }

  playGame() {
    InputView.startQuiz(this.setQuestion(), answer => {
      this.user.setAnswerString(answer);

      if (this.isRunningGame) {
        this.gameMode();
        return;
      }

      this.choiceMode();
    });
  }

  setQuestion() {
    return this.isRunningGame ? InputView.question.answerMessage : InputView.question.choiceMessage;
  }

  gameMode() {
    this.handleException(this.user.checkAnswer());

    this.setRunningGame(
      this.counter.checkGameResult(this.computerAnswerArray, this.user.getAnswerArray())
    );
    OutputView.printScoreMessage(this.counter.printResultMessage());

    this.playGame();
  }

  choiceMode() {
    this.handleException(this.counter.checkChoice(this.user.getAnswerString()));

    if (this.counter.isRestart(this.user.getAnswerString())) {
      this.restartGame();
      return;
    }

    this.endGame();
  }

  restartGame() {
    this.dataInit().playGame();
  }

  endGame() {
    InputView.closeConsole();
    OutputView.printEndingMessage();
  }
}

export default Game;