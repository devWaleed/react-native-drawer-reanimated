## React Native Drawer using Reanimated v2

A simple react native drawer component using reanimated v2.

### Installation

```
yarn add react-native-drawer-reanimated
```

### Usage

```
<Drawer
	content={() => (
		<View>
			<Text>Drawer content here</Text>
		</View>
	)}>
	<View>
		<Text>Your screen components here</Text>
	</View>
</Drawer>
```

### Props

```
Drawer.defaultProps = {
  content: () => {}, // Define content of left drawer panel
  width: screenWidth * 0.8, // Width of the drawer
  dragStartThreshold: 20, // Start positive drag touched in this threshold area
  minimumOpenThreshold: 0.4, // If drawer is opened 40% and touch is stopped, it will open dawer to full width
  minimumCloseThreshold: 0.8, // If 80% of the width is touched in closing action and touch is stopped, it will close drawer
  overlayBackgroundColor: '#000', // Overlay background color
  overlayMaxOpacity: 0.5, // Overlay max opacity
  enabled: true, // To enable disable drawer conditionally
};

```

### Known Issues:

1. If positive movement is done anywhere on screen, it will open drawer regardless of dragStartThreshold
2. zindex sometimes messes with other elements
3. Shows below navigation bar

### Contributions

This is my first attempt with react-native-reanimated. I am open to pull requests, suggestions and improvements. This project is under MIT license.
