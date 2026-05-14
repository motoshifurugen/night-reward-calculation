#!/usr/bin/env node
/**
 * PreToolUse (Bash): 危険コマンドの拒否 → 問題なければ tmux 利用の注意（警告のみ）。
 * 終了コード: 0 許可 / 2 ツール実行ブロック（Claude Code のフック規約）。
 */
let data = "";
process.stdin.on("data", (chunk) => {
  data += chunk;
});
process.stdin.on("end", () => {
  let command = "";
  try {
    const payload = JSON.parse(data);
    command = payload.tool_input?.command ?? "";
  } catch {
    process.exit(0);
  }

  const block = (reason) => {
    process.stderr.write(`[Hook] Blocked: ${reason}\n`);
    process.exit(2);
  };

  if (/\brm\s+-rf\b/.test(command)) {
    block("rm -rf commands are not allowed");
  }
  if (/\bchmod\s+777\b/.test(command)) {
    block("chmod 777 is not allowed");
  }

  const longRunning =
    /npm (install|test|run build|run dev)|pnpm( run)? (install|test|build|dev)|yarn (install|test|build|dev)|bun (install|test|run dev|run build)|cargo (build|test)|\bmake\b|\bdocker\b|\bpytest\b|\bvitest\b|\bplaywright\b/;

  if (
    process.platform !== "win32" &&
    !process.env.TMUX &&
    longRunning.test(command)
  ) {
    process.stderr.write(
      "[Hook] Consider running in tmux for session persistence.\n"
    );
    process.stderr.write("[Hook] Start: tmux new -s dev\n");
    process.stderr.write("[Hook] Reattach: tmux attach -t dev\n");
  }

  process.exit(0);
});
