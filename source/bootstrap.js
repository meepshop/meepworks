import React, { Component } from 'react';
import uuid from 'uuid';
import dedent from 'greasebox/dedent';
import htmlEscape from 'html-escape';



/**
 *  @class Data
 *  @description Component for rendering data to be sent to client side.
 */
class Data extends Component {
  render() {
    //convert data to base64 string avoid html injection
    //let res = new Buffer(JSON.stringify(this.props.data)).toString('base64');
    let res = htmlEscape(JSON.stringify(this.props.data));
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
    let p = this.props.meepdev ? 'build' : 'meepworks';

    return (
      <script dangerouslySetInnerHTML={{
        __html: dedent`
        (function () {
          System.baseURL = '/';
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
        //  System.import('${p}/client-router')
        //  .then(function (ClientRouter) {
        //    var router = new ClientRouter('${this.props.appURL}', '${this.props.dataId}');
        //  })
        //  .catch(console.log);
        })();`
      }} />
    );
  }
}

export default function bootstrap(appURL, data) {
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
       appURL={appURL}
       meepdev={this.meepdev}
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


