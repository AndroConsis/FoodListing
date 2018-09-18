import React, { PureComponent } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import TimerMixin from 'react-timer-mixin';

export default class LoopReviews extends PureComponent {
    currentIndex = 1;
    state = { review: "" }
    interval = null;

    startTimer = () => {
        this.interval = setInterval(() => {
            this.increaseCount();
        }, 5000)
    }

    componentDidMount() {
        this.startTimer()
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    increaseCount = () => {
        if (this.currentIndex + 1 == this.props.reviews.length) { this.currentIndex = 0 }
        else { this.currentIndex = this.currentIndex + 1; }
        this.setState({ review: this.props.reviews[this.currentIndex].review.review_text });
    }

    render() {
        return <View style={styles.wrapper}>{
            this.state.review ? <Text onPress={this.increaseCount} style={styles.text}>{this.state.review}</Text> : <ActivityIndicator style={{ marginTop: 10, marginRight: 10 }} size="small" />
        }</View>
    }
}

const styles = {
    text: {
        color: "gray"
    },
    wrapper: {
        marginTop: 6,
        borderRadius: 6,
        padding: 10,
        justifyContent: "center",
        alignItems: "flex-start"
    }
}