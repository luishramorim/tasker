import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from "react-native";
import { Badge, Drawer, Portal } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../../config/theme";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const translateX = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isOpen ? 0 : -250,
      bounciness: isOpen ? 0 : 10,
      speed: 15,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Portal>
      {isOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <SafeAreaView>
          <Drawer.Section>
            <Drawer.Item
              style={{ marginTop: 30, height: 45 }}
              icon={"format-list-bulleted"}
              label="Tarefas"
              active={selectedMenu === "Home"}
              right={() => <Badge style={styles.badge}>2</Badge>}
              onPress={() => {
                setSelectedMenu("Home");
                onClose();
              }}
            />
            <Drawer.Item
              style={{ marginTop: 10, height: 45 }}
              icon={"tag"}
              label="Tags"
              active={selectedMenu === "Profile"}
              onPress={() => {
                setSelectedMenu("Profile");
                onClose();
              }}
            />
            <Drawer.Item
              style={{ marginVertical: 10, height: 45 }}
              icon={() => <Ionicons name="settings-sharp" size={24} color={selectedMenu === "Settings" ? theme.colors.primary : "#333"} />}
              label="Configurações"
              active={selectedMenu === "Settings"}
              onPress={() => {
                setSelectedMenu("Settings");
                onClose();
              }}
            />
          </Drawer.Section>
        </SafeAreaView>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: theme.colors.surface,
    paddingTop: 20,
    zIndex: 1000,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    color: "#fff",
    fontSize: 12,
  },
});

export default Sidebar;