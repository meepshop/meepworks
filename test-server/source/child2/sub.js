import Application from 'meepworks/application';
import sleep from 'greasebox/sleep';

export default class Child2 extends Application {
  get path() {
    return ':child';
  }
  get component() {
    return './sub-view';
  }
  get locale() {
    return {
      path: '../locale',
      locales: [
        'en_US'
      ]
    }
  }
  title() {
    return 'meepworks/sub';
  }
  get dirname() {
    return __dirname;
  }
  async onEnter(nextState) {
    console.log('@enter2');
    console.log(nextState.location.params);

    await sleep(300);
  }
  onLeave() {
    //console.log('onLeave');
  }
  routerWillLeave() {
    //console.log('routerWillLeave');
  }
}
