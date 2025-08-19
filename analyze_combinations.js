import fs from "fs";

// 读取JSON文件
const data = JSON.parse(
  fs.readFileSync("src/assets/outdoor-vibe.json", "utf8")
);

// 统计各个组合的数量
const combinations = {};

Object.values(data).forEach((item) => {
  if (item.strategy) {
    const key = `${item.strategy.style}-${item.strategy.view}-${item.strategy.target}`;
    combinations[key] = (combinations[key] || 0) + 1;
  }
});

// 按组合排序并显示结果
console.log("当前各组合分布情况：");
console.log("格式：风格-视角-目标 = 数量");
console.log("========================");

Object.entries(combinations)
  .sort((a, b) => b[1] - a[1])
  .forEach(([combination, count]) => {
    console.log(`${combination} = ${count}`);
  });

console.log("\n========================");
console.log(`总计：${Object.values(data).length} 条笔记`);
console.log(`覆盖组合：${Object.keys(combinations).length} 种`);

// 检查哪些组合缺失或数量不足
const allPossibleCombinations = [];
const styles = ["保守型", "适中型", "创新型"];
const views = ["精致白领", "户外玩家", "社交达人"];
const targets = ["激发好奇", "深度种草", "号召行动"];

styles.forEach((style) => {
  views.forEach((view) => {
    targets.forEach((target) => {
      allPossibleCombinations.push(`${style}-${view}-${target}`);
    });
  });
});

console.log("\n缺失或数量不足的组合：");
console.log("========================");

allPossibleCombinations.forEach((combo) => {
  const count = combinations[combo] || 0;
  if (count < 20) {
    console.log(`${combo} = ${count} (需要补充 ${20 - count} 条)`);
  }
});

let total = 0;
allPossibleCombinations.forEach((combo) => {
  const count = combinations[combo] || 0;
  total += 20 - count;
});

console.log("总计需要补充", total, "条");
