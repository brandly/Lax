const gui = window.nwDispatcher.requireNwGui();
const win = gui.Window.get();

const nativeMenuBar = new gui.Menu({ type: 'menubar' });
try {
  nativeMenuBar.createMacBuiltin('IRC');
  win.menu = nativeMenuBar;
} catch (e) {
  console.log(e.message);
}
