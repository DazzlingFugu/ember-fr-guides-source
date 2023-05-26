import config from 'ember-fr-guides-source/config/environment';

export function initialize(applicationInstance) {
  let guidemakerService = applicationInstance.lookup('service:guidemaker');
  guidemakerService.reopen({
    host: config.guidemaker.host,
  });
}

export default {
  initialize,
};
