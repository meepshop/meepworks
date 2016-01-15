import React, { Component } from 'react';
import uuid from 'uuid';
import dedent from 'greasebox/dedent';
import htmlEscape from 'html-escape';
import transit from 'transit-immutable-js';



/**
 *  @class Data
 *  @description Component for rendering data to be sent to client side.
 */
class Data extends Component {
  render() {
    //convert data to base64 string avoid html injection
    let res = htmlEscape(transit.toJSON(this.props.data));
    return (
      <script
        id={this.props.dataId}
        type='application/json'
        dangerouslySetInnerHTML={{
          __html: res
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
    return (
      <script dangerouslySetInnerHTML={{
        __html: dedent`
        (function () {
          System.meepworks = {
          appVersion: '${this.props.version}',
          jspmPath: '${this.props.jspmPath}'
          };

          var fetch = System.fetch;
          System.fetch = function (load) {
            if(load.address.indexOf(System.meepworks.jspmPath) === -1) {
              load.address += System.meepworks.appVersion;
            }
            var result = fetch.call(this, load);
            return result;
          };
          System.import('meepworks/client-router')
          .then(function (ClientRouter) {
            var router = new ClientRouter('${this.props.appUrl}', '${this.props.dataId}', ${this.props.clientRender});
          })
          .catch(console.log);
        })();`
      }} />
    );
  }
}

export default function bootstrap(data) {

  let appUrl = this.appPath.replace(this.publicPath, this.publicUrl);
  let jsVer = this.version ? `?${this.version}` : '';
   let output = [
     <script key="sys" src={ `/${this.jspmPath}/system.js${jsVer}` }></script>,
     <script key="config" src={ `/${this.jspmConfig}${jsVer}` }></script>
   ];
   let dataId = 'data-' + uuid();
   output.push(<Data data={data} dataId={dataId} />);
   output.push(
     <Loader
       dataId={dataId}
       version={jsVer}
       jspmPath={this.jspmPath}
       appUrl={appUrl}
       clientRender={this.clientRender}
     />
   );

   return output;
}

/*
 *export default function bootstrap(target, data) {
 *  let jsVer = this.config.version ? `?${this.config.version}` : '';
 *  let output = [
 *    <script key="sys" src={ `/${this.config.jspm.path}/system.js${jsVer}` }></script>,
 *    <script key="config" src={ `/${this.config.jspm.config}${jsVer}` }></script>
 *  ];
 *  let dataId = 'data-'+ uuid();
 *  output.push(<Data data={data} dataId={dataId}/>);
 *  output.push(<Loader config={this.config} target={target} dataId={dataId} />);
 *  return output;
 *}
 */


