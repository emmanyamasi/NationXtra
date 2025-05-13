// HomeScreen.tsx
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/assets/themes/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const MenuIcon = ({ color, size = 22 }: { color: string; size?: number }) => {
  const lineHeight = 1.5;
  const lineWidth = size * 0.8;
  const gap = size / 4;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'flex-start' }}>
      <View style={{ height: lineHeight, width: lineWidth, backgroundColor: color, borderRadius: 0.75 }} />
      <View style={{ height: lineHeight, width: lineWidth, backgroundColor: color, marginTop: gap, borderRadius: 0.75 }} />
      <View style={{ height: lineHeight, width: lineWidth, backgroundColor: color, marginTop: gap, borderRadius: 0.75 }} />
    </View>
  );
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(123);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [likesAnim] = useState(new Animated.Value(1));
  const [activeTab, setActiveTab] = useState('home');

  const toggleLike = () => {
    Animated.sequence([
      Animated.timing(likesAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(likesAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
    setLiked(prev => !prev);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out NationXtra – Made of Africa for Africa!',
        url: 'https://nationxtra.example.com',
        title: 'NationXtra',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const submitComment = () => {
    if (comment.trim()) {
      Alert.alert('Comment Submitted', comment);
      setComment('');
      setModalVisible(false);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'add') {
      Alert.alert('Create Post', 'Create post functionality coming soon!');
    } else if (tabName === 'search') {
      setSearchModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>      
      <View style={styles.contentContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton}>
            <MenuIcon color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.logoGroup}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.textGroup}>
              <Text style={[styles.logoText, { color: theme.colors.text }]}>NationXtra</Text>
              <Text style={[styles.tagline, { color: theme.colors.text }]}>Made of Africa for Africa</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={() => setSearchModalVisible(true)}
          >
            <FontAwesome name="search" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.mainContent}>
          <Text style={{ color: theme.colors.text, fontFamily: 'Inter-Bold' }}>
            Welcome to NationXtra
          </Text>
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={toggleLike}>
            <Animated.View style={{ transform: [{ scale: likesAnim }] }}>
              <FontAwesome name="heart" size={32} color={liked ? 'red' : 'gray'} />
            </Animated.View>
            <Text style={styles.socialText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="comment-text-outline" size={32} color="#000" />
            <Text style={styles.socialText}>45</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleShare}>
            <FontAwesome name="share" size={32} color="#000" />
            <Text style={styles.socialText}>Share</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalView}
          >
            <TextInput
              placeholder="Write your comment..."
              value={comment}
              onChangeText={setComment}
              style={styles.commentInput}
              multiline
            />
            <TouchableOpacity onPress={submitComment} style={styles.submitButton}>
              <Text style={{ color: '#fff' }}>Submit</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
        
        {/* Search Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={searchModalVisible}
          onRequestClose={() => setSearchModalVisible(false)}
        >
          <View style={styles.searchModalContainer}>
            <View style={styles.searchInputContainer}>
              <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                placeholder="Search NationXtra..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    Alert.alert('Search', `Searching for: ${searchQuery}`);
                    setSearchModalVisible(false);
                  }
                }}
              />
              <TouchableOpacity 
                onPress={() => setSearchModalVisible(false)}
                style={styles.closeButton}
              >
                <FontAwesome name="times" size={20} color="#888" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchSuggestions}>
              <Text style={styles.suggestionHeader}>Recent Searches</Text>
              {['African politics', 'Technology startups', 'Pan-African culture'].map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchQuery(item);
                    Alert.alert('Search', `Searching for: ${item}`);
                    setSearchModalVisible(false);
                  }}
                >
                  <FontAwesome name="history" size={16} color="#888" style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))}
              
              <Text style={[styles.suggestionHeader, {marginTop: 20}]}>Trending Topics</Text>
              {['African Unity Day', 'Digital Innovation', 'Cultural Renaissance'].map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchQuery(item);
                    Alert.alert('Search', `Searching for: ${item}`);
                    setSearchModalVisible(false);
                  }}
                >
                  <FontAwesome name="fire" size={16} color="#FF6B6B" style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Bottom Navigation Bar */}
        <View style={[styles.bottomNav, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => handleTabPress('home')}
          >
            <FontAwesome 
              name="home" 
              size={24} 
              color={activeTab === 'home' ? '#2d2d40' : '#888'} 
            />
            <Text style={[
              styles.navText, 
              { color: activeTab === 'home' ? '#2d2d40' : '#888' }
            ]}>
              Home
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => handleTabPress('search')}
          >
            <FontAwesome 
              name="search" 
              size={24} 
              color={activeTab === 'search' ? '#2d2d40' : '#888'} 
            />
            <Text style={[
              styles.navText, 
              { color: activeTab === 'search' ? '#2d2d40' : '#888' }
            ]}>
              Search
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => handleTabPress('add')}
          >
            <View style={styles.addButtonContainer}>
              <View style={styles.addButton}>
                <FontAwesome name="plus" size={22} color="#fff" />
              </View>
            </View>
            <Text style={[
              styles.navText, 
              { color: activeTab === 'add' ? '#2d2d40' : '#888' }
            ]}>
              Add
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => handleTabPress('profile')}
          >
            <FontAwesome 
              name="user" 
              size={24} 
              color={activeTab === 'profile' ? '#2d2d40' : '#888'} 
            />
            <Text style={[
              styles.navText, 
              { color: activeTab === 'profile' ? '#2d2d40' : '#888' }
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, backgroundColor: '#e6e6e1' },
  topBar: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  menuButton: { padding: 6 },
  logoGroup: { flexDirection: 'row', alignItems: 'center', marginLeft: 16, flex: 1 },
  logo: { width: 40, height: 40, borderRadius: 8 },
  textGroup: { marginLeft: 10 },
  logoText: { fontSize: 20, fontFamily: 'Inter-Bold' },
  tagline: { fontSize: 12, fontStyle: 'italic', fontFamily: 'Inter-Regular' },
  divider: { height: 1, backgroundColor: '#ccc' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: { height: 60, width: '100%' },
  gradientBar: { height: '100%', width: '100%', backgroundColor: '#2d2d40' },
  socialButtons: {
    position: 'absolute', right: 16, bottom: 100, justifyContent: 'center', alignItems: 'center',
  },
  socialButton: { alignItems: 'center', marginVertical: 10 },
  socialText: { fontSize: 12, color: '#000', fontFamily: 'Inter-Regular' },
  modalView: {
    position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', padding: 20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 5,
  },
  commentInput: {
    height: 100, borderColor: '#ccc', borderWidth: 1, borderRadius: 10,
    padding: 10, marginBottom: 10, textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2d2d40', padding: 10, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  searchButton: {
    padding: 10,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    padding: 8,
  },
  searchSuggestions: {
    padding: 16,
  },
  suggestionHeader: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    color: '#333',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#444',
  },
  
  // Bottom navigation styles
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  addButtonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2d2d40',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});