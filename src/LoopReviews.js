import React, { PureComponent } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getReviews } from "./Zomato"

export default class LoopReviews extends PureComponent {
    currentIndex = 0;
    state = { review: "", reviews: [] }
    interval = null;

    componentDidMount() {
        getReviews(this.props.resId).then(response => {
            if (response["user_reviews"] && response["user_reviews"].length > 0) {
                this.setState({ reviews: [...response.user_reviews] })
                this.startTimer();
            }
        })
    }

    startTimer = () => {
        this.interval = setInterval(() => {
            this.increaseCount();
        }, 5000)
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    increaseCount = () => {
        if (this.currentIndex + 1 == this.state.reviews.length) { this.currentIndex = 0 }
        else {
            this.currentIndex = this.currentIndex + 1;
            if (this.state.reviews[this.currentIndex]["review"] && this.state.reviews[this.currentIndex]["review"]["review_text"])
                this.setState({ review: this.state.reviews[this.currentIndex].review.review_text });
        }
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