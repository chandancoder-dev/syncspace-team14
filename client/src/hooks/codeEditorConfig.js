export const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "ruby", label: "Ruby" },
  { id: "swift", label: "Swift" },
];

export const FILE_EXTENSIONS = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
  ruby: "rb",
  swift: "swift",
};

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const DEFAULT_CODE = {
  javascript: `// Start coding in JavaScript\nfunction hello() {\n  console.log("Hello, SyncSpace!");\n}\n\nhello();\n`,
  typescript: `// Start coding in TypeScript\nfunction hello(name: string): void {\n  console.log(\`Hello, \${name}!\`);\n}\n\nhello("SyncSpace");\n`,
  python: `# Start coding in Python\ndef hello():\n    print("Hello, SyncSpace!")\n\nhello()\n`,
  java: `// Start coding in Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, SyncSpace!");\n    }\n}\n`,
  c: `// Start coding in C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, SyncSpace!\\n");\n    return 0;\n}\n`,
  cpp: `// Start coding in C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, SyncSpace!" << endl;\n    return 0;\n}\n`,
  ruby: `# Start coding in Ruby\ndef hello\n  puts "Hello, SyncSpace!"\nend\n\nhello\n`,
  swift: `// Start coding in Swift\nfunc hello() {\n    print("Hello, SyncSpace!")\n}\n\nhello()\n`,
};
