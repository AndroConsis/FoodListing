import React, { PureComponent } from "react";
import { View, Text } from 'react-native';

export default class Cuisines extends PureComponent {

    render() {
        return <View style={{
            flexDirection: "row",
            position: "absolute",
            flexWrap: 'wrap',
            bottom: 20,
            left: 20,
            right: 10
        }}>
            {this.props.cuisines.map((item, i) => {
                return <View
                    key={i}
                    style={{
                        borderRadius: 6,
                        padding: 4,
                        paddingLeft: 5,
                        paddingRight: 5,
                        backgroundColor: "#ededed",
                        marginRight: 10,
                        marginBottom: 6
                    }}><Text style={{ color: "gray" }}>{item}</Text></View>
            })
            }</View>
    }
}