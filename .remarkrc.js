const unified = require("unified");
const read = require("fs").readFileSync;
const dictionaryFr = require("dictionary-fr");

exports.plugins = [
  [
    require("remark-retext"),
    unified().use({
      plugins: [
        require("retext-latin"),
        require("retext-repeated-words"),
        require("retext-syntax-urls"),
        [
          require("retext-spell"),
          {
            dictionary: dictionaryFr,
            personal: read("./.local.dic"),
          },
        ],
      ],
    }),
  ],
  "remark-preset-lint-consistent",
  "remark-preset-lint-recommended",
  ["remark-lint-list-item-indent", "space"],
  ["remark-lint-list-item-bullet-indent", false],
  ["remark-lint-code-block-style", false],
];
