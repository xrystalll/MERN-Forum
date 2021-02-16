import React, { Component } from 'react';
import { Card } from 'components/Card';

import { NEW_ANSWER } from 'support/Subscriptions';

class Answers extends Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: NEW_ANSWER,
      variables: { threadId: this.props.thread.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev

        return {
          getAnswers: [
            ...prev.getAnswers,
            subscriptionData.data.newAnswer
          ]
        }
      }
    })
  }

  render() {
    const { answers, thread } = this.props

    return (
      answers.map(item => (
        <Card key={item.id} data={item} threadData={thread} full type="answer" />
      ))
    )
  }
}

export default Answers;
