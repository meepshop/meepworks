import React, {Component} from 'react';
import uuid from 'uuid';
import dedent from 'greasebox/dedent';



/**
 *  @class Data
 *  @description Component for rendering data to be sent to client side.
 */
class Data extends Component {
  render() {
    //convert data to base64 string avoid html injection
    return (
      <script
        id={this.props.dataId}
        type='application/json'
        dangerouslySetInnerHTML={{
          __html: (new Buffer(JSON.stringify(this.props.data))).toString('base64')
        }}
      />
    );

  }
}
/**
 * @class Loader
 * @description Script that loads the framework and starts the application.
 */
class Loader extends Component {
  render () {
    let dataId = this.props.dataId ? `, '${this.props.dataId}'` : '';
    let p = this.props.config.localtest ? 'build' : 'meepworks';

    return (
      <script dangerouslySetInnerHTML={{
        __html: dedent`
        (function () {
          System.baseURL = '/';
          System.meepworks = {
          appVersion: '${this.props.config.version ? `?${this.props.config.version}` : ''}',
          jspmPath: '${this.props.config.jspm.path}'
          };

          var fetch = System.fetch;
          System.fetch = function (load) {
            if(load.address.indexOf(System.meepworks.jspmPath) === -1) {
              load.address += System.meepworks.appVersion;
            }
            var result = fetch.call(this, load);
            return result;
          };
          System.import('${p}/client-app-driver')
          .then(function (m) {
            new m('${this.props.config.buildURL}/${this.props.config.appPath}', '${this.props.target}'${dataId});
          })
          .catch(console.log);
        }());`
      }} />
    );
  }
}

export default function bootstrap(target, data) {
  let jsVer = this.config.version ? `?${this.config.version}` : '';
  let output = [
    <script key="sys" src={ `/${this.config.jspm.path}/system.js${jsVer}` }></script>,
    <script key="config" src={ `/${this.config.jspm.config}${jsVer}` }></script>
  ];
  let dataId = 'data-'+ uuid();
  output.push(<Data data={data} dataId={dataId}/>);
  output.push(<Loader config={this.config} target={target} dataId={dataId} />);
  return output;
}


