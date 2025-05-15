//VideoFeedScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';

import { fetchYouTubeResults } from '@/utils/youtubeAPI';
import { useTheme } from '../src/assets/themes/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoItem {
  videoId: string;
  title: string;
  duration: string;
  url: string;
}

export default function VideoFeedScreen() {
  const { theme } = useTheme();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const likesAnims = useRef<{ [key: string]: Animated.Value }>({});
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchYouTubeResults();
      setVideos(data);
      
      // Initialize like counts with random numbers
      const initialLikeCounts: { [key: string]: number } = {};
      data.forEach((video: VideoItem) => {
        initialLikeCounts[video.videoId] = Math.floor(Math.random() * 1000) + 100;
        likesAnims.current[video.videoId] = new Animated.Value(1);
      });
      setLikeCounts(initialLikeCounts);
    } catch (error) {
      console.error('Error loading videos:', error);
      Alert.alert('Error', 'Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (video: VideoItem) => {
    try {
      await Share.share({
        message: `Check out this video: ${video.title}\n\nWatch it here: ${video.url}`,
        url: video.url,
        title: video.title,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const toggleLike = (videoId: string) => {
    // Animate heart icon
    Animated.sequence([
      Animated.timing(likesAnims.current[videoId], {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(likesAnims.current[videoId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // Update like state and count
    setLikedVideos(prev => {
      const newState = { ...prev, [videoId]: !prev[videoId] };
      return newState;
    });

    setLikeCounts(prev => {
      const increment = likedVideos[videoId] ? -1 : 1;
      return { ...prev, [videoId]: prev[videoId] + increment };
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index as number);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const renderVideo = ({ item, index }: { item: VideoItem; index: number }) => {
    const isLiked = likedVideos[item.videoId] || false;
    const likeCount = likeCounts[item.videoId] || 0;
    const isVisible = index === currentIndex;

    return (
      <View style={styles.videoContainer}>
        <WebView
          source={{
            uri: `https://www.youtube.com/embed/${item.videoId}?autoplay=${isVisible ? '1' : '0'}&controls=0&showinfo=0&modestbranding=1&loop=1&playlist=${item.videoId}&mute=${isVisible ? '0' : '1'}`
          }}
          style={styles.video}
          allowsFullscreenVideo={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
          mediaPlaybackRequiresUserAction={false}
        />
        
        {/* Video Info */}
        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        {/* Social Buttons */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={() => toggleLike(item.videoId)}>
            <Animated.View style={{ transform: [{ scale: likesAnims.current[item.videoId] }] }}>
              <FontAwesome name="heart" size={32} color={isLiked ? 'red' : 'white'} />
            </Animated.View>
            <Text style={styles.socialText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="comment-text-outline" size={32} color="white" />
            <Text style={styles.socialText}>{Math.floor(Math.random() * 100) + 1}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => handleShare(item)}>
            <FontAwesome name="share" size={32} color="white" />
            <Text style={styles.socialText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 16 }}>Loading videos...</Text>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>No videos found</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadVideos}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.videoId}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {/* App Logo Overlay */}
      <View style={styles.logoOverlay}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>NationXtra</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 70,
    padding: 10,
  },
  videoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'Inter-Bold',
  },
  socialButtons: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  socialText: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2d2d40',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoOverlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});