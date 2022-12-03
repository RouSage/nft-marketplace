module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js|jsx)": (filenames) => [
    `npx eslint ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],
};
