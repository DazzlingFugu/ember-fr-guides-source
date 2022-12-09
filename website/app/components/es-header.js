import Component from 'ember-styleguide/components/es-header';
import { action, set } from '@ember/object';

const defautHomePage = 'https://www.emberjs.com';

export default class EsHeaderComponent extends Component {
  expanded = false;

  get navHome() {
    return this?.args?.home ?? defautHomePage;
  }

  @action
  onTogglerClick() {
    set(this, 'expanded', !this.expanded);
  }
}
