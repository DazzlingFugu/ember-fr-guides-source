/* eslint-env node */
import { unified } from "unified";
import remarkRetext from "remark-retext"; 

import retextLatin from "retext-latin";
import retextRepeatedWords from "retext-repeated-words";
import retextSyntaxUrls from "retext-syntax-urls";
import retextSpell from "retext-spell";
import remarkMessageControl from 'remark-message-control';

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
        })
        .use(remarkMessageControl, {
          name: 'spell',
          sources: ['retext-spell']
        })
    ],
    "remark-preset-lint-consistent",
    "remark-preset-lint-recommended",
    ["remark-lint-list-item-indent", "space"],
    ["remark-lint-list-item-bullet-indent", false],
    ["remark-lint-code-block-style", false],
  ]
};

export default remarkConfig;
