import { useState, useRef, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import { DEFAULT_CODE, FILE_EXTENSIONS } from './codeEditorConfig';

// Generate default files based on selected language
function getDefaultFiles(language = 'javascript') {
  const ext = FILE_EXTENSIONS[language] || 'js';
  const fileName = language === 'java' ? 'Main.java' : `main.${ext}`;
  const files = {
    [fileName]: {
      type: 'file',
      content: DEFAULT_CODE[language] || '',
    },
  };

  // Add package.json only for JavaScript
  if (language === 'javascript') {
    files['package.json'] = {
      type: 'file',
      content: JSON.stringify({
        name: 'syncspace-project',
        version: '1.0.0',
        scripts: { start: 'node main.js' },
      }, null, 2),
    };
  }

  return files;
}

// Convert our file tree format to WebContainer's mount format
function toMountFormat(files, path = '') {
  const mount = {};
  for (const [name, node] of Object.entries(files)) {
    if (node.type === 'folder') {
      mount[name] = {
        directory: toMountFormat(node.children || {}, `${path}/${name}`),
      };
    } else {
      mount[name] = {
        file: { contents: node.content || '' },
      };
    }
  }
  return mount;
}

// Convert flat file tree to nested structure for FileExplorer
function buildFileTree(files) {
  const tree = {};
  for (const [name, node] of Object.entries(files)) {
    if (node.type === 'folder') {
      tree[name] = { type: 'folder', children: node.children || {} };
    } else {
      tree[name] = { type: 'file', content: node.content || '' };
    }
  }
  return tree;
}

export default function useWebContainer(language = 'javascript') {
  const containerRef = useRef(null);
  const [booted, setBooted] = useState(false);
  const [booting, setBooting] = useState(false);
  const [files, setFiles] = useState(() => getDefaultFiles(language));
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isProcessRunning, setIsProcessRunning] = useState(false);
  const processRef = useRef(null);

  // Boot WebContainer
  const boot = useCallback(async () => {
    if (containerRef.current || booting) return;
    setBooting(true);
    setTerminalOutput('⏳ Booting WebContainer...\n');

    try {
      containerRef.current = await WebContainer.boot();
      const defaultFiles = getDefaultFiles(language);
      await containerRef.current.mount(toMountFormat(defaultFiles));
      setFiles(defaultFiles);
      setBooted(true);
      setTerminalOutput((prev) => prev + '✅ WebContainer ready!\n\n');
    } catch (error) {
      setTerminalOutput((prev) => prev + `❌ Boot failed: ${error.message}\n`);
    } finally {
      setBooting(false);
    }
  }, [booting, language]);

  // Write a file to the container
  const writeFile = useCallback(async (path, content) => {
    if (!containerRef.current) return;
    await containerRef.current.fs.writeFile(path, content);
    // Update local state
    setFiles((prev) => {
      const updated = { ...prev };
      updated[path] = { type: 'file', content };
      return updated;
    });
  }, []);

  // Read a file from the container
  const readFile = useCallback(async (path) => {
    if (!containerRef.current) return '';
    try {
      const content = await containerRef.current.fs.readFile(path, 'utf-8');
      return content;
    } catch {
      return '';
    }
  }, []);

  // Create a new file
  const createFile = useCallback(async (name, content = '') => {
    if (!containerRef.current) return;
    await containerRef.current.fs.writeFile(name, content);
    setFiles((prev) => ({
      ...prev,
      [name]: { type: 'file', content },
    }));
  }, []);

  // Create a new folder
  const createFolder = useCallback(async (name) => {
    if (!containerRef.current) return;
    await containerRef.current.fs.mkdir(name, { recursive: true });
    setFiles((prev) => ({
      ...prev,
      [name]: { type: 'folder', children: {} },
    }));
  }, []);

  // Delete a file or folder
  const deleteFile = useCallback(async (path) => {
    if (!containerRef.current) return;
    try {
      await containerRef.current.fs.rm(path, { recursive: true });
    } catch {}
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });
  }, []);

  // Run a command (e.g., 'node index.js', 'npm start')
  const runCommand = useCallback(async (command, args = []) => {
    if (!containerRef.current) {
      setTerminalOutput((prev) => prev + '❌ WebContainer not booted\n');
      return;
    }

    // Kill previous process
    if (processRef.current) {
      processRef.current.kill();
      processRef.current = null;
    }

    setIsProcessRunning(true);
    setTerminalOutput((prev) => prev + `\n$ ${command} ${args.join(' ')}\n`);

    try {
      const process = await containerRef.current.spawn(command, args);
      processRef.current = process;

      // Stream output
      process.output.pipeTo(
        new WritableStream({
          write(chunk) {
            setTerminalOutput((prev) => prev + chunk);
          },
        })
      );

      const exitCode = await process.exit;
      setTerminalOutput((prev) => prev + `\n[Process exited with code ${exitCode}]\n`);
      processRef.current = null;
    } catch (error) {
      setTerminalOutput((prev) => prev + `\n❌ Error: ${error.message}\n`);
    } finally {
      setIsProcessRunning(false);
    }
  }, []);

  // Run the current file (node <filename>)
  const runFile = useCallback(async (filePath) => {
    await runCommand('node', [filePath]);
  }, [runCommand]);

  // Run npm command
  const runNpm = useCallback(async (script) => {
    await runCommand('npm', ['run', script]);
  }, [runCommand]);

  // Install packages
  const installPackages = useCallback(async () => {
    await runCommand('npm', ['install']);
  }, [runCommand]);

  // Kill running process
  const killProcess = useCallback(() => {
    if (processRef.current) {
      processRef.current.kill();
      processRef.current = null;
      setIsProcessRunning(false);
      setTerminalOutput((prev) => prev + '\n[Process killed]\n');
    }
  }, []);

  // Clear terminal
  const clearTerminal = useCallback(() => {
    setTerminalOutput('');
  }, []);

  // Reset files for a new language
  const resetFiles = useCallback(async (lang) => {
    const newFiles = getDefaultFiles(lang);
    setFiles(newFiles);
    if (containerRef.current) {
      // Remove old files (best effort)
      try {
        const entries = await containerRef.current.fs.readdir('/');
        for (const entry of entries) {
          try { await containerRef.current.fs.rm(`/${entry}`, { recursive: true }); } catch {}
        }
      } catch {}
      // Mount new files
      await containerRef.current.mount(toMountFormat(newFiles));
    }
  }, []);

  return {
    booted,
    booting,
    files,
    terminalOutput,
    isProcessRunning,
    boot,
    writeFile,
    readFile,
    createFile,
    createFolder,
    deleteFile,
    runFile,
    runCommand,
    runNpm,
    installPackages,
    killProcess,
    clearTerminal,
    resetFiles,
  };
}
