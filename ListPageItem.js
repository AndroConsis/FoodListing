import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

export default class ListPageItem extends Component {
    render() {
        const { title, description, imageUrl } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 4 }}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                    <Text style={{fontSize: 20}}>{title}</Text>
                    <Text style={{marginTop: 3, color: "gray"}} >{description}</Text>
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
    }
}