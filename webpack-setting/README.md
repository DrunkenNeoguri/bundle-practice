## 📦 Webpack으로 프로젝트를 생성해보자!

1. `**package.json`을 생성하기\*\*

아래의 커맨드를 터미널에 입력해 package.json을 생성하자.

```
$ npm init -y

// 커맨드 입력 후, 아래와 같이 package.json이 생성됐다는 로그가 출력된다.
Wrote to D:\code\project\bundle-practice\webpack-setting\package.json:

{
  "name": "webpack-setting",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

2. **React를 사용하기 위한 필수 라이브러리 설치**

다음의 커맨드들을 입력하여 라이브러리를 설치해보자.

```
// react 라이브러리 설치
$ npm install react react-dom

// typescript와 react type 라이브러리 설치
$ npm install -D typescript @types/react @types/react-dom

// tsconfig.json 파일 생성
$ tsc --init
```

3. **본격적인 webpack 설정**

기본 라이브러리 설치도 완료됐다면 이제 webpack도 아래와 같이 설치를 진행해주자.

```
// 웹팩 라이브러리 설치
$ npm install webpack

// 웹팩 command-line interface 설치
$ npm install webpack-cli

// 아래의 패키지 설치
// html-webpack-plugin: 웹팩에서 실행되어 나오는 결과물이 변경될 때마다
// html 파일을 자동으로 수정해주는 플러그인
// webpack-dev-server: 개발할 때 사용하는 웹 개발 서버
// ts-loader: ts 파일을 js로 변환해주는 웹팩 로더
$ npm install html-webpack-plugin webpack-dev-server ts-loader
```

4. **개발 환경에 맞게 webpack 설정 적용**

webpack 설정 파일을 통해서 개발 환경에서만, 배포 환경에서만, 두 환경 모두에 반영되도록 하는 기능들을 적용할 수 있다.

각 환경 파일은 아래와 같이 구분한다.

- `webpack.common.js`
  - 개발 및 배포 모두에 공용적으로 적용할 설정을 관리하는 파일
- `webpack.dev.js`
  - 개발 환경에서만 적용될 설정을 관리하는 파일
- `webpack.prod.js`
  - 배포 환경에서만 적용될 설정을 관리하는 파일

해당 내용을 학습하기 위해 다른 분이 작성하신 `webpack.common.js` 파일을 참고하여 webpack에서 쓰이는 각 설정을 정리해봤다.

```jsx
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 개발 환경인지, 배포 환경인지를 설정할 수 있음.
  // development, production 두 가지가 있다.
  mode: "development",

  // 번들링을 시작할 파일을 설정할 수 있다.
  // 해당 파일 안에 import된 파일들을 webpack이 따라가면서 연관 파일을 모두 번들링해준다.
  entry: "./src/index.tsx",

  // 번들링된 결과 파일들에 대한 설정
  output: {
    // 번들링 파일 결과물
    filename: "bundle.js",
    // 번들링 결과 파일 경로
    path: path.resolve(__dirname, "dist"),
    // 번들링 시, 이전에 생성된 번들링 파일을 지울지 설정
    clean: true,
  },

  // 모듈 혹은 파일을 어떻게 해석할 것인지를 설정할 수 있다.
  resolve: {
    // 확장자 설정 - 이 경우, import할 때 확장자를 생략할 수 있다.
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  // 웹팩 기본 제공에 추가적으로 사용할 수 있는 확장 기능
  module: {
    // 각 파일에 적용할 로더를 설정할 수 있다.
    rules: [
      {
        // 로더를 적용할 파일의 확장자를 정규식으로 표현
        test: /\.(js|ts|tsx)$/i,
        // 정규 표현식에 해당되는 파일 중, 로더를 적용하지 않을 케이스를 적용
        exclude: /node_modules/,
        // 위의 로더를 적용할 파일들의 '로더'를 설정
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },

  // 모듈은 번들링할 때에 적용될 확장 기능이라면
  // 플러그인은 위의 아웃풋, 즉 번들링된 결과물에 적용될 확장 기능들이다.
  plugins: [
    // 여기서는 아까 html-webpack-plugin 패키지를 설치했으므로,
    // 자동으로 index.html을 생성해주는 HtmlWebpackPlugin를 추가한다.
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],

  // 개발자 도구를 열 때 출력되는 소스맵을 어떻게 생성할지 규칙을 정한다.
  // [!] 소스 맵: 웹 개발자가 변환된 코드를 디버깅 시, 원본 소스의 어디를 참조해야하는지 도와주는,
  // 원본 코드와 매핑된 코드가 어디서 묶였는지 선언되어있는 파일을 가리킨다.

  // 콘솔 창에 console.log()를 찍으면 어떤 파일에서 이게 찍히는지를 확인할 수 있는 건 모두
  // 소스 맵 덕분이다.

  // inline-source-map은 DataURL이라는 URL 방식으로 소스 맵에 추가되어
  // 에러 코드 표시 시, 브라우저 콘솔에서 원본 코드의 특정 위치를 정확하게 파악할 수 있도록
  // 소스 맵을 참조시켜 준다.
  // 단, 이 방식은 빌드와 리빌드의 속도가 많이 느리다는 단점이 있다.
  devtool: "inline-source-map",

  // 코드가 변경될 때마다 자동으로 컴파일해주도록 하는 웹팩의 개발 서버 설정
  // webpack-dev-server 패키지를 설치하면 이용할 수 있다.
  devServer: {
    // webpack-dev-server를 로컬 환경에서 실행하기 위해 적용할 경로 파일
    static: "./dist",
    // 입력한 정보가 유지된 상태에서 수정된 부분만 바꿀지,
    // 아니면 새로고침 등을 해야만 수정된 정보를 반영할지를 설정함.
    hot: true,
    // 서버가 시작되면 웹 페이지를 자동으로 오픈해줄지 설정함.
    open: true,
  },
};
```

아래의 코드들은 개발 환경과 배포 환경에서 각각 적용될 설정들이다.

```jsx
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // eval로 설정하면 모든 코드를 eval을 통해 묶어서 코드를 압축한다.
  // 개발 빌드를 할 때 해당 값을 이용하면 빌드와 리빌드도 빠르게 처리할 수 있다.
  devtool: "eval",
  devServer: {
    // React로 만든 SPA 같은 단일 index.html 페이지에서 history API를 이용해 가짜 주소를 만들어줄 것인지 설정
    // true로 할 경우, 서버에 없는 경로를 있는 것처럼 인식시킬 수 있음.
    historyApiFallback: true,
    // 개발 서버를 열 때, 어떤 로컬 환경 포트로 서버를 띄워줄 것인지 설정
    port: 3000,
    hot: true,
  },
});
```

```jsx
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  // hidden-이 붙으면 소스맵에 대한 참조를 추가하지 않는다.
  // 이 경우, 에러가 발생 시 번들링된 파일에서만 에러가 참조되기 때문에
  // 정확하게 어느 파일에서 문제가 발생했는지 디버깅 하려운 단점이 있다.
  // 따라서 해당 사항은 배포 빌드에서 주로 쓰인다.
  devtool: "hidden-source-map",
});
```

5. `tsconfig.json`**를 열어서 설정하기**

TypeScript 패키지를 설치했다면, 디렉토리에 `tsconfig.json` 파일이 생성된 것을 볼 수 있을 것이다.
없다면 직접 생성해주거나 패키지를 재설치 해보도록 하자.

해당 파일을 열면 아래와 같이 수많은 설정들을 볼 수 있다.

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  }
}
```

이 수많은 설정들을 다 설정하자니 복잡해질 것 같으므로 해당 사항은 별책부록으로 나중에 뜯어보기로 하고, 지금은 vite나 next 패키지 설치 시의 `tsconfig.json` 파일 내용 속에서 몇 가지를 추려내 적용해봤다.

```json
{
  "compilerOptions": {
    /** 언어 및 환경 설정 **/

    // Typescript의 코드를 어느 버전의 javascript 코드로 컴파일할지 결정
    "target": "esnext",
    // 컴파일에 포함할 라이브러리 파일 목록을 Array로 묶음
    "lib": ["dom", "dom.iterable", "esnext"],
    // TypeScript를 Javascript으로 트랜스파일링할 때, 모듈을 어떤 시스템 기준으로 설정할지 결정
    // 트랜스 파일링: 한 언어로 작성한 코드를 다른 언어로 비슷한 수준으로 하여금 추상화하는 과정
    "module": "esnext",
    // ts, tsx 파일에 js, jsx 파일을 import해서 쓰게할 수 있는지,
    // 즉, javascript 파일을 컴파일하는 것을 허용할지 여부 결정
    "allowJs": true,
    // 모든 '.d.ts' 파일의 타입 체크를 스킵함.
    "skipLibCheck": true,
    // 컴파일된 결과물인 자바스크립트 파일을 생성하지 않을지 결정.
    "noEmit": false,

    /** lint 적용 사항 **/

    // 타입 체크를 엄격하게 할 것인지, 아닌지 여부 결정
    "strict": true,
    // 사용되지 않은 지역 변수에 대해 알려줄지 결정
    "noUnusedLocals": true,
    // 사용하지 않은 파라미터에 대해 알려줄지 결정
    "noUnusedParameters": true,
    // switch 문에서 fallthrough 케이스가 발생할 수 있을 때, 알려줄지 결정
    "noFallthroughCasesInSwitch": true,

    /* 번들러 적용 사항 */

    // 모듈 경로를 어디서부터 시작하여 탐색할지 결정
    // node로 하면 node-modules부터 찾기 시작.
    "moduleResolution": "node",
    // .json 파일들을 import하는 것을 허용할지 여부 결정
    "resolveJsonModule": true,
    // 타입스크립트 파일 내에 import와 export 문이 없을 시, 해당 파일을 전역 공간으로 정의할지 여부 결정
    "isolatedModules": true,
    // tsx 파일을 jsx 파일로 어떻게 컴파일할 것인지 여부 결정
    // preserve 혹은 react, react-jsx가 많이 쓰인다.
    "jsx": "react-jsx",
    // 같은 파일이라도, 참조 방식이 일관되지 않을 경우 이를 허용해줄지 등을 결정
    "forceConsistentCasingInFileNames": true,
    // commonjs 모듈 방식을 import를 이용해서 가져올수 있도록 허용할지 결정
    "esModuleInterop": true
  },
  // 컴파일할 대상을 array로 묶음
  "include": ["src"],
  // 컴파일에서 제외할 대상을 array로 묶음
  "exclude": ["node_modules"]
}
```

6.  **/src 디렉토리 생성**

위의 설정까지 마쳤다면 실제 코드가 작성될 위치를 지정해줄 필요가 있다.

이전에 Create-React-App을 설치해봤으면 많이 봤을 index와 App 파일을 설정해주자.

생성시에는 src 디렉토리를 파고, 그 안에 index.tsx와 App.tsx 파일을 추가하면 된다.

```tsx
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```tsx
const App = () => {
  return <div>짜잔~ Webpack으로 개발 환경을 구축했습니다!</div>;
};

export default App;
```

7. **/public 디렉토리 생성**

여기까지 했다면 이제 남은 건, 이 React 코드들이 반영될 가장 최상위 경로인 `index.html`을 생성하는 것이다.

React는 `index.html` 파일 내에 있는 `id=”root”`가 기입된 `div` 요소 속에서 모든 내용이 반영되도록 설계되어 있다.

아래와 같이 public 폴더를 파고 index.html를 추가하고 내용을 입력해주자.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack으로 React 환경 구축까지!</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

8. **마지막으로 다시 package.json에서 몇 가지 실행 스크립트를 분리!**

여기까지 했으면 이제 마지막으로 개발 환경, 배포 환경, 빌드 등을 적용할 스크립트 명령어를 커스텀해보자.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "watch": "webpack --watch",
	// 개발 환경
  **"dev": "npx webpack serve --config webpack.dev.js",
  "dev_build": "webpack --config webpack.dev.js"
  "prod_build": "webpack --config webpack.prod.js",**
},

```

- **dev**
  - 웹팩 서버를 실행시키되, dev 설정 기준으로 적용되도록 했다.
- **dev_build**
  - 프로젝트를 빌드하되, dev 설정 기준으로 빌드되도록 적용했다.
- **prod_build**
  - 프로젝트를 빌드하되, prod 설정 기준으로 빌드되도록 적용했다.

여기까지 완료했다면 터미널에 이제 ‘npm run dev’를 입력하고 실행해보자.

```json
$ npm run dev

> webpack-setting@1.0.0 dev
> npx webpack serve --config webpack.dev.js

<i> **[webpack-dev-server] Project is running at:**
<i> **[webpack-dev-server] Loopback:** **http://localhost:3000/**
<i> **[webpack-dev-server] On Your Network (IPv4): http://192.168.200.132:3000/**
<i> **[webpack-dev-server] Content not from webpack is served from** **'./dist'** directory
<i> **[webpack-dev-server] 404s will fallback to '/index.html'**
<i> **[webpack-dev-middleware] wait until bundle finished:** **/**
asset **bundle.js** 1.42 MiB **[emitted]** (name: main)
asset **index.html** 321 bytes **[emitted]**
runtime modules 27.5 KiB 13 modules
modules by path ./node_modules/ 1.29 MiB
  modules by path ./node_modules/webpack-dev-server/client/ 71.8 KiB 16 modules
  modules by path ./node_modules/webpack/hot/*.js 5.3 KiB 4 modules
  modules by path ./node_modules/react/ 127 KiB 4 modules
  modules by path ./node_modules/html-entities/lib/*.js 81.8 KiB 4 modules
  modules by path ./node_modules/react-dom/ 1000 KiB 3 modules
  modules by path ./node_modules/scheduler/ 17.3 KiB
    ./node_modules/scheduler/index.js 198 bytes **[built] [code generated]**
    ./node_modules/scheduler/cjs/scheduler.development.js 17.1 KiB **[built] [code generated]**
  ./node_modules/ansi-html-community/index.js 4.16 KiB **[built] [code generated]**
  ./node_modules/events/events.js 14.5 KiB [built] [code generated]
modules by path ./src/*.tsx 512 bytes
  ./src/index.tsx 275 bytes **[built] [code generated]**
  ./src/App.tsx 237 bytes **[built] [code generated]**
webpack 5.89.0 compiled **successfully** in 2818 ms
```

위와 같이 ‘`webpack 5.89.0 compiled **successfully**`’가 보이면 컴파일이 완료되면서 아래와 같은 화면이 출력된다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c84d6d26-27db-41c4-97d3-b4249a4824d1/80895359-e8fc-4dc0-a7ef-c91314ae1a0e/Untitled.png)

그럼 무사히 Webpack으로 React 적용이 완료된 것이다. Let’s Coding!
