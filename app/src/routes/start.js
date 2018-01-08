const React = require("react");

const Steam = require("../steam");
const Button = require("../button").default;
const H = require("../helpers");

const $ = React.createElement;

function Start(props) {
  const { setFolder, setRoute, setSteamRoot } = props;
  const { folder, steamRoot } = props.state;

  function pickDir() {
    H.pickDir().then(setFolder);
  }

  function pickSteamRoot() {
    H.pickDir().then(setSteamRoot);
  }

  function openFolder() {
    H.openFile(folder);
  }

  function openSteamRoot() {
    H.openFile(steamRoot);
  }

  function start() {
    setRoute("working");
    Steam.organize(steamRoot, folder)
      .then(() => setRoute("done"))
      .catch(fail);
  }

  function fail(err) {
    setRoute("start");
    process.stdout.write(err.stack + "\n");
    H.showMessageBox(
      {
        type: "error",
        title: "Screenhive: Error",
        message: err.stack,
        buttons: ["OK"]
      },
      () => {}
    );
  }

  const aboutPageButton = $(
    Button,
    { type: "subtle", onClick: () => setRoute("about") },
    "About"
  );

  const steamRootPicker = $(
    "div",
    {},
    $(
      Button,
      { type: "secondary", onClick: pickSteamRoot },
      "Choose Steam folder"
    ),
    $(
      Button,
      {
        type: "outline",
        disabled: !steamRoot,
        onClick: openSteamRoot
      },
      steamRoot || "No folder selected"
    )
  );

  const explainPara = $(
    "p",
    { className: "bt pt2 b--black-10 mb1 lh-copy near-black f6" },
    "Your screenshots will be organized in folders by game title, ",
    "so you can find them easily later."
  );

  const folderPicker = $(
    "div",
    {},
    $(
      Button,
      { type: "secondary", onClick: pickDir },
      "Choose screenshot destination"
    ),
    $(
      Button,
      {
        type: "outline",
        disabled: !folder,
        onClick: openFolder
      },
      folder || "No folder selected"
    )
  );

  const mainButton = $(
    Button,
    {
      type: "primary",
      disabled: !folder,
      onClick: start
    },
    "Organize screenshots"
  );

  return $(
    "div",
    { className: "min-h-100 flex flex-column justify-between" },
    aboutPageButton,
    $("div", {}, steamRootPicker, explainPara, folderPicker),
    mainButton
  );
}

module.exports = Start;
