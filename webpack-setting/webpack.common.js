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
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  // 웹팩 기본 제공에 추가적으로 사용할 수 있는 확장 기능
  module: {
    // 각 파일에 적용할 로더를 설정할 수 있다.
    rules: [
      {
        // 로더를 적용할 파일의 확장자를 정규식으로 표현
        test: /\.(js|jsx|ts|tsx)$/i,
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
