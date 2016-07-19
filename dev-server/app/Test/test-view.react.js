import React from 'react'
import Component from '../../../source/component'

export default class TestView extends Component {
  componentDidMount() {
    console.log('component mounted !')
  }

  render() {
    return (
      <div>
        This is TestViewer
      </div>
    )
  }
}
