const React = require("react");

const Steam = require("../steam");
const SteamPNG = require("../steam-png");
const Button = require("../button");
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
    SteamPNG.organize(folder)
      .then(() => Steam.organize(steamRoot, folder))
      .then(() => setRoute("done"))
      .catch(fail);
  }

  function fail(err) {
    setRoute("start");
    process.stdout.write(err.stack + "\n");
    const options = {
      type: "error",
      title: "Screenhive: Error",
      message: err.stack,
      buttons: ["OK"]
    };
    H.showMessageBox(options, () => {});
  }

  const aboutPageButton = $(
    Button,
    { type: "round", onClick: () => setRoute("about") },
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
        type: "link",
        disabled: !steamRoot,
        onClick: openSteamRoot
      },
      steamRoot || "No folder selected"
    )
  );

  const folderPicker = $(
    "div",
    {},
    $(
      Button,
      { type: "secondary", onClick: pickDir },
      "Choose screenshot folder"
    ),
    $(
      Button,
      {
        type: "link",
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
    "Organize"
  );

  return $(
    "div",
    {},
    $("div", {}, aboutPageButton),
    steamRootPicker,
    folderPicker,
    folder ? mainButton : null
  );
}

module.exports = Start;
