import { StyleSheet } from "react-native";
import theme from "../config/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.surface,
  },

  backgroundGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "90%",
    maxWidth: 500
  },
  taskCard: {
    marginVertical: 8,
    elevation: 3,
    borderRadius: 60,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center'
    
  },

  chipContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  
  chip: {
    borderRadius: 30,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  addButton: {
    marginLeft: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    marginBottom: 10
  },
  
  checkboxText: {
    flex: 1,
    color: theme.colors.onBackground,
    marginLeft: 8,
  },

  headerContainer: {
    width: "100%",
    maxWidth: 480,
    marginHorizontal: 20,
    alignItems: "flex-start",
    marginTop: 50,
  },
  
  button: {
    marginTop: 10,
  },
  
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },

  appbar: {
    backgroundColor: theme.colors.surface,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 56, 
    zIndex: 10, 
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.onPrimaryContainer,
    marginBottom: 12,
  },

  text: {
    color: theme.colors.onBackground,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },

  input: {
    marginBottom: 10,
    width: "100%",
    maxWidth: 500,
    backgroundColor: theme.colors.elevation.level1,
    elevation: 3, 
  },

  primaryButton: {
    width: "90%",
    maxWidth: 100,
    borderRadius: 30,
    paddingVertical: 8,
    elevation: 3,
    backgroundColor: theme.colors.tertiary,
    alignSelf: "center",
    shadowColor: theme.colors.shadow, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
  },

  secondaryButton: {
    width: "90%",
    maxWidth: 100,
    paddingVertical: 8,
    elevation: 3,
    alignSelf: "center",
    marginTop: 10,
  },

  tertiaryButton: {
    position: "absolute",
    bottom: 20,
  },

  primaryButtonText: {
    color: theme.colors.onTertiary,
    textAlign: "center",
    fontWeight: "600",
  },

  secondaryButtonText: {
    color: theme.colors.onPrimaryContainer,
    textAlign: "center",
  },

  tertiaryButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },

  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 4,
  },

  bottomAppbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: theme.colors.surface,
    elevation: 5,
  },
});

export default styles;