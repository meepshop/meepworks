import React from 'react'
import { Component } from '../../../source'
import Link from '../../../source/internal/component/link'

export default class TestView extends Component {

  componentDidMount() {
    console.log('component mounted !')
  }

  render() {
    return (
      <div>
        <Link to='/'>Meepshop Meepworks Framework</Link>
        <div>
          This is TestViewer
          <Link to='admin'>Link to Admin</Link>
        </div>
        { this.props.children }
      </div>
    )
  }
}
