// IPC: agent teams (electron/teams.js). Every call answers { ok, team } or { ok: false, error }; live changes come as teams:changed.
module.exports = function registerTeamsIpc(deps) {
  const { ipcMain, teams, cliAgents } = deps;
  const wrap = (fn) => async (_e, ...a) => { try { return { ok: true, team: await fn(...a) }; } catch (e) { return { ok: false, error: e.message || String(e) }; } };
  ipcMain.handle('teams:list', () => teams.list());
  ipcMain.handle('teams:clis', () => cliAgents.available()); // which of Claude Code / Codex are installed
  ipcMain.handle('teams:save', wrap((def) => teams.save(def || {})));
  ipcMain.handle('teams:delete', (_e, id) => teams.remove(id));
  ipcMain.handle('teams:start', wrap((id) => teams.start(id)));
  ipcMain.handle('teams:pause', wrap((id) => teams.pause(id)));
  ipcMain.handle('teams:resume', wrap((id) => teams.resume(id)));
  ipcMain.handle('teams:stop', wrap((id) => teams.stop(id)));
  ipcMain.handle('teams:say', wrap((id, text) => { teams.say(id, text); return teams.get(id); }));
};
