import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export const AccordionSection = ({ title, children, isCollapsed, toggle }) => (
  <View style={styles.accordionContainer}>
    <TouchableOpacity onPress={toggle} style={styles.accordionHeader}>
      <Text style={styles.accordionHeaderText}>{title}</Text>
    </TouchableOpacity>
    {!isCollapsed && (
      <View style={styles.accordionContent}>
        {children}
      </View>
    )}
  </View>
);


const styles = StyleSheet.create({ 
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  accordionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  accordionHeaderText: {
    fontWeight: 'bold',
    fontSize: 16 
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#fff' ,
    flexDirection: "column",
    alignContent: 'space-between'
  }, 
});



