/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { getRestaurents } from "./src/Zomato";
import ListPageItem from "./src/ListPageItem";
console.disableYellowBox = true;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.swipedCardPosition = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT });
    this.topViewPosition = new Animated.ValueXY();
    this.scale = new Animated.Value(0.9);
    this.state = {
      currentIndex: 0,
      articles: [],
      isLoading: true
    };
    this.nextCardAnimation = {
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
        inputRange: [-SCREEN_HEIGHT, 0, 200],
        outputRange: [1, 0, 0],
        extrapolate: "clamp"
      })
    };

    this.currentCardAnimation = {
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
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getRestaurents(position.coords.latitude, position.coords.longitude).then(res => {
          this.setState({ isLoading: false, articles: res.restaurants })
        }).catch(error => alert(JSON.stringify(error)))
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    return;
  }

  componentWillMount() {
    const { articles } = this.state;

    this.topPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.topViewPosition.setValue({ x: gestureState.dx });
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
          (gestureState.dy > 50 ||
          gestureState.vy > 0.5)
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
          (-gestureState.dy > SCREEN_HEIGHT * .3 ||
          -gestureState.vy > 0.5) &&
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
            Animated.timing(this.position, {
              toValue: { x: 0, y: 0 },
            }),
            Animated.timing(this.swipedCardPosition, {
              toValue: { x: 0, y: -SCREEN_HEIGHT },
            })
          ]).start();
        }
      }
    });
  }

  renderPage = (item, i) => {
    const { articles } = this.state;
    const addr = item.restaurant.location.address;
    const addrArr = addr.split(",");
    addrArr.pop();
    addrArr.pop();
    return (
      <ListPageItem
        title={item.restaurant.name}
        description={addrArr.toString()}
        imageUrl={item.restaurant.featured_image}
        aggregateRating={item.restaurant.user_rating.aggregate_rating}
        ratingColor={item.restaurant.user_rating.rating_color}
        averageCost={item.restaurant.average_cost_for_two}
        resId={item.restaurant.R.res_id}
        cuisines={item.restaurant.cuisines}
      />
    )
  }

  renderarticles = () => {
    const { articles, isLoading } = this.state;

    if (isLoading) {
      return <View style={styles.spinner}>
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    }

    return articles.map((item, i) => {
      if (i == this.state.currentIndex - 1) {
        return (
          <Animated.View
            key={i}
            style={this.swipedCardPosition.getLayout()}
            {...this.panResponder.panHandlers}
          >
            <View style={styles.page}>
              {this.renderPage(item, i)}
            </View>
          </Animated.View>
        );
      } else if (i < this.state.currentIndex) {
        return null;
      }

      if (i == this.state.currentIndex) {
        return (
          <Animated.View
            key={i}
            style={this.position.getLayout()}
            {...this.panResponder.panHandlers}
          >
            <Animated.View style={[styles.page, this.currentCardAnimation]}>
              {this.renderPage(item, i)}
            </Animated.View>
          </Animated.View>
        );
      }

      if (i == this.state.currentIndex + 1) {
        return (
          <Animated.View key={item.id}
            key={i}
          >
            <Animated.View style={[styles.page, this.nextCardAnimation]}>
              {this.renderPage(item, i)}
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
    backgroundColor: "rgba(0, 0, 0, .92)",
  },
  spinner: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  page: {
    flex: 1,
    position: "absolute",
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "white",
    borderRadius: 10,
  }
});