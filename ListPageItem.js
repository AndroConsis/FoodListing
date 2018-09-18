import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { getReviews } from "./Zomato"
import LoopReviews from "./LoopReviews";
import Cuisines from "./Cuisines";

export default class ListPageItem extends Component {
    state = {
        userReviews: []
    }

    componentDidMount() {
        getReviews(this.props.resId).then(response => {
            this.setState({userReviews: response.user_reviews})
        })
    }

    render() {
        const { title, description, imageUrl, aggregateRating, ratingColor, averageCost, cuisines } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 4 }}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                    <View style={[styles.badge, {backgroundColor: "tomato"}]}>
                        <Text style={{color: "white", fontSize: 16, fontWeight: "bold"}}>{aggregateRating}</Text>
                    </View>
                </View>
                <View style={{ flex: 2, padding: 10 }}>
                    <Text style={{fontSize: 20}}>{title}</Text>
                    <Text style={{fontSize: 12, marginTop: 3, color: "gray"}} >{description}</Text>
                    <Text style={{color: "rebeccapurple", marginTop: 6}}>₹{ averageCost } for two people (approx.)</Text>
                    <LoopReviews reviews={this.state.userReviews}/>
                    <Cuisines cuisines={cuisines.split(", ")}/>
                </View>
            </View>
        );
    }
}

const styles = {
    image: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover",
        backgroundColor: "lightgray"
    },
    badge: {
        position: "absolute",
        bottom: 10,
        right: 10,
        padding: 6,
        height: 40,
        width: 40,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        shadowRadius: 10,
        shadowOffset: ({width: 3, height: 3}),
        shadowOpacity: .3
    }
}