/* eslint-env node */
import { unified } from "unified";
import remarkRetext from "remark-retext";

import retextLatin from "retext-latin";
import retextRepeatedWords from "retext-repeated-words";
import retextSyntaxUrls from "retext-syntax-urls";
import retextSpell from "retext-spell";

import dictionaryFr from "dictionary-fr";
import { readFileSync } from 'fs';

const remarkConfig = {
  plugins: [
    [
      remarkRetext,
      unified()
        .use(retextLatin)
        .use(retextRepeatedWords)
        .use(retextSyntaxUrls)
        .use(retextSpell, {
          dictionary: dictionaryFr,
          personal: readFileSync("./.local.dic"),
        }),
    ],
    "remark-preset-lint-consistent",
    "remark-preset-lint-recommended",
    ["remark-lint-list-item-indent", "space"],
    ["remark-lint-list-item-bullet-indent", false],
    ["remark-lint-code-block-style", false],
    ["remark-message-control", { name: 'spell', source: ['retext-spell', 'retext-repeated-words'] }],
  ]
};

export default remarkConfig;
