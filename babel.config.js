module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo' ],
		plugins: [
			//'react-native-worklets/plugin',
			 'react-native-reanimated/plugin', // يجب أن يكون آخر واحد
			 // ,'module:metro-react-native-babel-preset'
			// Required for expo-router 			
			//'react-native-reanimated/plugin',
			// 'react-native-paper/babel' 
			// "react-native-reanimated": "~4.1.1",
			// npx expo install react-native-worklets@0.5.1
		]
	};
};