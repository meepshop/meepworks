import React from 'react';
import uuid from './uuid';
import dedent from './dedent';


/**
 *  @class DataScript
 */
let DataScript = React.createClass({
  render() {
    return <script id={this.props.dataId} type='application/json' dangerouslySetInnerHTML={{
      __html: JSON.stringify(this.props.data)
    }}></script>;
  }
});

let LoaderScript = React.createClass({
  render () {
    let dataId = this.props.dataId ? `, '${this.props.dataId}'` : '';
    let p = this.props.config.localtest ? 'dist' : 'meepworks';

    return <script dangerouslySetInnerHTML={{
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
          return fetch.call(this, load);
        };

        System.import('${p}/client-app-driver')
        .then(function (m) {
          new m('${this.props.config.distPath.external}/${this.props.config.appPath}', '${this.props.target}'${dataId});
        })
        .catch(console.log);
      })();`
    }}></script>;
  }
});

export default function * appLoader(config, target, data) {
  let output = [];
  let dataId = 'data-'+ uuid();
  output.push(<DataScript data={data} dataId={dataId}/>);
  output.push(<LoaderScript config={config} target={target} dataId={dataId} />);
  return output;
}


