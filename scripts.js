async function asyncMap(array, callback) { // utility function
  const results = [];
  for (const item of array) {
    results.push(await callback(item));
  }
  return results;
}
function wait(ms = 0) {// utility function
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
  popup.classList.remove("open");
  await wait(1000);
  popup.remove();
}

function ask(options) {
  return new Promise(async function (resolve) {
    const popup = document.createElement("form");
    popup.classList.add("popup");
    popup.insertAdjacentHTML(
      "afterbegin",
      `<fieldset>
                <label>${options.title}</label>
                <input type="text" name="input"/>
                <button type="submit">Submit</button>
            </fieldset>
        `
    );
    if (options.cancel) {
      const skipButton = document.createElement("button");
      skipButton.type = "button";
      skipButton.textContent = "Cancel";
      popup.firstChild.appendChild(skipButton);

      skipButton.addEventListener(
        "click",
        function () {
          resolve(null);
          destroyPopup(popup);
        },
        { once: true }
      );
    }

    popup.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        resolve(e.target.input.value);
        destroyPopup(popup);
      },
      { once: true }
    );

    document.body.appendChild(popup);
    await wait(10);
    popup.classList.add("open");
  });
}

async function askQuestion(e) {
  const button = e.currentTarget;
  //const shouldCancel = "cancel" in button.dataset; option 1 to check attribute existence
  const shouldCancel = button.hasAttribute("data-cancel"); // option 2 to check attribute existence
  const answer = await ask({
    title: button.dataset.question,
    cancel: shouldCancel,
  });
}

const buttons = document.querySelectorAll("[data-question]");
buttons.forEach((button) => button.addEventListener("click", askQuestion));

const questions = [
  { title: "What is your name?" },
  { title: "What is your age?", cancel: true },
  { title: "What is your dogs name?" },
];


async function go() {
  const answers = await asyncMap(questions, ask);
  console.log(answers);
}

go();
