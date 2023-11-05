const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // eval로 설정하면 모든 코드를 eval을 통해 묶어서 코드를 압축함.
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
