import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';

interface NotePadProps {
  visible: boolean;
  onClose: () => void;
}

const NotePad: React.FC<NotePadProps> = ({ visible, onClose }) => {
  const [notes, setNotes] = useState([
    { id: 1, text: "Great experience with the games!", date: "May 19, 2025", rating: 5 },
    { id: 2, text: "Customer support was very helpful when I had questions about withdrawal.", date: "May 15, 2025", rating: 4 },
  ]);
  
  const [newNote, setNewNote] = useState('');
  const [rating, setRating] = useState(0);
  
  const handleAddNote = () => {
    if (newNote.trim() === '') return;
    
    const newNoteObj = {
      id: notes.length + 1,
      text: newNote,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      rating: rating
    };
    
    setNotes([newNoteObj, ...notes]);
    setNewNote('');
    setRating(0);
  };
  
  const renderStars = (count: number, totalStars = 5) => {
    return Array(totalStars).fill(0).map((_, i) => (
      <TouchableOpacity 
        key={i} 
        onPress={() => setRating(i + 1)}
        style={{ marginRight: 5 }}
      >
        {i < count ? (
          <Text style={{ fontSize: 20, color: '#FFD700' }}>★</Text>
        ) : (
          <Text style={{ fontSize: 20, color: '#aaa' }}>☆</Text>
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.notepadContainer}>
          <View style={styles.notepadHeader}>
            <Text style={styles.headerTitle}>Customer Reviews</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 22, color: '#fff' }}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.noteInputContainer}
          >
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Your Rating:</Text>
              <View style={styles.starsContainer}>
                {renderStars(rating)}
              </View>
            </View>
            
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.noteInput}
                multiline
                placeholder="Write your review here..."
                placeholderTextColor="#999"
                value={newNote}
                onChangeText={setNewNote}
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleAddNote}
                disabled={newNote.trim() === ''}
              >
                <Text style={{ 
                  fontSize: 18, 
                  color: newNote.trim() === '' ? "#aaa" : "#4CAF50"
                }}>📨</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          
          <ScrollView style={styles.notesContainer}>
            {notes.map(note => (
              <View key={note.id} style={styles.noteItem}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteDate}>{note.date}</Text>
                  <View style={styles.noteRating}>
                    {renderStars(note.rating)}
                  </View>
                </View>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notepadContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  notepadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#8B4513',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  noteInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
  notesContainer: {
    flex: 1,
    padding: 10,
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  noteRating: {
    flexDirection: 'row',
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
});

export default NotePad;