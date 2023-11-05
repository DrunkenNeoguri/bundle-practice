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
