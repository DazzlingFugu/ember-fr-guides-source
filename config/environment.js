'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'ember-fr-guides-source',
    environment,
    rootURL: '/',
    locationType: 'trailing-history',
    historySupportMiddleware: true,

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-meta': {
      description: 'Ember.js helps developers be more productive out of the box. Designed with developer ergonomics in mind, its friendly APIs help you get your job done—fast.'
    },

    guidemaker: {
      title: 'Guide Ember.js 🇫🇷',
      logo: '/images/ember-fr-logo.svg',
      description: 'Le Guide Ember.js traduit en Français',
      host: {
        name: 'Netlify',
        site: 'https://app.netlify.com',
      },
      social: {
        github: 'DazzlingFugu/ember-fr-guides-source',
        discordLink: 'https://discord.com/channels/480462759797063690/486235962700201984'
      },
      sourceRepo: 'https://github.com/DazzlingFugu/ember-fr-guides-source',
      texts: {
        searchInputPlaceholder: 'Rechercher dans le Guide',
        searchResultsPlaceholder: 'Résultats de la recherche',
        currentChapter: 'Nous avons couvert',
        nextChapter: 'Chapitre suivant',
      },
    },

    algolia: {
      algoliaId: 'E44SKR9ZB0', 
      algoliaKey: '74120f5066e6f82be903407a9883b44e', 
      indexName: 'ember_french_guides'
    },

    showdown: {
      ghCompatibleHeaderId: true,
      prefixHeaderId: 'toc_'
    },

    deprecationsGuideURL: 'https://www.emberjs.com/deprecations/',
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
