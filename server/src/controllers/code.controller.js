import { execFile } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const TIMEOUT_MS = 5000; // 5 second execution limit

// Language configurations: how to compile (if needed) and run
const LANGUAGE_CONFIG = {
  javascript: {
    extension: "js",
    compile: null,
    run: (filePath) => ["node", [filePath]],
  },
  python: {
    extension: "py",
    compile: null,
    run: (filePath) => ["python3", [filePath]],
  },
  java: {
    extension: "java",
    compile: (filePath, dir) => ["javac", [filePath]],
    run: (filePath, dir) => ["java", ["-cp", dir, "Main"]],
  },
  c: {
    extension: "c",
    compile: (filePath, dir) => ["gcc", [filePath, "-o", join(dir, "a.out")]],
    run: (filePath, dir) => [join(dir, "a.out"), []],
  },
  cpp: {
    extension: "cpp",
    compile: (filePath, dir) => ["g++", [filePath, "-o", join(dir, "a.out")]],
    run: (filePath, dir) => [join(dir, "a.out"), []],
  },
};

/**
 * Execute a command with a timeout.
 * Returns { stdout, stderr, exitCode }
 */
function executeWithTimeout(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = execFile(command, args, {
      timeout: TIMEOUT_MS,
      maxBuffer: 1024 * 1024, // 1MB output limit
      ...options,
    }, (error, stdout, stderr) => {
      if (error && error.killed) {
        resolve({
          stdout: stdout || "",
          stderr: "Error: Execution timed out (5 second limit exceeded).",
          exitCode: 124,
        });
      } else {
        resolve({
          stdout: stdout || "",
          stderr: stderr || "",
          exitCode: error ? error.code || 1 : 0,
        });
      }
    });
  });
}

export const executeCode = async (req, res) => {
  const { code, language } = req.body;

  // Validate input
  if (!code || !language) {
    return res.status(400).json({
      message: "Both 'code' and 'language' are required.",
    });
  }

  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return res.status(400).json({
      message: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_CONFIG).join(", ")}`,
    });
  }

  // Create a unique temp directory for this execution
  const execId = randomUUID();
  const execDir = join(tmpdir(), `syncspace-exec-${execId}`);
  const fileName = language === "java" ? "Main.java" : `main.${config.extension}`;
  const filePath = join(execDir, fileName);

  try {
    // Create temp directory and write code file
    await mkdir(execDir, { recursive: true });
    await writeFile(filePath, code, "utf-8");

    // Compile if needed (C, C++, Java)
    if (config.compile) {
      const [compileCmd, compileArgs] = config.compile(filePath, execDir);
      const compileResult = await executeWithTimeout(compileCmd, compileArgs, { cwd: execDir });

      if (compileResult.exitCode !== 0) {
        return res.json({
          stdout: "",
          stderr: compileResult.stderr || "Compilation failed.",
          exitCode: compileResult.exitCode,
        });
      }
    }

    // Run the code
    const [runCmd, runArgs] = config.run(filePath, execDir);
    const result = await executeWithTimeout(runCmd, runArgs, { cwd: execDir });

    return res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    });
  } catch (error) {
    return res.status(500).json({
      stdout: "",
      stderr: `Server error: ${error.message}`,
      exitCode: 1,
    });
  } finally {
    // Cleanup temp files
    try {
      const { rm } = await import("fs/promises");
      await rm(execDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
};
