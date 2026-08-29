// src/utils/snippets.js

export const languageSnippets = {
  python: [
    {
      label: "def",
      insertText: "def ${1:function_name}(${2:params}):\n    ${3:pass}",
      documentation: "Define a function",
    },
    {
      label: "class",
      insertText:
        "class ${1:ClassName}:\n    def __init__(self${2:, params}):\n        ${3:pass}",
      documentation: "Define a class",
    },
    {
      label: "if",
      insertText: "if ${1:condition}:\n    ${2:pass}",
      documentation: "If statement",
    },
    {
      label: "elif",
      insertText: "elif ${1:condition}:\n    ${2:pass}",
      documentation: "Elif statement",
    },
    {
      label: "else",
      insertText: "else:\n    ${1:pass}",
      documentation: "Else statement",
    },
    {
      label: "for",
      insertText: "for ${1:item} in ${2:iterable}:\n    ${3:pass}",
      documentation: "For loop",
    },
    {
      label: "while",
      insertText: "while ${1:condition}:\n    ${2:pass}",
      documentation: "While loop",
    },
    {
      label: "try",
      insertText:
        "try:\n    ${1:pass}\nexcept ${2:Exception} as e:\n    ${3:pass}",
      documentation: "Try-except block",
    },
    {
      label: "with",
      insertText: "with ${1:context} as ${2:var}:\n    ${3:pass}",
      documentation: "With statement",
    },
    {
      label: "import",
      insertText: "import ${1:module}",
      documentation: "Import module",
    },
    {
      label: "from",
      insertText: "from ${1:module} import ${2:}",
      documentation: "From import",
    },
    {
      label: "return",
      insertText: "return ${1:}",
      documentation: "Return statement",
    },
    {
      label: "print",
      insertText: "print(${1:})",
      documentation: "Print statement",
    },
    {
      label: "lambda",
      insertText: "lambda ${1:x}: ${2:x * 2}",
      documentation: "Lambda function",
    },
  ],
  javascript: [
    {
      label: "log",
      insertText: "console.log(${1:message});",
      documentation: "Console log",
    },
    {
      label: "func",
      insertText: "function ${1:name}(${2:params}) {\n    ${3:}\n}",
      documentation: "Function declaration",
    },
    {
      label: "arrow",
      insertText: "const ${1:name} = (${2:params}) => {\n    ${3:}\n}",
      documentation: "Arrow function",
    },
    {
      label: "class",
      insertText:
        "class ${1:ClassName} {\n    constructor(${2:params}) {\n        ${3:}\n    }\n}",
      documentation: "Class declaration",
    },
    {
      label: "if",
      insertText: "if (${1:condition}) {\n    ${2:}\n}",
      documentation: "If statement",
    },
    {
      label: "else",
      insertText: "else {\n    ${1:}\n}",
      documentation: "Else statement",
    },
    {
      label: "elseif",
      insertText: "else if (${1:condition}) {\n    ${2:}\n}",
      documentation: "Else if statement",
    },
    {
      label: "for",
      insertText:
        "for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n    ${3:}\n}",
      documentation: "For loop",
    },
    {
      label: "while",
      insertText: "while (${1:condition}) {\n    ${2:}\n}",
      documentation: "While loop",
    },
    {
      label: "try",
      insertText: "try {\n    ${1:}\n} catch (${2:error}) {\n    ${3:}\n}",
      documentation: "Try-catch block",
    },
    {
      label: "const",
      insertText: "const ${1:name} = ${2:value};",
      documentation: "Constant declaration",
    },
    {
      label: "let",
      insertText: "let ${1:name} = ${2:value};",
      documentation: "Variable declaration",
    },
    {
      label: "export",
      insertText: "export ${1:default} ${2:name}",
      documentation: "Export statement",
    },
    {
      label: "import",
      insertText: "import ${1:} from '${2:module}';",
      documentation: "Import statement",
    },
  ],
  java: [
    {
      label: "main",
      insertText: "public static void main(String[] args) {\n    ${1:}\n}",
      documentation: "Main method",
    },
    {
      label: "class",
      insertText: "public class ${1:ClassName} {\n    ${2:}\n}",
      documentation: "Class declaration",
    },
    {
      label: "sysout",
      insertText: "System.out.println(${1:message});",
      documentation: "Print to console",
    },
    {
      label: "for",
      insertText:
        "for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n    ${3:}\n}",
      documentation: "For loop",
    },
    {
      label: "if",
      insertText: "if (${1:condition}) {\n    ${2:}\n}",
      documentation: "If statement",
    },
    {
      label: "else",
      insertText: "else {\n    ${1:}\n}",
      documentation: "Else statement",
    },
    {
      label: "try",
      insertText:
        "try {\n    ${1:}\n} catch (${2:Exception} e) {\n    ${3:}\n}",
      documentation: "Try-catch block",
    },
    {
      label: "interface",
      insertText: "interface ${1:InterfaceName} {\n    ${2:}\n}",
      documentation: "Interface declaration",
    },
    {
      label: "extends",
      insertText:
        "class ${1:ClassName} extends ${2:ParentClass} {\n    ${3:}\n}",
      documentation: "Extends class",
    },
    {
      label: "implements",
      insertText:
        "class ${1:ClassName} implements ${2:InterfaceName} {\n    ${3:}\n}",
      documentation: "Implements interface",
    },
    {
      label: "private",
      insertText: "private ${1:type} ${2:name};",
      documentation: "Private field",
    },
    {
      label: "public",
      insertText: "public ${1:type} ${2:name};",
      documentation: "Public field",
    },
    {
      label: "return",
      insertText: "return ${1:};",
      documentation: "Return statement",
    },
  ],
  cpp: [
    {
      label: "main",
      insertText: "int main() {\n    ${1:}\n    return 0;\n}",
      documentation: "Main function",
    },
    {
      label: "include",
      insertText: "#include <${1:iostream}>\nusing namespace std;",
      documentation: "Include directive",
    },
    {
      label: "cout",
      insertText: "cout << ${1:} << endl;",
      documentation: "Print to console",
    },
    {
      label: "cin",
      insertText: "cin >> ${1:var};",
      documentation: "Read input",
    },
    {
      label: "for",
      insertText:
        "for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n    ${3:}\n}",
      documentation: "For loop",
    },
    {
      label: "if",
      insertText: "if (${1:condition}) {\n    ${2:}\n}",
      documentation: "If statement",
    },
    {
      label: "else",
      insertText: "else {\n    ${1:}\n}",
      documentation: "Else statement",
    },
    {
      label: "class",
      insertText: "class ${1:ClassName} {\npublic:\n    ${2:}\n};",
      documentation: "Class declaration",
    },
    {
      label: "vector",
      insertText: "vector<${1:int}> ${2:name};",
      documentation: "Vector declaration",
    },
    {
      label: "string",
      insertText: "string ${1:name};",
      documentation: "String declaration",
    },
    {
      label: "while",
      insertText: "while (${1:condition}) {\n    ${2:}\n}",
      documentation: "While loop",
    },
    {
      label: "return",
      insertText: "return ${1:};",
      documentation: "Return statement",
    },
  ],
  c: [
    {
      label: "main",
      insertText: "int main() {\n    ${1:}\n    return 0;\n}",
      documentation: "Main function",
    },
    {
      label: "include",
      insertText: "#include <${1:stdio.h}>",
      documentation: "Include directive",
    },
    {
      label: "printf",
      insertText: 'printf("${1:}");',
      documentation: "Print to console",
    },
    {
      label: "scanf",
      insertText: 'scanf("${1:%d}", &${2:var});',
      documentation: "Scan input",
    },
    {
      label: "for",
      insertText:
        "for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n    ${3:}\n}",
      documentation: "For loop",
    },
    {
      label: "if",
      insertText: "if (${1:condition}) {\n    ${2:}\n}",
      documentation: "If statement",
    },
    {
      label: "else",
      insertText: "else {\n    ${1:}\n}",
      documentation: "Else statement",
    },
    {
      label: "while",
      insertText: "while (${1:condition}) {\n    ${2:}\n}",
      documentation: "While loop",
    },
    {
      label: "struct",
      insertText: "struct ${1:StructName} {\n    ${2:}\n};",
      documentation: "Struct declaration",
    },
    {
      label: "malloc",
      insertText: "(${1:type}*)malloc(sizeof(${2:type}));",
      documentation: "Memory allocation",
    },
    {
      label: "free",
      insertText: "free(${1:ptr});",
      documentation: "Free memory",
    },
    {
      label: "return",
      insertText: "return ${1:};",
      documentation: "Return statement",
    },
  ],
  php: [
    {
      label: "echo",
      insertText: "echo ${1:};",
      documentation: "Echo statement",
    },
    {
      label: "print",
      insertText: "print ${1:};",
      documentation: "Print statement",
    },
    {
      label: "func",
      insertText: "function ${1:name}(${2:params}) {\n    ${3:}\n}",
      documentation: "Function declaration",
    },
    {
      label: "class",
      insertText: "class ${1:ClassName} {\n    ${2:}\n}",
      documentation: "Class declaration",
    },
    {
      label: "if",
      insertText: "if (${1:condition}) {\n    ${2:}\n}",
      documentation: "If statement",
    },
    {
      label: "else",
      insertText: "else {\n    ${1:}\n}",
      documentation: "Else statement",
    },
    {
      label: "elseif",
      insertText: "elseif (${1:condition}) {\n    ${2:}\n}",
      documentation: "Elseif statement",
    },
    {
      label: "for",
      insertText:
        "for ($${1:i} = 0; $${1:i} < ${2:length}; $${1:i}++) {\n    ${3:}\n}",
      documentation: "For loop",
    },
    {
      label: "foreach",
      insertText: "foreach ($${1:array} as $${2:value}) {\n    ${3:}\n}",
      documentation: "Foreach loop",
    },
    {
      label: "while",
      insertText: "while (${1:condition}) {\n    ${2:}\n}",
      documentation: "While loop",
    },
    {
      label: "return",
      insertText: "return ${1:};",
      documentation: "Return statement",
    },
    {
      label: "public",
      insertText: "public ${1:function_name}(${2:params}) {\n    ${3:}\n}",
      documentation: "Public method",
    },
    {
      label: "private",
      insertText: "private ${1:function_name}(${2:params}) {\n    ${3:}\n}",
      documentation: "Private method",
    },
  ],
};

// Common snippets that work for all languages
export const commonSnippets = [
  {
    label: "if",
    insertText: "if (${1:condition}) {\n    ${2:}\n}",
    documentation: "If statement",
  },
  {
    label: "for",
    insertText:
      "for (${1:let i = 0}; ${2:i < length}; ${3:i++}) {\n    ${4:}\n}",
    documentation: "For loop",
  },
  {
    label: "while",
    insertText: "while (${1:condition}) {\n    ${2:}\n}",
    documentation: "While loop",
  },
  {
    label: "return",
    insertText: "return ${1:};",
    documentation: "Return statement",
  },
  {
    label: "try",
    insertText: "try {\n    ${1:}\n} catch (${2:error}) {\n    ${3:}\n}",
    documentation: "Try-catch block",
  },
];

export default languageSnippets;
