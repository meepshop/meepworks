import React from 'react';
import uuid from './uuid';


/**
 *  @class DataScript
 */
var DataScript = React.createClass({
  render() {
    return <script id={this.props.dataId} type='application/json' dangerouslySetInnerHTML={{
      __html: JSON.stringify(this.props.data)
    }}></script>;
  }
});


var LoaderScript = React.createClass({
  render () {
    var dataId = this.props.dataId ? `, '${this.props.dataId}'` : '';
    return <script dangerouslySetInnerHTML={{
      __html: `
      System.baseURL = '/';

      System.import('${this.props.config.distPath.external}/lib/client-app-driver') // has to be modified to proper path afterwards
      .then(function (m) {
        new m.default('${this.props.config.distPath.external}/${this.props.config.appPath}', '${this.props.target}'${dataId});
      })
      .catch(function (err) {
        console.log(err);
      });
      `
    }}></script>;
  }
});


export default function * appLoader(config, target, data) {
  var output = [];
  var dataId = 'data-'+ uuid();
  output.push(<DataScript data={data} dataId={dataId}/>);
  output.push(<LoaderScript config={config} target={target} dataId={dataId} />);
  return output;
}


