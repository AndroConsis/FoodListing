/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  StatusBar
} from "react-native";
import { getCategories } from "./Zomato";
import ListPageItem from "./ListPageItem";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const articles = [
  // { id: "1", uri: require("./assets/1.jpg") },
  // { id: "2", uri: require("./assets/2.jpg") },
  // { id: "3", uri: require("./assets/3.jpg") },
  // { id: "4", uri: require("./assets/4.jpg") },
  // { id: "5", uri: require("./assets/5.jpg") },
  // { id: "6", uri: require("./assets/6.jpg") }
];

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua.Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Utenim ad minim veniam, quis nostrud exercitation ullamco laborisnisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiatnulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.swipedCardPosition = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT });
    this.topViewPosition = new Animated.ValueXY();
    this.scale = new Animated.Value(0.9);
    this.state = {
      currentIndex: 0,
      articles: []
    };
  }

  componentDidMount() {
    getCategories().then(res => {
      this.setState({ articles: res.collections })
    })
  }

  componentWillMount() {
    const { articles } = this.state;

    this.topPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        console.log(gestureState);
        this.topViewPosition.setValue({x: gestureState.dx});
      },
      onPanResponderRelease: () => {

      }
    })

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 && this.state.currentIndex > 0) {
          this.swipedCardPosition.setValue({
            x: 0,
            y: -SCREEN_HEIGHT + gestureState.dy
          });
        }
        else {
          this.position.setValue({ y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (
          this.state.currentIndex > 0 &&
          gestureState.dy > 50 &&
          gestureState.vy > 0.5
        ) {
          Animated.timing(this.swipedCardPosition, {
            toValue: { x: 0, y: 0 },
            duration: 400
          }).start(() => {
            this.setState({
              currentIndex: this.state.currentIndex - 1
            });
            this.swipedCardPosition.setValue({ x: 0, y: -SCREEN_HEIGHT });
          });
        } else if (
          -gestureState.dy > 50 &&
          -gestureState.vy > 0.5 &&
          this.state.currentIndex !== articles.length - 1
        ) {
          Animated.timing(this.position, {
            toValue: { x: 0, y: -SCREEN_HEIGHT },
            duration: 400
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 });
            this.position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.parallel([
            Animated.spring(this.position, {
              toValue: { x: 0, y: 0 },
              bounciness: 2
            }),
            Animated.spring(this.swipedCardPosition, {
              toValue: { x: 0, y: -SCREEN_HEIGHT },
              bounciness: 2
            })
          ]).start();
        }
      }
    });
  }

  renderarticles = () => {
    const { articles } = this.state;
    const nextCardAnimation = {
      transform: [
        {
          scale: this.position.y.interpolate({
            inputRange: [-SCREEN_HEIGHT, 0, 200],
            outputRange: [1, 0.85, 0.85],
            extrapolate: "clamp"
          })
        }
      ],
      opacity: this.position.y.interpolate({
        inputRange: [(-SCREEN_HEIGHT / 2) * 0.7, 0, 200],
        outputRange: [1, 0.7, 0.7],
        extrapolate: "clamp"
      })
    };

    const currentCardAnimation = {
      transform: [
        {
          scale: this.swipedCardPosition.y.interpolate({
            inputRange: [-SCREEN_HEIGHT, 0, 200],
            outputRange: [1, 0.85, 0.85],
            extrapolate: "clamp"
          })
        }
      ],
      opacity: this.swipedCardPosition.y.interpolate({
        inputRange: [(-SCREEN_HEIGHT / 2) * 0.7, 0, 200],
        outputRange: [1, 0.7, 0.7],
        extrapolate: "clamp"
      })
    };

    return articles.map((item, i) => {
      if (i == this.state.currentIndex - 1) {
        return (
          <Animated.View
            key={item.collection.collection_id}
            style={this.swipedCardPosition.getLayout()}
            {...this.panResponder.panHandlers}
          >
            <View style={styles.page}>
              <ListPageItem
                title={item.collection.title}
                description={item.collection.description}
                imageUrl={articles[i].collection.image_url}></ListPageItem>
            </View>
          </Animated.View>
        );
      } else if (i < this.state.currentIndex) {
        return null;
      }

      if (i == this.state.currentIndex) {
        return (
          <Animated.View
            key={item.collection.collection_id}
            style={this.position.getLayout()}
            {...this.panResponder.panHandlers}
          >
            <Animated.View style={[styles.page, currentCardAnimation]}>
              <ListPageItem
                title={item.collection.title}
                description={item.collection.description}
                imageUrl={articles[i].collection.image_url}></ListPageItem>
            </Animated.View>
          </Animated.View>
        );
      }

      if (i == this.state.currentIndex + 1) {
        return (
          <Animated.View key={item.id}
            key={item.collection.collection_id}
          >
            <Animated.View style={[styles.page, nextCardAnimation]}>
              <ListPageItem
                title={item.collection.title}
                description={item.collection.description}
                imageUrl={articles[i].collection.image_url}></ListPageItem>
            </Animated.View>
          </Animated.View>
        );
      } else {
        return null;
      }
    }).reverse();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <Animated.View
          {...this.topPanResponder.panHandlers}
          style={this.topViewPosition.getLayout()}
        >
          {this.renderarticles()}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  page: {
    flex: 1,
    position: "absolute",
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden"
  }
});