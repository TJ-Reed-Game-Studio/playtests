# Playtests

Web builds of TJ's games for playtesting, deployed by each game's CI (the game template's
`tools/ci/deploy_playtest.sh`). Two kinds of build, each at its own link:

- `<repo>/`: the playtest build, the game's `release-candidate` commit, at
  `https://tjreed15.github.io/playtests/<repo>/`. Every push to `release-candidate` replaces it.
- `branches/<repo>/<branch slug>/`: a branch build, the head of any other branch, deployed by an
  on-demand CI run on that branch. It is removed when the branch's PR merges or the branch is
  deleted, and a weekly sweep removes any whose branch is gone. The game template's
  `tools/ci/branch_build.py` names the slug and the link.

`main` and `release` get no build here. `_engine/<godot version>-<wasm hash>/` holds the Godot
engine, shared by every build made with that engine, so each build folder holds only its game.

Public site, unlisted links: nothing secret goes in a build.
