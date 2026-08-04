import { useState, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { SERVER_URL } from './codeEditorConfig';

export default function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const webcontainerRef = useRef(null);

  // Run JavaScript/TypeScript in WebContainer (browser-based, instant)
  const runInWebContainer = async (code, lang = 'javascript') => {
    // Boot WebContainer if not already running
    if (!webcontainerRef.current) {
      webcontainerRef.current = await WebContainer.boot();
    }
    const container = webcontainerRef.current;

    // Write code to virtual filesystem
    const fileName = lang === 'typescript' ? '/main.ts' : '/index.js';
    await container.fs.writeFile(fileName, code);

    // Run it (TypeScript uses --experimental-strip-types)
    const args = lang === 'typescript'
      ? ['--experimental-strip-types', fileName]
      : [fileName];
    const process = await container.spawn('node', args);

    let stdout = '';

    // Capture stdout
    const outputReader = process.output.getReader();
    while (true) {
      const { done, value } = await outputReader.read();
      if (done) break;
      stdout += value;
    }

    const exitCode = await process.exit;
    return { stdout, stderr: '', exitCode };
  };

  // Run other languages via backend server
  const runOnServer = async (code, language) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${SERVER_URL}/api/code/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, language }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    return {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      exitCode: data.exitCode ?? -1,
    };
  };

  // Main execute function — routes to WebContainer (JS) or backend (others)
  const runCode = async (code, language) => {
    if (isRunning || !code.trim()) {
      if (!code.trim()) {
        setOutput({ stdout: "", stderr: "Error: No code to execute.", exitCode: 1 });
        setShowOutput(true);
      }
      return;
    }

    setIsRunning(true);
    setOutput(null);
    setShowOutput(true);

    try {
      let result;
      if (language === 'javascript' || language === 'typescript') {
        result = await runInWebContainer(code, language);
      } else {
        result = await runOnServer(code, language);
      }
      setOutput(result);
    } catch (error) {
      setOutput({
        stdout: "",
        stderr: `Execution failed: ${error.message}`,
        exitCode: 1,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    output,
    showOutput,
    setShowOutput,
    runCode,
  };
}
